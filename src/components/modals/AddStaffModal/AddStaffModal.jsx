import React, { useState, useEffect } from "react";
import "./AddStaffModal.css"; // Import CSS styles
import CustomTextInput from "../../CustomTextInput/CustomTextInput";
import { FiUser, FiMail, FiPhone, FiUserPlus } from "react-icons/fi";
import CustomSelectionInput from "../../CustomSelectionInput/CustomSelectionInput";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { AlertBadge } from "../../AlertBadge";
import { isFormValid } from "../../../utils/OnboardingUtils/FormChecker";
import { MdClose } from "react-icons/md";
import { doesObjectExist } from "../../../utils/OnboardingUtils/ObjectChecker";
import CustomSmallButton from "../../Buttons/CustomSmallButton";
import {
  allowedImageTypes,
  checkImageType,
  compressImage,
} from "../../../utils/Utils";
import { PiCameraBold } from "react-icons/pi";

const AddStaffModal = ({
  isVisible,
  onClose,
  setStaffObject,
  staffObject,
  setEditIndex,
  staffList,
  setStaffList,
  isEdit,
  classList,
}) => {
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    gender: "",
    class: "",
  });

  useEffect(() => {
    if (isVisible === true && isEdit) {
      setFormData({
        full_name: isEdit ? staffObject.full_name : "",
        email: isEdit ? staffObject.email : "",
        phone_number: isEdit ? staffObject.phone_number : "",
        gender: isEdit ? staffObject.gender : "",
        class: isEdit ? staffObject.class : "",
      });
      setProfileImage(isEdit ? staffObject.profile_image : null);
      if (staffObject.profile_image) {
        setFormData({
          ...formData,
          profile_image: isEdit ? staffObject.profile_image : null,
        });
      }
    }
  }, [isVisible, isEdit, staffObject]);

  useEffect(() => {
    if (!isVisible) return;

    const fileInput = document.getElementById("fileInput");

    const handleFileChange = async (e) => {
      const uploaded_file = e.target.files[0];
      if (!allowedImageTypes.includes(uploaded_file?.type)) {
        setMessage("Only PNG or JPEG images are allowed.");
        return;
      }
      const file = await compressImage(e.target.files[0]);
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImage(reader.result); // Set the uploaded image
          setFormData({
            ...formData,
            profile_image: reader.result,
          });
        };
        reader.readAsDataURL(file);
      }
    };

    fileInput.addEventListener("change", handleFileChange);

    return () => {
      fileInput.removeEventListener("change", handleFileChange); // Cleanup event listener
    };
  }, [isVisible, formData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : name.includes("email") ? value.trim() : value,
    });
  };

  const [message, setMessage] = useState("");

  const handleAdd = () => {
    setMessage("");
    if (isFormValid(formData, setMessage)) {
      if (doesObjectExist(staffList, formData)) {
        if (!isEdit) {
          setMessage("Teacher with this information already exists.");
          return;
        }
      } else {
        if (isEdit) {
          staffList[isEdit - 1] = formData;
          setStaffList([...staffList]);
          clearForm();
        } else {
          setStaffList((prevData) => [...prevData, formData]);
          clearForm();
        }
      }
      setStaffObject(formData);
      onClose();
    }
  };

  const clearForm = () => {
    setFormData({
      full_name: "",
      email: "",
      phone_number: "",
      gender: "",
      class: "",
    });
    if (setEditIndex) {
      setEditIndex(null);
    }
    setProfileImage(null);
  };
  // Return null if the modal is not visible
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
          <h2>Staff Registration</h2>
          <AlertBadge
            message={
              "Ensure the staff email address is valid, as a mail containing their login credentials will be sent to the provided address."
            }
            icon={false}
          />
        </div>
        <MdClose
          className="close-modal"
          onClick={() => {
            clearForm();
            onClose();
          }}
        />
        <div className="modal-sub-container overflow">
          <div className="image-upload">
            <input
              type="file"
              id="fileInput"
              className="hidden"
              accept="image/*"
            />
            <label htmlFor="fileInput" id="imageBox">
              <span className={profileImage ? "hid-image" : "show-image"}>
                <PiCameraBold
                  size={50}
                  color="#711a75"
                  className="camera-icon"
                />
              </span>
              {profileImage && (
                <img
                  className="show-image"
                  id="uploadedImage"
                  src={profileImage}
                  alt="Uploaded"
                />
              )}
            </label>
          </div>
          <CustomTextInput
            name={"full_name"}
            placeholder={"Full Name"}
            value={formData.full_name}
            handleChange={handleChange}
            icon={<FiUser className="icons" />}
          />
          <CustomTextInput
            name={"email"}
            placeholder={"Email Address"}
            value={formData.email}
            handleChange={handleChange}
            icon={<FiMail className="icons" />}
          />
          <CustomTextInput
            placeholder={"Phone Number"}
            name={"phone_number"}
            value={formData.phone_number}
            handleChange={handleChange}
            icon={<FiPhone className="icons" />}
          />
          <CustomSelectionInput
            placeholder={"Gender"}
            name={"gender"}
            value={formData.gender}
            handleChange={handleChange}
            data={["Male", "Female"]}
            icon={<FiUserPlus className="icons" />}
          />
          <CustomSelectionInput
            placeholder={"Role"}
            name={"class"}
            value={formData.class}
            handleChange={handleChange}
            data={classList}
            icon={<AiOutlineUsergroupAdd className="icons" />}
          />
        </div>
        {message && <AlertBadge message={message} />}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CustomSmallButton
            runFunction={handleAdd}
            text={isEdit ? "Update" : "Add"}
            icon={<FiUserPlus size={"16px"} />}
          />
        </div>
      </div>
    </div>
  );
};

export default AddStaffModal;
