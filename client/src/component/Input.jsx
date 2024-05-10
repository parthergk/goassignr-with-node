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
      setMessage("Please enter a Topic to genrate the Assignment ")
      return; 
    }

    if (type === "assignment") {
      setMessage('')
      dispatch(isLoading(true));
      try {
        await axios.post("https://goassignrserver.vercel.app/api/data", {"content": input});
        setInput('');
      } catch (error) {
        console.error("Error submitting assignment:", error);
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
