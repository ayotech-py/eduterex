import React from "react";
import "./CustomTextInput.css";

const CustomTextInput = ({ name, icon }) => {
  return (
    <div className="custom-input-form-container">
      <input type="text" name={name} placeholder={name} />
      <div className="form-icons">{icon}</div>
    </div>
  );
};

export default CustomTextInput;
