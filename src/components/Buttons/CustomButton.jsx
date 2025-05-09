import React from "react";

const CustomButton = ({ runFunction, text }) => {
  return (
    <div className="btn-container home-btn">
      <button className="btn" onClick={runFunction}>
        {text}
      </button>
    </div>
  );
};

export default CustomButton;
