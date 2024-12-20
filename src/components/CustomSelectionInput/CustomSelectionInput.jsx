import React, { useState } from "react";

const CustomSelectionInput = ({
  icon,
  data,
  name,
  handleChange,
  value,
  placeholder,
}) => {
  const handleStateChange = (e) => {
    handleChange(e);
  };

  return (
    <div className="custom-input-form-container">
      <select name={name} value={value} onChange={handleStateChange}>
        <option value="" disabled>
          {placeholder}
        </option>
        {data.map((obj) => (
          <option key={obj} value={obj}>
            {obj}
          </option>
        ))}
      </select>
      <div className="form-icons">{icon}</div>
    </div>
  );
};

export default CustomSelectionInput;
