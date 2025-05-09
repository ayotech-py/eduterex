import React from "react";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import { useNavigate } from "react-router-dom";
import { FaHourglassHalf, FaLock } from "react-icons/fa";
import "../SchoolNotFound/SchoolNotFound.css"; // Reuse or adjust the existing CSS

const ComingSoon = () => {
  const navigate = useNavigate();
  return (
    <div className="school-not-found-container">
      <div className="school-not-found-card">
        <FaHourglassHalf className="school-icon" />
        <h1 className="title">Coming Soon!!!</h1>
        <p className="message">Stay tuned, work in progress....</p>
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

export default ComingSoon;
