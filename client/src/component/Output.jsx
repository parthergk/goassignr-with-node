import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isLoading } from "../redux/loaderSlice"; // Import isLoading action creator
import jsPDF from 'jspdf';

const Output = () => {
  const [outputData, setOutputData] = useState(""); // State to hold received data as a string
  const loader = useSelector(state => state.load.loading); // Corrected useSelector usage
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/data"); // Connect to WebSocket server

    // WebSocket connection open
    socket.addEventListener("open", function () {
      console.log("WebSocket connection established");
    });

    // Listen for messages
    socket.addEventListener("message", function (event) {
      const newdata = JSON.parse(event.data)[0].text;
      newdata && dispatch(isLoading(false));
      setOutputData(prevData => prevData + newdata); // Append new data to existing string
    });

    // Error handling
    socket.addEventListener("error", function (error) {
      console.error("WebSocket error:", error);
    });

    // Close handling
    socket.addEventListener("close", function () {
      console.log("WebSocket closed");
    });

    // Clean up function to close the WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  const renderSections = () => {
    const sections = outputData.split("\n\n");
    return sections.map((section, index) => {
      if (section.startsWith("**")) {
        return <h2 key={index}>{section.replace(/\*\*/g, "")}</h2>;
      } else if (section.startsWith("*")) {
        return (
          <ul key={index}>
            {section.split("\n").map((item, i) => (
              <li key={i}>{item.replace(/^\* /, "")}</li>
            ))}
          </ul>
        );
      } else {
        return <p key={index}>{section}</p>;
      }
    });
  };

  const renderOutput = () => {
    return (
      <div className="outputdata">
        <div>{renderSections()}</div>
      </div>
    );
  };

  const downloadPdf = () => {  
    const outputText = renderSections().map(element => element.props.children).join('\n');
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.text(outputText, 10, 10);
    pdf.save('output.pdf');
    dispatch(isLoading(false));
  };
  

  // Render output data
  return (
  <>
    <div className="mt-3" id="textOutput">
      <div id="empty"></div>
      {loader && <div className="loader" id="loader">Generating..</div>}
      {outputData && renderOutput()}
    </div>
    <div className="container-btn">
      <div className="horizontally"></div>
      <div className="buttons-2">
        <button id="downloadPdfBtn" onClick={downloadPdf}>Download</button>
        <button id="regenerateBtn">
          <div id="regenerateloader"></div>
          Regenerate
        </button>
      </div>
    </div>
  </>
  );
};

export default Output;
