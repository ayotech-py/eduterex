import React, { useState, useEffect } from "react";
import "../AddStaffModal/AddStaffModal.css";
import CustomTextInput from "../../CustomTextInput/CustomTextInput";
import { FiUser, FiMail, FiPhone, FiUserPlus } from "react-icons/fi";
import CustomSelectionInput from "../../CustomSelectionInput/CustomSelectionInput";
import { AiOutlineUsergroupAdd, AiFillCalendar } from "react-icons/ai";
import { AlertBadge } from "../../AlertBadge";
import { isFormValid } from "../../../utils/OnboardingUtils/FormChecker";
import { MdClose } from "react-icons/md";
import { doesObjectExist } from "../../../utils/OnboardingUtils/ObjectChecker";
import { RiBook3Line } from "react-icons/ri";
import CustomSmallButton from "../../Buttons/CustomSmallButton";
import { allowedImageTypes, compressImage } from "../../../utils/Utils";
import { PiCameraBold } from "react-icons/pi";
import nigeriaStates from "../../../utils/nigeria-state-and-lgas.json";

const AddStudentModal = ({
  isVisible,
  onClose,
  setStudentObject,
  studentObject,
  setEditIndex,
  studentList,
  setStudentList,
  isEdit,
  classList,
  termId,
  sessionId,
  sessionList,
}) => {
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    gender: "",
    date_of_birth: "",
    date_of_entry: "",
    parent_email: "",
    parent_phone: "",
    parent_name: "",
    state_of_origin: "",
    lga: "",
    class: "",
    address: "",
    session: sessionId,
    term: termId,
  });

  useEffect(() => {
    if (isVisible === true && isEdit) {
      setFormData({
        first_name: isEdit ? studentObject.first_name : "",
        last_name: isEdit ? studentObject.last_name : "",
        middle_name: isEdit ? studentObject.middle_name : "",
        email: isEdit ? studentObject.email : "",
        gender: isEdit ? studentObject.gender : "",
        date_of_birth: isEdit ? studentObject.date_of_birth : "",
        date_of_entry: isEdit ? studentObject.date_of_entry : "",
        parent_email: isEdit ? studentObject.parent_email : "",
        parent_phone: isEdit ? studentObject.parent_phone : "",
        class: isEdit ? studentObject.class : "",
        parent_name: isEdit ? studentObject.parent_name : "",
        state_of_origin: isEdit ? studentObject.state_of_origin : "",
        lga: isEdit ? studentObject.lga : "",
        address: isEdit ? studentObject.address : "",
        session: sessionId,
        term: termId,
      });
      setProfileImage(isEdit ? studentObject.profile_image : null);
      if (studentObject.profile_image) {
        setFormData({
          ...formData,
          profile_image: isEdit ? studentObject.profile_image : null,
        });
      }
    }
    setFormData((prev) => ({ ...prev, session: sessionId, term: termId }));
  }, [isVisible, isEdit, studentObject]);

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

  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");

  const handleAdd = () => {
    setAlert(false);
    const useThisForm = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      class: formData.class,
      gender: formData.gender,
      email: formData.email,
    };
    if (isFormValid(useThisForm, setMessage)) {
      if (doesObjectExist(studentList, formData)) {
        setMessage("Student with this information already exists.");
        setAlert(true);
        return;
      } else {
        if (isEdit) {
          studentList[isEdit - 1] = formData;
          setStudentList([...studentList]);
          clearForm();
        } else {
          setStudentList((prevData) => [...prevData, formData]);
          clearForm();
        }
      }
      setStudentObject(formData);
      onClose();
    } else {
      setAlert(true);
    }
  };

  const clearForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      middle_name: "",
      email: "",
      gender: "",
      date_of_birth: "",
      date_of_entry: "",
      parent_email: "",
      parent_phone: "",
      parent_name: "",
      state_of_origin: "",
      lga: "",
      class: "",
      address: "",
      session: "",
      term: "",
    });
    if (setEditIndex) {
      setEditIndex(null);
    }
    setProfileImage(null);
  };

  const current_session = sessionList?.find((item) => item?.id === sessionId);
  const current_term = current_session?.terms.find(
    (item) => item?.id === termId,
  );
  // Return null if the modal is not visible
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div
        className="modal-content-student"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div
          style={{ textAlign: "center" }}
          className="modal-heading-container"
        >
          <h2>Student Registration</h2>
          <AlertBadge
            message={
              "These informations cannot be edited later, so ensure all details are entered correctly."
            }
            icon={false}
          />
        </div>
        <MdClose className="close-modal" onClick={onClose} />
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
          <div className="input-flex">
            <CustomTextInput
              name={"first_name"}
              placeholder={"First Name"}
              value={formData.first_name}
              handleChange={handleChange}
              icon={<FiUser className="icons" />}
            />
            <CustomTextInput
              name={"last_name"}
              placeholder={"Last Name"}
              value={formData.last_name}
              handleChange={handleChange}
              icon={<FiUser className="icons" />}
            />
          </div>
          <div className="input-flex">
            <CustomTextInput
              name={"middle_name"}
              placeholder={"Middle Name"}
              value={formData.middle_name}
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
          </div>
          <div className="input-flex">
            <div style={{ width: "100%", textAlign: "left" }}>
              <label>Date of Entry</label>
              <CustomTextInput
                placeholder={"Date of Entry"}
                name={"date_of_entry"}
                value={formData.date_of_entry}
                handleChange={handleChange}
                icon={<AiFillCalendar className="icons" />}
              />
            </div>
            <div style={{ width: "100%", textAlign: "left" }}>
              <label>Date of Birth</label>
              <CustomTextInput
                placeholder={"Date of Birth"}
                name={"date_of_birth"}
                value={formData.date_of_birth}
                handleChange={handleChange}
                icon={<AiFillCalendar className="icons" />}
              />
            </div>
            <div style={{ width: "100%", textAlign: "left" }}>
              <label>Gender</label>
              <CustomSelectionInput
                placeholder={"Gender"}
                name={"gender"}
                value={formData.gender}
                handleChange={handleChange}
                data={["Male", "Female"]}
                icon={<FiUserPlus className="icons" />}
              />
            </div>
          </div>
          <div className="input-flex">
            <CustomTextInput
              name={"parent_name"}
              placeholder={"Parent Name"}
              value={formData.parent_name}
              handleChange={handleChange}
              icon={<FiPhone className="icons" />}
            />
            <CustomTextInput
              name={"parent_phone"}
              placeholder={"Parent Phone Number"}
              value={formData.parent_phone}
              handleChange={handleChange}
              icon={<FiPhone className="icons" />}
            />
            <CustomTextInput
              name={"parent_email"}
              placeholder={"Parent Email Address"}
              value={formData.parent_email}
              handleChange={handleChange}
              icon={<FiMail className="icons" />}
            />
          </div>
          <div className="input-flex">
            <div className="custom-input-form-container">
              <select
                name="state_of_origin"
                value={formData.state_of_origin}
                onChange={handleChange}
              >
                <option value="">Select State</option>
                {nigeriaStates.map((state) => (
                  <option key={state.alias} value={state.state}>
                    {state.state}
                  </option>
                ))}
              </select>
            </div>
            <div className="custom-input-form-container">
              <select name="lga" value={formData.lga} onChange={handleChange}>
                <option value="">Select LGA</option>
                {nigeriaStates
                  .find((state) => state.state === formData.state_of_origin)
                  ?.lgas.map((lga) => (
                    <option key={lga} value={lga}>
                      {lga}
                    </option>
                  ))}
              </select>
            </div>
            <CustomSelectionInput
              placeholder={"Class"}
              name={"class"}
              value={formData.class}
              handleChange={handleChange}
              data={classList}
              icon={<AiOutlineUsergroupAdd className="icons" />}
            />
          </div>
          <CustomTextInput
            placeholder={"Address"}
            name={"address"}
            value={formData.address}
            handleChange={handleChange}
            icon={<FiPhone className="icons" />}
          />
          <div className="input-flex">
            <CustomTextInput
              placeholder={"Session"}
              name={"session"}
              value={current_session?.name}
              icon={<RiBook3Line className="icons" />}
              disabled={true}
            />
            <CustomTextInput
              placeholder={"Term"}
              name={"term"}
              value={current_term?.name}
              icon={<RiBook3Line className="icons" />}
              disabled={true}
            />
          </div>
        </div>
        {alert && <AlertBadge message={message} />}
        <CustomSmallButton
          text={isEdit ? "Update" : "Add"}
          runFunction={handleAdd}
          icon={<FiUserPlus size={"16px"} />}
        />
      </div>
    </div>
  );
};

export default AddStudentModal;
