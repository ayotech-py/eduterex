import React, { useEffect, useState } from "react";
import "../VirtualClassroom/VirtualClassroom.css";
import { CgChevronLeftO, CgChevronRightO } from "react-icons/cg";
import { useSchool } from "../../context/SchoolContext";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import Classroom from "../../ui/Classroom/Classroom";
import QuestionBank from "../../ui/QuestionBank/QuestionBank";
import Assignment from "../../ui/Assignment/Assignment";

const StudentVirtualClassroom = () => {
  const { schoolState, setSchoolDatas, inLatestSession, sessionId, termId } =
    useSchool();
  const { studentClass } = schoolState;

  const { hasAccess, authState } = useAuth();
  const { user } = authState;

  const location = useLocation();
  const { state } = location || {};
  const { className, classId } = state || {};

  const [subjects, setSubjects] = useState([]);
  const [currentSubject, setCurrentSubject] = useState(0);
  const [actionType, setActionType] = useState("classroom");

  useEffect(() => {
    setSubjects(studentClass?.subjects || []);
    if (!currentSubject) {
      setCurrentSubject(0);
    }
  }, [studentClass, user]);

  const actionTypeList = ["Classroom", "Assignments"];

  return (
    <div className="vc-container">
      <div className="student-class">
        <h2>{className}</h2>
      </div>
      <div className="list-controller-ui">
        <CgChevronLeftO
          className="list-controller-ui-icon"
          onClick={() => setCurrentSubject((prev) => Math.max(prev - 1, 0))}
        />
        <h3>{subjects && subjects[currentSubject]?.name}</h3>
        <CgChevronRightO
          className="list-controller-ui-icon"
          onClick={() =>
            setCurrentSubject((prev) => Math.min(prev + 1, subjects.length - 1))
          }
        />
      </div>
      <div className="vc-action-container">
        <div className="vc-action">
          {actionTypeList.map((obj) => (
            <div
              className={`${actionType === obj.toLowerCase() ? "selected" : ""} action-name`}
              onClick={() => setActionType(obj.toLowerCase())}
            >
              <span>{obj}</span>
            </div>
          ))}
        </div>
      </div>
      {actionType === "classroom" && (
        <Classroom
          subject={subjects[currentSubject]}
          class_id={studentClass}
          role={user?.role}
        />
      )}
      {actionType === "assignments" && (
        <Assignment
          subject={subjects[currentSubject]}
          class_id={studentClass}
          role={user?.role}
        />
      )}
    </div>
  );
};

export default StudentVirtualClassroom;
