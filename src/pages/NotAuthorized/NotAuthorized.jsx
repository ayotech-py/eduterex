import React from "react";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import "../SchoolNotFound/SchoolNotFound.css"; // Reuse or adjust the existing CSS

const NotAuthorized = () => {
  const navigate = useNavigate();
  return (
    <div className="school-not-found-container">
      <div className="school-not-found-card">
        <FaLock className="school-icon" />
        <h1 className="title">Access Denied</h1>
        <p className="message">You are not authorized to view this page.</p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CustomSmallButton
            text={"Go Back to Dashboard!"}
            runFunction={() => navigate("/", { replace: true })}
          />
        </div>
      </div>
    </div>
  );
};

export default NotAuthorized;
