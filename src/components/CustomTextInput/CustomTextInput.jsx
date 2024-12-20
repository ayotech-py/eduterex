import React from "react";
import "./CustomTextInput.css";

const CustomTextInput = ({ name, icon, handleChange, value, placeholder }) => {
  return (
    <div className="custom-input-form-container">
      <input
        type="text"
        name={name}
        value={value}
        onChange={(e) => handleChange(e)}
        placeholder={placeholder}
      />
      <div className="form-icons">{icon}</div>
    </div>
  );
};

export default CustomTextInput;
