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
import Loading from "../../../utils/Loader";
import { PiCameraBold, PiCheckCircleBold } from "react-icons/pi";
import "./EditStudentModal.css";
import ContentTitle from "../../ContentTitle";
import { useSchool } from "../../../context/SchoolContext";
import nigeriaStates from "../../../utils/nigeria-state-and-lgas.json";

const EditStudentModal = ({
  isVisible,
  onClose,
  setStudentObject,
  studentObject,
  loading,
  handleUpdateStudent,
}) => {
  const { schoolState, setSchoolDatas, inLatestSession, sessionId, termId } =
    useSchool();
  const { schoolStudents, classes, schoolTuition, schoolSession } = schoolState;

  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    selectedStatus: false,
    studentId: "",
    is_active: "",
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
    address: "",
    studentSubjects: [],
    termId: "",
    sessionId: "",
  });

  useEffect(() => {
    if (isVisible === true) {
      const student_subjects = schoolTuition
        .find(
          (tuition) =>
            tuition.student === studentObject.id &&
            tuition.academic_term === termId,
        )
        .subjects.map((obj) => obj.id);

      setFormData({
        selectedStatus: false,
        studentId: studentObject.id || null,
        is_active: studentObject.is_active || null,
        first_name: studentObject.first_name || "",
        last_name: studentObject.last_name || "",
        middle_name: studentObject.middle_name || "",
        email: studentObject.email_address || "",
        gender: studentObject.gender || "",
        date_of_birth: studentObject.date_of_birth || "",
        date_of_entry: studentObject.date_of_entry || "",
        parent_email: studentObject.parent_email_address || "",
        parent_phone: studentObject.parent_phone_number || "",
        parent_name: studentObject.parent_name || "",
        state_of_origin: studentObject.state_of_origin || "",
        lga: studentObject.lga || "",
        address: studentObject.address || "",
        studentSubjects: [...student_subjects],
        termId: termId,
        sessionId: sessionId,
      });
      setProfileImage(studentObject?.passport ? studentObject?.passport : null);
    }
  }, [isVisible, studentObject]);

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
    setMessage(false);
    const useThisForm = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      gender: formData.gender,
      email: formData.email,
    };
    if (isFormValid(useThisForm, setMessage)) {
      handleUpdateStudent(formData, setMessage);
    } else {
      setAlert(true);
    }
  };

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
            passport: reader.result,
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

  const class_subjects =
    classes.find((obj) => obj.id === studentObject.student_class) || {};

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div
        className="modal-content student-profile-modal"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div
          style={{ textAlign: "center" }}
          className="modal-heading-container"
        >
          <h2>
            {formData.last_name} {formData.first_name} Profile
          </h2>
        </div>
        <MdClose className="close-modal" onClick={onClose} />
        <div className="modal-sub-container overflow student-profile-container">
          <div className="left-div overflow">
            <div className="left-image-div">
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
            </div>
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
            <div style={{ width: "100%", textAlign: "left" }}>
              <CustomTextInput
                placeholder={"Date of Entry"}
                name={"date_of_entry"}
                value={formData.date_of_entry}
                handleChange={handleChange}
                icon={<AiFillCalendar className="icons" />}
              />
              <label style={{ fontSize: "12px" }}>Date of Entry</label>
            </div>
            <div style={{ width: "100%", textAlign: "left" }}>
              <CustomTextInput
                placeholder={"Date of Birth"}
                name={"date_of_birth"}
                value={formData.date_of_birth}
                handleChange={handleChange}
                icon={<AiFillCalendar className="icons" />}
              />
              <label style={{ fontSize: "12px" }}>Date of Birth</label>
            </div>
            <div style={{ width: "100%", textAlign: "left" }}>
              <CustomSelectionInput
                placeholder={"Gender"}
                name={"gender"}
                value={formData.gender}
                handleChange={handleChange}
                data={["Male", "Female"]}
                icon={<FiUserPlus className="icons" />}
              />
              <label style={{ fontSize: "12px" }}>Gender</label>
            </div>
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
            <CustomTextInput
              placeholder={"Address"}
              name={"address"}
              value={formData.address}
              handleChange={handleChange}
              icon={<FiPhone className="icons" />}
            />
            <div className="staff-active-section">
              <h3 style={{ fontWeight: 600 }}>
                Account Status:
                {studentObject?.is_active ? (
                  <span
                    style={{ fontSize: "11px", marginLeft: "5px" }}
                    className="tuition-cleared very-small-font-size"
                  >
                    Active
                  </span>
                ) : (
                  <span
                    style={{ fontSize: "11px", marginLeft: "5px" }}
                    className="tuition-not-cleared very-small-font-size"
                  >
                    Suspended
                  </span>
                )}
              </h3>
              <div className="radio-group role-container">
                <p className="radio-item checkbox-item">
                  {studentObject?.is_active
                    ? "Click to suspend"
                    : "Click to reinstate"}
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={formData.selectedStatus}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        selectedStatus: !prev.selectedStatus,
                      }))
                    }
                  />
                </p>
              </div>
            </div>
          </div>
          <div className="right-div">
            <div className="selection-section">
              <ContentTitle title={"Subjects"} />
              <div className="checkbox-group role-container">
                {class_subjects?.subjects?.map((sub, index) => (
                  <p key={index} className="checkbox-item">
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      value={sub?.name}
                      checked={formData.studentSubjects.includes(sub.id)}
                      onChange={() => {
                        const IDs = formData.studentSubjects;
                        const updatedIDs = IDs.filter((obj) => obj !== sub.id);
                        if (IDs.includes(sub.id)) {
                          setFormData({
                            ...formData,
                            studentSubjects: [...updatedIDs],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            studentSubjects: [...IDs, sub.id],
                          });
                        }
                      }}
                    />
                    {sub?.name}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
        {message && <AlertBadge message={message} />}
        <CustomSmallButton
          text={loading ? <Loading /> : "Update Profile"}
          runFunction={handleAdd}
          icon={!loading && <PiCheckCircleBold className="use-font-style" />}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default EditStudentModal;
