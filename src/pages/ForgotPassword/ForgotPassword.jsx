import React, { useState } from "react";
import "../Signin/Signin.css";

import { motion, AnimatePresence } from "framer-motion";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import { useNavigate } from "react-router-dom";
import { AlertBadge } from "../../components/AlertBadge";
import { PiIdentificationBadge } from "react-icons/pi";
import Loading from "../../utils/Loader";
import { getOTP } from "../../services/authService";
import VerifyEmailModal from "../../components/modals/VerifyEmailModal";
import { FiLock } from "react-icons/fi";
import { ResetPassword } from "../../services/schoolService";
import AlertModal from "../../components/modals/AlertModal/AlertModal";

const ForgotPasswordEmail = ({
  schoolData,
  currentForm,
  onNext,
  email,
  setEmail,
}) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [receivedOTP, setReceivedOTP] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  const sendVerificationMail = async () => {
    setMessage("");
    setLoading(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    try {
      const response = await getOTP({
        email: email,
        type: "forgotpassword",
        school_id: schoolData?.id,
      });

      setLoading(false);

      if (response.success) {
        setReceivedOTP(response.otp);
        handleOpenModal();
      } else {
        setMessage(response.message);
      }
    } catch (error) {
      setLoading(false);
      setMessage("An error occurred while sending otp.");
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <div className="sigin-header">
          <div className="logo">
            <img src={schoolData?.logo} alt="" srcset="" />
          </div>
          <h2 style={{ fontWeight: 600, color: "#711a75" }}>
            {schoolData?.name}
          </h2>
          <div className="member-div-label">
            <p>Forgot Password</p>
          </div>
          <p style={{ textAlign: "center" }}>
            Please input your email address.
          </p>
          <AlertBadge
            message={
              "Note: If you're a student, please contact your school's administrator for help."
            }
          />
        </div>
        {message && <AlertBadge message={message} />}
        <div className="input-form-container">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={`Email address`}
          />
          <div className="form-icons">
            <PiIdentificationBadge className="icons" />
          </div>
        </div>
        <div className="next-btn">
          <CustomSmallButton
            text={loading ? <Loading /> : "Next"}
            runFunction={sendVerificationMail}
            disabled={loading}
          />
        </div>
      </div>
      <VerifyEmailModal
        isVisible={isModalVisible && receivedOTP}
        onClose={handleCloseModal}
        setEmailVerified={onNext}
        email={email}
        receivedOTP={receivedOTP}
      />
    </div>
  );
};

const EnterPassword = ({ schoolData, currentForm, onNext, email }) => {
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [loading, setLoading] = useState(false);

  const [modalMessage, setModalMessage] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);

  const resetPassword = async () => {
    const body = JSON.stringify({
      password: confirmPassword,
      email: email,
      school_id: schoolData?.id,
    });

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    } else if (password.length <= 8) {
      setMessage("Password must be more than 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await ResetPassword(body);
      setLoading(false);

      if (response.success) {
        setModalMessage("Your password has been reset successfully.");
        setSuccessStatus(true);
        setPassword("");
        setConfirmPassword("");
        setTimeout(onNext, 2000);
      } else {
        setMessage(response.message);
      }
    } catch (error) {
      setLoading(false);
      setMessage("An error occurred while resetting password.");
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <div className="sigin-header">
          <div className="logo">
            <img src={schoolData?.logo} alt="" srcset="" />
          </div>
          <h2 style={{ fontWeight: 600, color: "#711a75" }}>
            {schoolData?.name}
          </h2>
          <div className="member-div-label">
            <p>Forgot Password</p>
          </div>
          <p style={{ textAlign: "center" }}>Please input a new password.</p>
        </div>
        {message && <AlertBadge message={message} />}
        <div className="input-form-container">
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
          />
          <div className="form-icons">
            <FiLock className="icons" />
          </div>
        </div>
        <div className="input-form-container">
          <input
            type="password"
            name="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter Password"
          />
          <div className="form-icons">
            <FiLock className="icons" />
          </div>
        </div>
        <div className="next-btn">
          <CustomSmallButton
            text={loading ? <Loading /> : "Next"}
            runFunction={resetPassword}
            disabled={loading}
          />
        </div>
      </div>
      <AlertModal
        isVisible={modalMessage ? true : false}
        onClose={() => setModalMessage("")}
        message={modalMessage}
        success={successStatus}
      />
    </div>
  );
};

const ForgotPassword = ({ schoolData }) => {
  const [currentForm, setCurrentForm] = useState(1);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const formVariants = {
    initial: (direction) => ({
      x: direction === "next" ? "100%" : "-100%",
      opacity: 0,
    }),
    animate: { x: 0, opacity: 1 },
    exit: (direction) => ({
      x: direction === "next" ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <div className="forgot-container">
      <div className="animation-container">
        <AnimatePresence custom="next" mode="wait">
          {currentForm === 1 && (
            <motion.div
              key="forgotpaswordemail"
              custom="next"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              style={{ width: "100%", height: "100%" }}
            >
              <ForgotPasswordEmail
                currentStep={currentForm}
                schoolData={schoolData}
                onNext={() => setCurrentForm(2)}
                email={email}
                setEmail={setEmail}
              />
            </motion.div>
          )}
          {currentForm === 2 && (
            <motion.div
              key="forgotpaswordemail"
              custom="next"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              style={{ width: "100%", height: "100%" }}
            >
              <EnterPassword
                currentStep={currentForm}
                schoolData={schoolData}
                onNext={() => navigate("/auth/signin")}
                email={email}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ForgotPassword;
