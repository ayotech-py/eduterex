import React from "react";
import { FaCheck } from "react-icons/fa";

export const UseProgressIcon = ({ step, currentStep, setCurrentStep }) => {
  if (step === currentStep) {
    return (
      <div className="icon-container">
        <div className="icon-circle"></div>
      </div>
    );
  } else if (step < currentStep) {
    return (
      <div
        onClick={() => setCurrentStep(step)}
        className="icon-container"
        style={{ cursor: "pointer" }}
      >
        <FaCheck className="icon-checkmark" />
      </div>
    );
  } else {
    return (
      <div className="icon-container-inactive">
        <div className="icon-circle"></div>
      </div>
    );
  }
};
