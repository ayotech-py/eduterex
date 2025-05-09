import React from "react";

const CustomSmallButton = ({ runFunction, text, icon, disabled }) => {
  return (
    <div
      className="btn-container-small home-btn"
      style={{
        width: "min-content",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <button
        className="btn"
        onClick={runFunction}
        disabled={disabled ?? false}
      >
        {icon}
        {text}
      </button>
    </div>
  );
};

export default CustomSmallButton;
