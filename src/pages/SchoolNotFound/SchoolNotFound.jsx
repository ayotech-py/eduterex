import React from "react";
import { FaSchool } from "react-icons/fa";
import "./SchoolNotFound.css"; // Importing the CSS file
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";

const SchoolNotFound = () => {
  return (
    <div className="school-not-found-container">
      <div className="school-not-found-card">
        <FaSchool className="school-icon" />
        <h1 className="title">School Not Found</h1>
        <p className="message">
          Oops! We couldn't find the school you're looking for. It might have
          been removed or doesn't exist.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CustomSmallButton
            text={"Go back home"}
            runFunction={() =>
              window.location.replace("https://eduterex.com.ng/")
            }
          />
        </div>
      </div>
    </div>
  );
};

export default SchoolNotFound;
