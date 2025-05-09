import React, { useState, useEffect } from "react";
import "./AddClassModal/AddClassModal.css"; // Import CSS styles
import CustomTextInput from "../CustomTextInput/CustomTextInput";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { AlertBadge } from "../AlertBadge";
import { MdClose } from "react-icons/md";
import CustomSmallButton from "../Buttons/CustomSmallButton";
import { PiPlusCircleBold } from "react-icons/pi";

const AddSubjectModal = ({
  isVisible,
  onClose,
  setSubjectList,
  subjectList,
  setEditIndex,
  isEdit,
}) => {
  const [subjectName, setSubjectName] = useState("");

  useEffect(() => {
    if (isVisible === true && isEdit) {
      setSubjectName(subjectList[isEdit - 1]);
    }
  }, [isVisible, isEdit, subjectList]);

  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");

  const handleAdd = () => {
    setMessage("");
    setAlert(false);
    if (subjectName) {
      if (isEdit) {
        subjectList[isEdit - 1] = subjectName;
        setSubjectList([...subjectList]);
        clearForm();
      } else {
        if (subjectList.includes(subjectName)) {
          setMessage("A subject with this title already exist.");
          setAlert(true);
          return;
        } else {
          setSubjectList((prevData) => [...prevData, subjectName]);
          clearForm();
        }
      }
      onClose();
    } else {
      setMessage("Field cant be empty.");
      setAlert(true);
    }
  };

  const clearForm = () => {
    setSubjectName("");
    setEditIndex(null);
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
          <h2>Create Subject</h2>
          <p>Please enter the name of the class.</p>
        </div>
        <MdClose className="close-modal" onClick={onClose} />
        <div className="modal-sub-container overflow">
          <CustomTextInput
            name={"subject"}
            placeholder={"Subject Title"}
            value={subjectName}
            handleChange={(e) => setSubjectName(e.target.value)}
            icon={<AiOutlineUsergroupAdd className="icons" />}
          />
        </div>
        {message && <AlertBadge message={message} />}
        <CustomSmallButton
          text={isEdit ? "Update subject" : "Add subject"}
          runFunction={handleAdd}
          icon={<PiPlusCircleBold className="use-font-style" />}
        />
      </div>
    </div>
  );
};

export default AddSubjectModal;
