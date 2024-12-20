import React, { useState, useEffect } from "react";
import "./AddTeachersModal.css"; // Import CSS styles
import CustomTextInput from "../../CustomTextInput/CustomTextInput";
import { FiUser, FiMail, FiPhone, FiUserPlus } from "react-icons/fi";
import CustomSelectionInput from "../../CustomSelectionInput/CustomSelectionInput";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { AlertBadge } from "../../AlertBadge";
import { isFormValid } from "../../../utils/OnboardingUtils/FormChecker";
import { doesObjectExist } from "../../../utils/OnboardingUtils/ObjectChecker";

const AddTeachersModal = ({
  isVisible,
  onClose,
  setAppendTeacherObject,
  appendTeacherObject,
  setEditIndex,
  isEdit,
}) => {
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    profile_image: null,
    full_name: "",
    email: "",
    phone_number: "",
    gender: "",
    class: "",
  });

  useEffect(() => {
    if (isVisible === true && isEdit) {
      setFormData({
        profile_image: isEdit
          ? appendTeacherObject[isEdit - 1].profile_image
          : null,
        full_name: isEdit ? appendTeacherObject[isEdit - 1].full_name : "",
        email: isEdit ? appendTeacherObject[isEdit - 1].email : "",
        phone_number: isEdit
          ? appendTeacherObject[isEdit - 1].phone_number
          : "",
        gender: isEdit ? appendTeacherObject[isEdit - 1].gender : "",
        class: isEdit ? appendTeacherObject[isEdit - 1].class : "",
      });
      setProfileImage(appendTeacherObject[isEdit - 1].profile_image);
      setProfileImage(
        isEdit ? appendTeacherObject[isEdit - 1].profile_image : null,
      );
    }
  }, [isVisible, isEdit, appendTeacherObject]);

  useEffect(() => {
    if (!isVisible) return;

    const fileInput = document.getElementById("fileInput");

    const handleFileChange = (e) => {
      const file = e.target.files[0];
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
      [name]: files ? files[0] : value,
    });
  };

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

  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");

  const handleAdd = () => {
    setAlert(false);
    if (isFormValid(formData, setMessage)) {
      if (doesObjectExist(appendTeacherObject, formData)) {
        setMessage("Teacher with this information already exists.");
        setAlert(true);
        return;
      } else {
        if (isEdit) {
          appendTeacherObject[isEdit - 1] = formData;
          setAppendTeacherObject([...appendTeacherObject]);
          setEditIndex(null);
        } else {
          setAppendTeacherObject((prevData) => [...prevData, formData]);
          setFormData({
            profile_image: null,
            full_name: "",
            email: "",
            phone_number: "",
            gender: "",
            class: "",
          });
          setProfileImage(null);
        }
      }
      onClose();
    } else {
      setAlert(true);
    }
  };
  // Return null if the modal is not visible
  if (!isVisible) return null;

  return (
    <div
      className="modal-overlay"
      onClick={() => {
        onClose();
        setFormData({
          profile_image: null,
          full_name: "",
          email: "",
          phone_number: "",
          gender: "",
          class: "",
        });
        setEditIndex(null);
        setProfileImage(null);
      }}
    >
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
              <span className={profileImage ? "hid-image" : "show-image"}>
                Click to upload image
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
            placeholder={"Class"}
            name={"class"}
            value={formData.class}
            handleChange={handleChange}
            data={classList}
            icon={<AiOutlineUsergroupAdd className="icons" />}
          />
        </div>
        {alert && <AlertBadge message={message} />}
        <button onClick={handleAdd}>{isEdit ? "Update" : "Add"}</button>
      </div>
    </div>
  );
};

export default AddTeachersModal;
