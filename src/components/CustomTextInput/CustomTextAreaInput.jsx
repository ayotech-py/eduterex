import React from "react";
import "./CustomTextInput.css";

const CustomTextAreaInput = ({
  name,
  icon,
  handleChange,
  value,
  placeholder,
  disabled,
}) => {
  return (
    <div className="custom-input-form-container">
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => handleChange(e)}
        placeholder={placeholder}
        disabled={disabled}
      />
      {/* <label style={{ fontSize: "13px" }}>{placeholder}</label> */}
      {/* <div className="form-icons">{icon}</div> */}
    </div>
  );
};

export default CustomTextAreaInput;
