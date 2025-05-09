import React, { useState, useEffect } from "react";
import "./AlertModal.css";
import { MdClose } from "react-icons/md";
import { BiCheckCircle } from "react-icons/bi";
import CustomSmallButton from "../../Buttons/CustomSmallButton";
import { IoCloseCircle } from "react-icons/io5";
import { PiCheckCircleBold } from "react-icons/pi";
import { useAuth } from "../../../context/AuthContext";
import { FiAlertOctagon, FiAlertTriangle } from "react-icons/fi";
import Loading from "../../../utils/Loader";

const AlertOptionModal = ({
  isVisible,
  onClose,
  message,
  runFunction,
  loading,
}) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 1001 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="alert-container">
          <FiAlertTriangle
            className="alert-icon-fail"
            style={{ color: "#ffadbc" }}
          />
          <p style={{ textAlign: "center" }}>{message}</p>
          <div className="option-btn-container">
            <div className="next-btn">
              <CustomSmallButton
                text={loading ? <Loading /> : "Yes"}
                runFunction={runFunction}
                disabled={loading}
              />
            </div>
            <div className="next-btn no-btn-option">
              <CustomSmallButton text={"No"} runFunction={onClose} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertOptionModal;
