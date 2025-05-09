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
import CustomSmallButton from "../../Buttons/CustomSmallButton";
import { PiCheckCircleBold } from "react-icons/pi";
import BillManagement from "../../BillManagement/BillManagement";
import WaiverBills from "../../BillManagement/WaiverBills";
import ContentTitle from "../../ContentTitle";

const AddSessionModal = ({
  isVisible,
  onClose,
  handleCreateSession,
  isLoading,
  setIsLoading,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
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
      handleCreateSession(formData, setMessage);
      //onClose();
    } else {
      setAlert(true);
    }
  };

  const clearForm = () => {
    setFormData({
      name: "",
      start_date: "",
      end_date: "",
      term_name: "",
      term_start_date: "",
      term_end_date: "",
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
          <h2>Create Session</h2>
          <AlertBadge
            message={
              "These informations cannot be edited later, so ensure all details are entered correctly."
            }
            icon={false}
          />
        </div>
        <MdClose className="close-modal" onClick={onClose} />
        <div className="modal-sub-container overflow">
          <CustomSelectionInput
            placeholder={"Session Name"}
            name={"name"}
            value={formData.name}
            handleChange={handleChange}
            data={[
              "2022/2023",
              "2023/2024",
              "2024/2025",
              "2025/2026",
              "2026/2027",
              "2027/2028",
              "2028/2029",
              "2029/2030",
            ]}
          />
          <div style={{ width: "100%", textAlign: "left" }}>
            <label>Session Start Date</label>
            <CustomTextInput
              name={"start_date"}
              placeholder={"Session Start Date"}
              value={formData.start_date}
              handleChange={handleChange}
            />
          </div>
          <div style={{ width: "100%", textAlign: "left" }}>
            <label>Session End Date</label>
            <CustomTextInput
              name={"end_date"}
              placeholder={"Session End Date"}
              value={formData.end_date}
              handleChange={handleChange}
            />
          </div>
          <ContentTitle title={"Term Details"} />
          <CustomTextInput
            name={"term_name"}
            placeholder={"Name of term"}
            value={formData.term_name}
            handleChange={handleChange}
          />
          <div style={{ width: "100%", textAlign: "left" }}>
            <label>Term Start Date</label>
            <CustomTextInput
              name={"term_start_date"}
              placeholder={"First Term Start Date"}
              value={formData.term_start_date}
              handleChange={handleChange}
            />
          </div>
          <div style={{ width: "100%", textAlign: "left" }}>
            <label>Term End Date</label>
            <CustomTextInput
              name={"term_end_date"}
              placeholder={"First Term End Date"}
              value={formData.term_end_date}
              handleChange={handleChange}
            />
          </div>
          <BillManagement setFormData={setFormData} formData={formData} />
          <WaiverBills setFormData={setFormData} formData={formData} />
        </div>
        {message && <AlertBadge message={message} />}
        <CustomSmallButton
          text={isLoading ? <Loading /> : "Submit"}
          runFunction={handleSubmit}
          disabled={isLoading}
          icon={!isLoading && <PiCheckCircleBold className="use-font-style" />}
        />
      </div>
    </div>
  );
};

export default AddSessionModal;
