import React, { useEffect, useState } from "react";
import "../AddStaffModal/AddStaffModal.css";
import "./AssignClassRoleModal.css";
import { MdClose } from "react-icons/md";
import Loading from "../../../utils/Loader";
import { AlertBadge } from "../../AlertBadge";
import CustomSmallButton from "../../Buttons/CustomSmallButton";
import { PiCheckCircleBold } from "react-icons/pi";
import ContentTitle from "../../ContentTitle";

const AssignClassRoleModal = ({
  isVisible,
  onClose,
  handleUpdateStaff,
  isLoading,
  classList,
  staff,
  classes,
  subjects,
}) => {
  const [formData, setFormData] = useState({
    selectedClasses: [],
    selectedRole: "",
    selectedStatus: false,
    staffId: "",
    classSubjects: [],
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isVisible) {
      setFormData({
        selectedClasses: classes,
        selectedRole: staff?.role,
        selectedStatus: false,
        staffId: staff.id,
        classSubjects: staff.class_subject_permission,
      });
    } else {
      setFormData({
        selectedClasses: [],
        selectedRole: "",
        selectedStatus: false,
        staffId: "",
        classSubjects: [],
      });
    }
  }, [isVisible, staff, classes]);

  const handleClassSelection = (className, classId, classSubjects) => {
    setFormData((prev) => {
      const isClassSelected = prev.selectedClasses.includes(className);
      const updatedClasses = isClassSelected
        ? prev.selectedClasses.filter((cls) => cls !== className)
        : [...prev.selectedClasses, className];

      const isSubjectSelected = prev.classSubjects.some(
        (obj) => obj.classId === classId,
      );
      const updatedClassSubjects = isClassSelected
        ? prev.classSubjects.filter((cls) => cls.classId !== classId)
        : [
            ...prev.classSubjects,
            { classId, subjects: classSubjects?.map((item) => item?.id) },
          ];

      return {
        ...prev,
        selectedClasses: updatedClasses,
        classSubjects: updatedClassSubjects,
      };
    });
  };

  const handleSubjectSelection = (classId, subjectId) => {
    setFormData((prev) => ({
      ...prev,
      classSubjects: prev.classSubjects.map((classObj) =>
        classObj.classId === classId
          ? {
              ...classObj,
              subjects: classObj.subjects.includes(subjectId)
                ? classObj.subjects.filter((id) => id !== subjectId) // Remove if unchecked
                : [...classObj.subjects, subjectId], // Add if checked
            }
          : classObj,
      ),
    }));
  };

  const handleRoleSelection = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, selectedRole: value });
  };

  const handleSubmit = () => {
    setMessage("");
    if (!formData.selectedRole) {
      alert("Please select a role.");
      return;
    } else if (
      formData.selectedRole === "Teacher" &&
      formData.selectedClasses.length === 0
    ) {
      setMessage("Please select at least one class.");
      return;
    }

    handleUpdateStaff(formData, setMessage);
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay staff-assign-container">
      <div className="modal-content-student">
        <div
          style={{ textAlign: "center" }}
          className="modal-heading-container"
        >
          <h2>Staff Action</h2>
          <p>Select an action to carry out on {staff.full_name}</p>
        </div>
        <MdClose className="close-modal" onClick={onClose} />
        <div className="modal-sub-container overflow">
          {!staff?.staff_id.includes("SADM") && (
            <div className="selection-section">
              <ContentTitle title={"Assign Staff role"} />
              <div className="radio-group role-container">
                {["Admin", "Teacher", "Account Manager"].map((role, index) => (
                  <p key={index} className="radio-item">
                    <input
                      type="radio"
                      className="custom-radio"
                      name="role"
                      value={role}
                      checked={formData.selectedRole === role}
                      onChange={handleRoleSelection}
                    />
                    {role}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="selection-section">
            <ContentTitle title={"Assign Classes and subjects"} />
            <div className="checkbox-group role-container">
              {classList.map((obj, index) => (
                <div className="class-object" key={obj.id}>
                  <p className="checkbox-item class-name">
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      value={obj?.name}
                      checked={formData.selectedClasses.includes(obj?.name)}
                      onChange={() =>
                        handleClassSelection(obj?.name, obj?.id, obj?.subjects)
                      }
                    />
                    {obj?.name}
                  </p>
                  <div className="class-subjects">
                    {obj?.subjects?.map((sub, index) => (
                      <p key={index} className="checkbox-item">
                        <input
                          type="checkbox"
                          className="custom-checkbox"
                          value={obj?.name}
                          checked={
                            formData.classSubjects
                              ?.find((cls) => cls?.classId === obj?.id)
                              ?.subjects?.includes(sub?.id) &&
                            formData.selectedClasses.includes(obj?.name)
                          }
                          onChange={() =>
                            handleSubjectSelection(obj?.id, sub?.id)
                          }
                        />
                        {sub?.name}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {!staff?.staff_id.includes("SADM") && (
            <div className="staff-active-section">
              <h3 style={{ fontWeight: 600 }}>
                Account Status:{" "}
                {staff?.is_active ? (
                  <span
                    style={{ fontSize: "11px", marginLeft: "5px" }}
                    className="tuition-cleared"
                  >
                    Active
                  </span>
                ) : (
                  <span
                    style={{ fontSize: "11px", marginLeft: "5px" }}
                    className="tuition-not-cleared"
                  >
                    Suspended
                  </span>
                )}{" "}
              </h3>
              <div className="radio-group role-container">
                <p className="radio-item checkbox-item">
                  {staff?.is_active ? "Click to suspend" : "Click to reinstate"}
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
          )}
        </div>
        {message && <AlertBadge message={message} />}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CustomSmallButton
            text={isLoading ? <Loading /> : "Submit"}
            runFunction={handleSubmit}
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

export default AssignClassRoleModal;
