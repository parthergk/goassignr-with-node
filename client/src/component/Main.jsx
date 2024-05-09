import React from "react";
import Output from "./Output";
import DowRegButton from "./DowRegButton";
import Input from "./Input";

const Main = () => {
  return (
    <div className="center-container">
      <div className="title">Generate Assignment/Essay with AI</div>
      <Input/>
      <Output/>
      <DowRegButton/>
    </div>
  );
};

export default Main;
