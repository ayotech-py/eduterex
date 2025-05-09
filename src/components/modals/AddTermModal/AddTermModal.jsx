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
import BillManagement from "../../BillManagement/BillManagement";
import CustomSmallButton from "../../Buttons/CustomSmallButton";
import { PiCheckCircleBold } from "react-icons/pi";
import WaiverBills from "../../BillManagement/WaiverBills";

const AddTermModal = ({
  isVisible,
  onClose,
  handleCreateTerm,
  isLoading,
  setIsLoading,
}) => {
  const [formData, setFormData] = useState({
    term_name: "",
    term_start_date: "",
    term_end_date: "",
    extra_bills: [],
    waivers: [],
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
    const checkformData = { ...formData, extra_bills: [0], waivers: [0] };
    if (isFormValid(checkformData, setMessage)) {
      handleCreateTerm(formData, setMessage);
    } else {
      setAlert(true);
    }
  };

  const clearForm = () => {
    setFormData({
      term_name: "",
      term_start_date: "",
      term_end_date: "",
      extra_bills: [],
      waivers: [],
    });
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <MdClose
          className="close-modal"
          onClick={() => {
            onClose();
            clearForm();
          }}
        />
        <div
          style={{ textAlign: "center" }}
          className="modal-heading-container"
        >
          <h2>Create Academic Term</h2>
          <p style={{ textAlign: "center" }}>
            Note: Creating a new term will close the previous term and set up
            all academic activities for the new one.
          </p>
        </div>
        <div className="modal-sub-container overflow">
          <CustomTextInput
            name={"term_name"}
            placeholder={"Name of term"}
            value={formData.term_name}
            handleChange={handleChange}
            icon={<FiUser className="icons" />}
          />
          <div style={{ width: "100%", textAlign: "left" }}>
            <label>Start Date</label>
            <CustomTextInput
              name={"term_start_date"}
              placeholder={"First Term Start Date"}
              value={formData.term_start_date}
              handleChange={handleChange}
              icon={<AiFillCalendar className="icons" />}
            />
          </div>
          <div style={{ width: "100%", textAlign: "left" }}>
            <label>End Date</label>
            <CustomTextInput
              name={"term_end_date"}
              placeholder={"First Term End Date"}
              value={formData.term_end_date}
              handleChange={handleChange}
              icon={<AiFillCalendar className="icons" />}
            />
          </div>
          <BillManagement setFormData={setFormData} formData={formData} />
          <WaiverBills setFormData={setFormData} formData={formData} />
        </div>
        {message && <AlertBadge message={message} />}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CustomSmallButton
            text={isLoading ? <Loading /> : "Submit"}
            disabled={isLoading}
            runFunction={handleSubmit}
            icon={
              !isLoading && <PiCheckCircleBold className="use-font-style" />
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AddTermModal;
