import React, { useState, useEffect } from "react";
import "../AddStaffModal/AddStaffModal.css";
import CustomTextInput from "../../CustomTextInput/CustomTextInput";
import { FiUser, FiMail, FiPhone, FiUserPlus } from "react-icons/fi";
import CustomSelectionInput from "../../CustomSelectionInput/CustomSelectionInput";
import { AiFillCalendar } from "react-icons/ai";
import { AlertBadge } from "../../AlertBadge";
import { isFormValid } from "../../../utils/OnboardingUtils/FormChecker";
import { MdClose } from "react-icons/md";
import Loading from "../../../utils/Loader";
import { RiBook3Line } from "react-icons/ri";
import CustomSmallButton from "../../Buttons/CustomSmallButton";
import { PiCheckCircleBold } from "react-icons/pi";

const PromoteStudentModal = ({
  isVisible,
  onClose,
  handlePromoteStudents,
  isLoading,
  setIsLoading,
  classes,
  current_class,
  current_session,
  current_term,
  data,
}) => {
  const [formData, setFormData] = useState({
    session: "",
    term: "",
    next_class: "",
    current_class: "",
    current_session: "",
    current_term: "",
  });

  useEffect(() => {
    setFormData({
      ...formData,
      session:
        classes[classes.length - 1] !== current_class ? "" : current_session,
      term: classes[classes.length - 1] !== current_class ? "" : current_term,
      current_class: current_class,
      current_session: current_session,
      current_term: current_term,
    });
  }, [current_class, current_session, current_term]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (isFormValid(formData, setMessage)) {
      handlePromoteStudents(formData, setMessage, setIsLoading);
    }
  };

  const clearForm = () => {
    setFormData({
      session: "",
      term: "",
      next_class: "",
      current_class: "",
      current_session: "",
      current_term: "",
    });
    setMessage("");
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Student Promotion</h2>
        <p>Select the new session and new class.</p>
        <MdClose
          className="close-modal"
          onClick={() => {
            clearForm();
            onClose();
          }}
        />
        <div className="modal-sub-container overflow">
          {classes[classes.length - 1] !== current_class && (
            <CustomSelectionInput
              placeholder={"Session"}
              name={"session"}
              value={formData.session}
              handleChange={handleChange}
              data={
                data
                  ?.filter((obj) => obj?.is_active === false)
                  .map((item) => item?.name) || []
              }
              icon={<RiBook3Line className="icons" />}
            />
          )}
          {classes[classes.length - 1] !== current_class && (
            <CustomSelectionInput
              placeholder={"Term"}
              name={"term"}
              value={formData.term}
              handleChange={handleChange}
              data={
                data
                  ?.filter((item) => item?.name === formData?.session)[0]
                  ?.terms?.map((item) => item?.name) || []
              }
              icon={<RiBook3Line className="icons" />}
            />
          )}
          <CustomSelectionInput
            placeholder={"Promote to...."}
            name={"next_class"}
            value={formData.next_class}
            handleChange={handleChange}
            data={
              current_class === classes[classes.length - 1]
                ? ["Graduate students"]
                : classes.filter((item) => item !== current_class)
            }
            icon={<RiBook3Line className="icons" />}
          />
        </div>
        {message && <AlertBadge message={message} />}
        <CustomSmallButton
          text={isLoading ? <Loading /> : "Promote"}
          runFunction={handleSubmit}
          icon={!isLoading && <PiCheckCircleBold className="use-font-style" />}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default PromoteStudentModal;
