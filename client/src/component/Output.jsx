import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isLoading } from "../redux/loaderSlice"; // Import isLoading action creator

const Output = () => {
  const [outputData, setOutputData] = useState(""); // State to hold received data as a string
  const loader = useSelector(state => state.load.loading); // Corrected useSelector usage
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = new WebSocket("wss://goassignrserver.vercel.app:8080"); // Connect to WebSocket server
    // Listen for messages
    socket.addEventListener("message", function (event) {
      const newdata = JSON.parse(event.data)[0].text;
      newdata && dispatch(isLoading(false));
      setOutputData(prevData => prevData + newdata); // Append new data to existing string
    });

    // Error handling
    socket.addEventListener("error", function (event) {
      console.error("WebSocket error:", event);
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
        <p>
        <div>{renderSections()}</div>
        </p>
      </div>
    );
  };

  // Render output data
  return (
    <div className="mt-3" id="textOutput">
      <div id="empty"></div>
      {loader && <div className="loader" id="loader">Generating..</div>}
      {outputData && renderOutput()}
    </div>
  );
};

export default Output;
