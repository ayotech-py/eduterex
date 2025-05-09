import React, { useState, useEffect, useCallback } from "react";
import "../AddStaffModal/AddStaffModal.css";
import CustomTextInput from "../../CustomTextInput/CustomTextInput";
import { FiUser, FiMail, FiPhone, FiUserPlus } from "react-icons/fi";
import CustomSelectionInput from "../../CustomSelectionInput/CustomSelectionInput";
import { AiFillCalendar } from "react-icons/ai";
import { AlertBadge } from "../../AlertBadge";
import { isFormValid } from "../../../utils/OnboardingUtils/FormChecker";
import { MdClose } from "react-icons/md";
import Loading from "../../../utils/Loader";
import {
  FaUser,
  FaIdBadge,
  FaCalendarAlt,
  FaBook,
  FaMoneyBillWave,
} from "react-icons/fa";
import CustomSmallButton from "../../Buttons/CustomSmallButton";
import { PiCheckCircleBold } from "react-icons/pi";

const AddPaymentModal = ({
  isVisible,
  onClose,
  handlePayment,
  isLoading,
  setIsLoading,
  data,
}) => {
  const [formData, setFormData] = useState({
    student_id: data?.student_id,
    session: data?.session,
    term: data?.term ? data?.term[0] : null,
    amount: 0,
  });

  const getBalance = useCallback(() => {
    if (formData.term === "All") {
      return data?.totalBalance;
    } else {
      return data?.balance;
    }
  }, [formData.term, data]);

  useEffect(() => {
    setFormData({
      student_id: data?.student_id,
      session: data?.session,
      term: data?.term ? data?.term[0] : null,
      amount: data?.balance,
    });
  }, [data]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      amount: getBalance(),
    }));
  }, [data, getBalance]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" ? parseInt(value) : value,
    });
  };

  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    setMessage("");
    if (isFormValid(formData, setMessage)) {
      if (formData.amount < 50 || formData.amount > getBalance()) {
        setMessage(
          `Amount should be between ₦50.00 and the outstanding balance ₦${getBalance()}.00.`,
        );
        return;
      }
      handlePayment(formData, setMessage, setIsLoading);
      //onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div
          style={{ textAlign: "center" }}
          className="modal-heading-container"
        >
          <h2>Record Payment</h2>
          <p>
            Select a term to record payment for a specific term or choose 'All'
            for full session payment.
          </p>
        </div>
        <MdClose className="close-modal" onClick={onClose} />
        <div className="modal-sub-container overflow">
          <CustomTextInput
            name={"student_name"}
            placeholder={"Student Name"}
            value={data?.student_name}
            handleChange={handleChange}
            icon={<FaUser className="icons" />}
            disabled={true}
          />
          <CustomTextInput
            name={"student_id"}
            placeholder={"Student ID"}
            value={data?.student_id}
            handleChange={handleChange}
            icon={<FaIdBadge className="icons" />}
            disabled={true}
          />
          <CustomTextInput
            name={"sesssion_name"}
            placeholder={"Session"}
            value={data?.session}
            handleChange={handleChange}
            icon={<FaCalendarAlt className="icons" />}
            disabled={true}
          />
          <CustomSelectionInput
            name={"term"}
            placeholder={"Select term"}
            value={formData.term}
            data={data?.term}
            handleChange={handleChange}
            icon={<FaBook className="icons" />}
            disabled={true}
          />
          <CustomTextInput
            name={"amount"}
            placeholder={"Amount"}
            value={formData.amount}
            handleChange={handleChange}
            icon={<FaMoneyBillWave className="icons" />}
          />
        </div>
        {message && <AlertBadge message={message} />}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CustomSmallButton
            runFunction={handleSubmit}
            text={isLoading ? <Loading /> : "Submit"}
            icon={
              !isLoading && <PiCheckCircleBold className="use-font-style" />
            }
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AddPaymentModal;
