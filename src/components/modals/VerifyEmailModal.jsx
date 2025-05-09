import React, { useState, useEffect } from "react";
import "./AddClassModal/AddClassModal.css"; // Import CSS styles
import CustomTextInput from "../CustomTextInput/CustomTextInput";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { AlertBadge } from "../AlertBadge";
import { MdClose } from "react-icons/md";
import CustomSmallButton from "../Buttons/CustomSmallButton";
import { PiCheckCircleBold, PiPlusCircleBold } from "react-icons/pi";
import { compareOTP } from "../../utils/Utils";

const VerifyEmailModal = ({
  isVisible,
  onClose,
  setEmailVerified,
  email,
  receivedOTP,
}) => {
  const [otp, setOtp] = useState("");

  const [message, setMessage] = useState("");

  const verifyEmail = () => {
    setMessage("");
    if (compareOTP(otp, receivedOTP)) {
      setEmailVerified();
      onClose();
    } else {
      setMessage("Invalid OTP");
    }
  };

  useEffect(() => {
    setMessage("");
  }, [receivedOTP]);

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div
          style={{ textAlign: "center" }}
          className="modal-heading-container"
        >
          <h2>Verify Email</h2>
          <p>
            An OTP have been sent to {email}. Please check your mail. If you
            dont get it, please check your spam.
          </p>
        </div>
        <MdClose className="close-modal" onClick={onClose} />
        <div className="modal-sub-container overflow">
          <CustomTextInput
            name={"otp"}
            placeholder={"OTP"}
            value={otp}
            handleChange={(e) => setOtp(e.target.value)}
            icon={<AiOutlineUsergroupAdd className="icons" />}
          />
        </div>
        {message && <AlertBadge message={message} />}
        <CustomSmallButton
          text={"Verify Email"}
          icon={<PiCheckCircleBold className="use-font-style" />}
          runFunction={verifyEmail}
        />
      </div>
    </div>
  );
};

export default VerifyEmailModal;
