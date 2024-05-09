import React from "react";

const DowRegButton = () => {
  return (
    <div className="container-btn">
      <div className="horizontally"></div>
      <div className="buttons-2">
        <button id="downloadPdfBtn">Download</button>
        <button id="regenerateBtn">
          <div id="regenerateloader"></div>
          Regenerate
        </button>
      </div>
    </div>
  );
};

export default DowRegButton;
