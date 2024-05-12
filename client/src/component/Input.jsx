import { useState } from "react";
import Topic from "./Topic";
import axios from "axios";
import { useDispatch } from "react-redux";
import { isLoading } from "../redux/loaderSlice";

const Input = () => {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    if (input.trim() === "") {
      setMessage("Please enter a Topic to generate the Assignment")
      return; 
    }

    if (type === "assignment") {
      setMessage('');
      dispatch(isLoading(true));
      try {
        await axios.post("http://localhost:8080/data", { "content": input });
        setInput('');
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          setMessage(`Error: ${error.response.status} - ${error.response.data.message}`);
        } else if (error.request) {
          // The request was made but no response was received
          setMessage("Error: No response received from server");
        } else {
          // Something happened in setting up the request that triggered an Error
          setMessage(`Error: ${error.message}`);
        }
      } finally {
        dispatch(isLoading(false));
      }
    }
  };

  return (
    <>
      <form>    
        <div className="search-bar">
          <Topic />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="form-control"
            type="text"
            id="topicInput"
            placeholder="Enter topic"
          />
          <div className="search-bar-item"></div>
          <div className="mic-container">
            <span className="send" onClick={(e) => handleSubmit(e, "assignment")}>Send</span>
          </div>
        </div>
        <div className="message">{message && message}</div>
      </form>
      <div className="ass">Assignment</div>
    </>
  );
};

export default Input;
