import React from "react";
import "./CustomTextInput.css";

const CustomTextInput = ({
  name,
  icon,
  handleChange,
  value,
  placeholder,
  disabled,
}) => {
  return (
    <div className="custom-input-form-container">
      <input
        id={name}
        type={
          name.includes("date")
            ? "date"
            : name.toLowerCase().includes("amount")
              ? "number"
              : name.includes("password")
                ? "password"
                : name.includes("time")
                  ? "time"
                  : "text"
        }
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

export default CustomTextInput;
