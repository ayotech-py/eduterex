import React, { useState } from "react";

const CustomSelectionInput = ({ icon, data, name }) => {
  const [selection, setSelection] = useState("");

  const handleStateChange = (e) => {
    setSelection(e.target.value);
  };

  return (
    <div className="input-form-container">
      <select name={name} value={selection} onChange={handleStateChange}>
        <option value="" disabled>
          {name}
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
