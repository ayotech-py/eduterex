import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
