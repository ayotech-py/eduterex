import React, { useState, useEffect } from "react";
import "./ShowProfile.css"; // Import CSS styles
import { MdClose } from "react-icons/md";

const ShowProfile = ({ isVisible, onClose, formData }) => {
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
          {" "}
          <h2>Staff Profile</h2>
        </div>
        <MdClose className="close-modal" onClick={onClose} />
        <div className="modal-sub-container overflow">
          <div className="profile-upload">
            <img
              src={
                formData?.passport
                  ? formData.passport
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              alt="Uploaded"
            />
          </div>
          {Object.entries(formData).map(([field, value]) => {
            if (field === "passport") return null;

            return (
              <div className="profile_list" key={field}>
                <p>{field?.replaceAll("_", " ").toUpperCase()}:</p>
                <p>{value ? value.toUpperCase() : "NULL"}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShowProfile;
