import React from "react";
import "./FeatureLockModal.css";
import { IoLockClosed } from "react-icons/io5";
import CustomSmallButton from "../../Buttons/CustomSmallButton";
import { Link, useNavigate } from "react-router-dom";
import { PiCheckCircleBold } from "react-icons/pi";
import { useAuth } from "../../../context/AuthContext";

const FeatureLockModal = ({ isLocked, message }) => {
  const navigate = useNavigate();
  const { authState, updateUser } = useAuth();
  const { user } = authState;
  const schoolSubscription = user?.school?.subscription;

  if (!isLocked) return null;

  return (
    <div className="feature-lock-container">
      <div className="blurred-content"></div>
      <div className="feature-lock-message">
        <IoLockClosed className="lock-icon" />
        <p>
          {schoolSubscription?.active
            ? `You just discovered a feature which is not included in your current subscription. Please upgrade your plan to access it.`
            : "You dont have an active subscription or your subscription have expired, please subscribe to a new plan."}
        </p>
        <CustomSmallButton
          text="Upgrade Plan"
          runFunction={() => navigate("/subscription")}
          icon={<PiCheckCircleBold className="use-font-style" />}
        />
      </div>
    </div>
  );
};

export default FeatureLockModal;
