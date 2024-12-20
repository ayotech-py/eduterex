import React, { useState, useEffect } from "react";
import "./AddTeachersModal.css"; // Import CSS styles
import CustomTextInput from "../../CustomTextInput/CustomTextInput";
import { FiUser, FiMail, FiPhone, FiUserPlus } from "react-icons/fi";
import CustomSelectionInput from "../../CustomSelectionInput/CustomSelectionInput";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { MdSchool } from "react-icons/md";

const AddTeachersModal = ({ isVisible, onClose }) => {
  const [introImage, setIntroImage] = useState(null);

  useEffect(() => {
    if (!isVisible) return;

    const fileInput = document.getElementById("fileInput");

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setIntroImage(reader.result); // Set the uploaded image
        };
        reader.readAsDataURL(file);
      }
    };

    fileInput.addEventListener("change", handleFileChange);

    return () => {
      fileInput.removeEventListener("change", handleFileChange); // Cleanup event listener
    };
  }, [isVisible]);

  // Return null if the modal is not visible
  if (!isVisible) return null;

  const classList = [
    "Nursery 1",
    "Nursery 2",
    "Nursery 3",
    "Primary 1",
    "Primary 2",
    "Primary 3",
    "Primary 4",
    "Primary 5",
    "Primary 6",
    "JSS 1",
    "JSS 2",
    "JSS 3",
    "SSS 1",
    "SSS 2",
    "SSS 3",
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div>
          <h2>Teachers Profile</h2>
          <p>Please fill in the below details.</p>
        </div>
        <div className="teacher-profile">
          <div className="image-upload">
            <input
              type="file"
              id="fileInput"
              className="hidden"
              accept="image/*"
            />
            <label htmlFor="fileInput" id="imageBox">
              <span className={introImage ? "hid-image" : "show-image"}>
                Click to upload image
              </span>
              {introImage && (
                <img
                  className="show-image"
                  id="uploadedImage"
                  src={introImage}
                  alt="Uploaded"
                />
              )}
            </label>
          </div>
          <CustomTextInput
            name={"Full Name"}
            icon={<FiUser className="icons" />}
          />
          <CustomTextInput
            name={"Email Address"}
            icon={<FiMail className="icons" />}
          />
          <CustomTextInput
            name={"Phone Number"}
            icon={<FiPhone className="icons" />}
          />
          <CustomSelectionInput
            name={"Gender"}
            data={["Male", "Female"]}
            icon={<FiUserPlus className="icons" />}
          />
          <CustomSelectionInput
            name={"Class"}
            data={classList}
            icon={<AiOutlineUsergroupAdd className="icons" />}
          />
        </div>
        <button onClick={onClose}>Add</button>
      </div>
    </div>
  );
};

export default AddTeachersModal;
