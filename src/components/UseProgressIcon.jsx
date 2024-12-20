import React from "react";
import { FaCheck } from "react-icons/fa";

export const UseProgressIcon = ({ step, currentStep }) => {
  if (step === currentStep) {
    return (
      <div className="icon-container">
        <div className="icon-circle"></div>
      </div>
    );
  } else if (step < currentStep) {
    return (
      <div className="icon-container">
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
