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
import { FaCheckCircle } from "react-icons/fa";
import { PiCheckCircleBold } from "react-icons/pi";

const ActivateSessionModal = ({
  isVisible,
  onClose,
  handleActivateSession,
  isLoading,
  setIsLoading,
  data,
}) => {
  const [formData, setFormData] = useState({
    session: "",
    term: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    setAlert(false);
    if (isFormValid(formData, setMessage)) {
      handleActivateSession(formData, setMessage);
      //onClose();
    } else {
      setAlert(true);
    }
  };

  const clearForm = () => {
    setFormData({
      session: "",
      term: "",
    });
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div
          style={{ textAlign: "center" }}
          className="modal-heading-container"
        >
          <h2>Actions</h2>
          <p>Select session and term to activate.</p>
        </div>
        <MdClose className="close-modal" onClick={onClose} />
        <div className="modal-sub-container overflow">
          <CustomSelectionInput
            placeholder={"Session"}
            name={"session"}
            value={formData.session}
            handleChange={handleChange}
            data={data?.map((item) => item?.name) || []}
            icon={<RiBook3Line className="icons" />}
          />
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
        </div>
        {message && <AlertBadge message={message} />}
        <CustomSmallButton
          text={isLoading ? <Loading /> : "Activate"}
          runFunction={handleSubmit}
          disabled={isLoading}
          icon={!isLoading && <PiCheckCircleBold className="use-font-style" />}
        />
      </div>
    </div>
  );
};

export default ActivateSessionModal;
