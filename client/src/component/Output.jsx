import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import store from "../redux/store";
import { isLoading } from "../redux/loaderSlice"; // Import isLoading action creator

const Output = () => {
  const [outputData, setOutputData] = useState([]); // State to hold received data
  const loader = useSelector(state => state.load.loading); // Corrected useSelector usage
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080"); // Connect to WebSocket server
    // Listen for messages
    socket.addEventListener("message", function (event) {
      const newdata = JSON.parse(event.data)[0].text;
      newdata && dispatch(isLoading(false))
      setOutputData(prevData => [...prevData, newdata]); // Assuming data is in JSON format
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

  console.log(loader);
  
  // Render output data
  return (
    <div className="mt-3" id="textOutput">
      <div id="empty"></div>
      {loader && <div className="loader" id="loader">Generating..</div>}
      {outputData.length > 0 && <p>{outputData}</p>}
    </div>
  );
};

export default Output;
