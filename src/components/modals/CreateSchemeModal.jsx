import React, { useState, useEffect, useCallback } from "react";
import "./AddStaffModal/AddStaffModal.css";
import CustomTextInput from "../CustomTextInput/CustomTextInput";
import CustomSelectionInput from "../CustomSelectionInput/CustomSelectionInput";
import CustomTextAreaInput from "../CustomTextInput/CustomTextAreaInput";
import { AlertBadge } from "../AlertBadge";
import { isFormValid } from "../../utils/OnboardingUtils/FormChecker";
import { MdClose } from "react-icons/md";
import Loading from "../../utils/Loader";
import CustomSmallButton from "../Buttons/CustomSmallButton";
import { PiCheckCircleBold } from "react-icons/pi";

const CreateSchemeModal = ({
  isVisible,
  onClose,
  weeks,
  lessonPlan,
  setLessonPlan,
  edit,
  editIndex,
  data,
  setSyllabusEditIndex,
  setSyllabusEdit,
}) => {
  const [formData, setFormData] = useState({
    week: "",
    title: "",
    description: "",
  });

  useEffect(() => {
    if (data.id) {
      setFormData({
        id: data.id,
        week: data.week,
        title: data.title,
        description: data.description,
        action: "edit",
        lesson_notes: data.lesson_notes,
      });
    } else {
      setFormData({
        week: data.week || weeks[0],
        title: data.title,
        description: data.description,
        action: "add",
      });
    }
  }, [edit, data, weeks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!isFormValid(formData, setMessage)) return;
    setMessage("");
    if (!edit) {
      setFormData((prev) => ({ ...prev, action: "add" }));
      setLessonPlan([...lessonPlan, formData]);
    } else {
      const updatedScheme = [...lessonPlan];
      updatedScheme[editIndex] = formData;
      setLessonPlan(updatedScheme);
      setSyllabusEdit(false);
      setSyllabusEditIndex(null);
    }
    clearForm();
    onClose();
  };

  const clearForm = () => {
    setFormData({
      week: "",
      title: "",
      description: "",
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
          <h2>{edit ? "Edit" : "Create"} Weekly Syllabus</h2>
          <p>
            Please fill in the below fields. Remember to click on the update
            button after adding or editing syllabus.
          </p>
        </div>
        <MdClose
          className="close-modal"
          onClick={() => {
            setSyllabusEdit(false);
            setSyllabusEditIndex(null);
            clearForm();
            onClose();
          }}
        />
        <div className="modal-sub-container overflow">
          <CustomSelectionInput
            name={"week"}
            placeholder={"Select Week"}
            value={formData.week}
            data={weeks}
            handleChange={handleChange}
          />
          <CustomTextInput
            name={"title"}
            placeholder={"Scheme Title"}
            value={formData.title}
            handleChange={handleChange}
          />
          <CustomTextAreaInput
            name={"description"}
            placeholder={"Scheme Description"}
            value={formData?.description}
            handleChange={handleChange}
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
            text={edit ? "Update" : "Add"}
            icon={<PiCheckCircleBold className="use-font-style" />}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateSchemeModal;
