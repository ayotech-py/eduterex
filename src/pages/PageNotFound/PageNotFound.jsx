import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import "../SchoolNotFound/SchoolNotFound.css"; // Reuse or adjust the existing CSS
import { useNavigate } from "react-router-dom";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="school-not-found-container">
      <div className="school-not-found-card">
        <FaExclamationTriangle className="school-icon" />
        <h1 className="title">Page Not Found</h1>
        <p className="message">
          Oops! The page you're looking for doesn’t exist or has been moved.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CustomSmallButton
            text={"Go back home"}
            runFunction={() => navigate("/", { replace: true })}
          />
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
