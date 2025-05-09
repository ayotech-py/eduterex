import React, { useState, useEffect } from "react";
import "./AlertModal.css";
import { MdClose } from "react-icons/md";
import { BiCheckCircle } from "react-icons/bi";
import CustomSmallButton from "../../Buttons/CustomSmallButton";
import { IoCloseCircle } from "react-icons/io5";
import { PiCheckCircleBold } from "react-icons/pi";
import { useAuth } from "../../../context/AuthContext";

const AlertModal = ({ isVisible, onClose, message, success }) => {
  const { logout } = useAuth();

  if (!isVisible) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 1001 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="alert-container">
          {success ? (
            <BiCheckCircle className="alert-icon-success" />
          ) : (
            <IoCloseCircle className="alert-icon-fail" />
          )}
          <p style={{ textAlign: "center" }}>
            {message.detail
              ? "Your session have expired, please login again!"
              : message}
          </p>
          <div className="next-btn">
            <CustomSmallButton
              icon={<PiCheckCircleBold className="use-font-style" />}
              text={"Okay"}
              runFunction={message.detail ? () => logout() : onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
