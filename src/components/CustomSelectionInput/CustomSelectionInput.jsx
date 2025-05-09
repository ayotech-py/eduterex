import React, { useState } from "react";

const CustomSelectionInput = ({
  icon,
  data,
  name,
  handleChange,
  value,
  placeholder,
  options,
  small,
}) => {
  const handleStateChange = (e) => {
    handleChange(e);
  };

  return (
    <div className={`custom-input-form-container ${small ? "small-s-i" : ""}`}>
      <select name={name} value={value} onChange={handleStateChange}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options
          ? options?.map((obj, index) => (
              <option key={index} value={obj?.value}>
                {obj?.label}
              </option>
            ))
          : data?.map((obj, idx) => (
              <option key={idx} value={obj}>
                {obj}
              </option>
            ))}
      </select>
      {/* <label style={{ fontSize: "13px" }}>{placeholder}</label> */}
      {/* <div className="form-icons">{icon}</div> */}
    </div>
  );
};

export default CustomSelectionInput;
