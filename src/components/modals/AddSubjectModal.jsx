import React, { useState, useEffect } from "react";
import "./AddClassModal/AddClassModal.css"; // Import CSS styles
import CustomTextInput from "../CustomTextInput/CustomTextInput";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { AlertBadge } from "../AlertBadge";
import { MdClose } from "react-icons/md";

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
    setAlert(false);
    if (subjectName) {
      if (subjectList.includes(subjectName)) {
        setMessage("A subject with this title already exist.");
        setAlert(true);
        return;
      } else {
        if (isEdit) {
          subjectList[isEdit - 1] = subjectName;
          setSubjectList([...subjectList]);
          clearForm();
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
    <div
      className="modal-overlay"
      onClick={() => {
        onClose();
        clearForm();
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div>
          <h2>Create Subject</h2>
          <p>Please enter the name of the class.</p>
        </div>
        <MdClose className="close-modal" onClick={onClose} />
        <div className="teacher-profile">
          <CustomTextInput
            name={"subject"}
            placeholder={"Subject Title"}
            value={subjectName}
            handleChange={(e) => setSubjectName(e.target.value)}
            icon={<AiOutlineUsergroupAdd className="icons" />}
          />
        </div>
        {alert && <AlertBadge message={message} />}
        <button onClick={handleAdd}>{isEdit ? "Update" : "Add"}</button>
      </div>
    </div>
  );
};

export default AddSubjectModal;
