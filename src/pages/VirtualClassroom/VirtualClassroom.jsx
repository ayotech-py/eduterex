import React, { useEffect, useState } from "react";
import "./VirtualClassroom.css";
import { CgChevronLeftO, CgChevronRightO } from "react-icons/cg";
import { useSchool } from "../../context/SchoolContext";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import Classroom from "../../ui/Classroom/Classroom";
import QuestionBank from "../../ui/QuestionBank/QuestionBank";
import Assignment from "../../ui/Assignment/Assignment";
import SmartQuestioner from "../../ui/SmartQuestioner/SmartQuestioner";
import FeatureLockModal from "../../components/modals/FeatureLockModal/FeatureLockModal";

const VirtualClassroom = () => {
  const { schoolState, setSchoolDatas, inLatestSession, sessionId, termId } =
    useSchool();
  const { classes } = schoolState;

  const { hasAccess, authState } = useAuth();
  const { user } = authState;

  const location = useLocation();
  const { state } = location || {};
  const { className, classId } = state || {};

  const [subjects, setSubjects] = useState([]);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [actionType, setActionType] = useState("classroom");

  useEffect(() => {
    const selectedClass = classes?.find((obj) => obj?.id === classId);
    setSubjects(
      selectedClass?.subjects?.filter((sub) =>
        user?.class_subject_permission
          .find((obj) => obj?.classId === classId)
          ?.subjects?.includes(sub?.id),
      ) || [],
    );
    if (!currentSubject) {
      setCurrentSubject(0);
    }
  }, [classes, classId, user]);

  const actionTypeList = [
    "Classroom",
    "Assignments",
    "Question Bank",
    "Smart Questioner",
  ];

  const checkVirtualClassroomSubscription = () => {
    if (hasAccess(8)) {
      if (hasAccess(11)) {
        return true;
      }
    }
    return false;
  };

  return !checkVirtualClassroomSubscription() ? (
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
        <Classroom subject={subjects[currentSubject]} class_id={classId} />
      )}
      {actionType === "assignments" && (
        <Assignment subject={subjects[currentSubject]} class_id={classId} />
      )}
      {actionType === "question bank" && (
        <QuestionBank subject={subjects[currentSubject]} class_id={classId} />
      )}
      {actionType === "smart questioner" && (
        <SmartQuestioner
          subject={subjects[currentSubject]}
          class_id={classId}
        />
      )}
    </div>
  ) : (
    <FeatureLockModal isLocked={checkVirtualClassroomSubscription()} />
  );
};

export default VirtualClassroom;
