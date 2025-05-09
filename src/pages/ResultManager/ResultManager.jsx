import React, { useEffect, useMemo, useState } from "react";
import "./ResultManager.css";
import { Link, useLocation } from "react-router-dom";
import { useSchool } from "../../context/SchoolContext";
import { CgChevronLeftO, CgChevronRightO } from "react-icons/cg";
import Loading from "../../utils/Loader";
import { submitResult } from "../../services/schoolService";
import AlertModal from "../../components/modals/AlertModal/AlertModal";
import NoRecord from "../../components/NoRecord";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import { PiCheckCircleBold, PiPlusCircleBold } from "react-icons/pi";
import FeatureLockModal from "../../components/modals/FeatureLockModal/FeatureLockModal";
import { useAuth } from "../../context/AuthContext";

const ResultManager = () => {
  const {
    schoolState,
    setSchoolDatas,
    inLatestSession,
    sessionId,
    termId,
    updateSchoolStateById,
  } = useSchool();
  const {
    classes,
    schoolStudents,
    schoolSession,
    schoolResult,
    schoolTuition,
  } = schoolState;

  const { hasAccess, authState } = useAuth();
  const { user, class_subject_permission } = authState;

  const location = useLocation();
  const { state } = location || {};
  const { className, classId } = state || {};

  const [subjects, setSubjects] = useState([]);
  const [currentSubject, setCurrentSubject] = useState(0);
  const [resultData, setResultData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [activeTerm, setActiveTerm] = useState(null);

  // Set subjects based on selected classId
  useEffect(() => {
    const selectedClass = classes?.find((obj) => obj?.id === classId);

    setSubjects(
      selectedClass?.subjects?.filter((sub) =>
        user?.class_subject_permission
          .find((obj) => obj?.classId === classId)
          ?.subjects?.includes(sub?.id),
      ) || [],
    );
    setCurrentSubject(0);
  }, [user, classes, classId]);

  // Get student details by ID
  const getStudent = (id) =>
    schoolStudents.find((student) => student.id === id);

  const filteredStudents = useMemo(() => {
    return schoolTuition
      .filter(
        (obj) =>
          obj?.student_class === classId &&
          obj?.academic_session === sessionId &&
          obj?.academic_term === termId,
      )
      .map((obj) => getStudent(obj?.student));
  }, [schoolTuition, classId, sessionId, termId]);

  // Set active session and term IDs
  useEffect(() => {
    const activeSession = schoolSession?.find((obj) => obj.id === sessionId);

    const activeTerm = activeSession?.terms?.find(
      (term) => term?.id === termId,
    );
    setActiveSession(activeSession);
    setActiveTerm(activeTerm);
  }, [schoolSession]);

  // Handle individual result updates
  const handleResult = (studentId, score, subject, type) => {
    setResultData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subject]: {
          ...prev[studentId]?.[subject],
          [type]: score,
        },
      },
    }));
  };

  // Initialize result data for students
  useEffect(() => {
    if (!classId || !schoolResult) return;

    const initialResultData = {};
    filteredStudents?.forEach((student) => {
      const studentResults = schoolResult.filter(
        (obj) => obj.student === student.id && obj?.academic_term === termId,
      );

      const transformedResults = studentResults.reduce((acc, obj) => {
        acc[obj.subject] = {
          ca_score: obj.ca_score || 0,
          test_score: obj.test_score || 0,
          exam_score: obj.exam_score || 0,
        };
        return acc;
      }, {});

      initialResultData[student.id] = transformedResults;
    });

    setResultData(initialResultData);
  }, [classId, schoolResult, filteredStudents]);

  // Submit result data to the API
  const handleSubmitResult = async () => {
    const body = JSON.stringify({
      result: resultData,
      session: sessionId,
      term: termId,
    });

    setLoading(true);

    try {
      const response = await submitResult(body);
      setLoading(false);

      if (response.success) {
        updateSchoolStateById(response.schoolData);
        setMessage(response.message);
        setSuccessStatus(true);
      } else {
        setMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setLoading(false);
      setMessage(error);
      setSuccessStatus(false);
    }
  };

  return !hasAccess(6) ? (
    <div className="result-container">
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
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
              setCurrentSubject((prev) =>
                Math.min(prev + 1, subjects.length - 1),
              )
            }
          />
        </div>
      </div>
      {filteredStudents.length > 0 ? (
        <div className="attendance-mark-container">
          <div className="new-table-style">
            {resultData && (
              <table>
                <thead>
                  <tr className="heading-style">
                    <th>S/N</th>
                    <th>Names of Students</th>
                    <th>CA Score ({activeTerm?.ca_max_score})</th>
                    <th>Test Score ({activeTerm?.test_max_score})</th>
                    <th>Exam Score ({activeTerm?.exam_max_score})</th>
                  </tr>
                </thead>
                <tbody>
                  {schoolResult
                    ?.filter(
                      (student) =>
                        student.student_class === classId &&
                        student.subject === subjects[currentSubject]?.id &&
                        student?.academic_session === sessionId &&
                        student?.academic_term === termId,
                    )
                    .sort((a, b) => {
                      const studentDataA = getStudent(a.student);
                      const studentDataB = getStudent(b.student);

                      const lastNameA = studentDataA.last_name.toLowerCase();
                      const lastNameB = studentDataB.last_name.toLowerCase();

                      return lastNameA.localeCompare(lastNameB);
                    })
                    ?.map((student, index) => (
                      <tr
                        key={student.student || index}
                        className="content-style"
                      >
                        <td>{index + 1}</td>
                        <td>{`${getStudent(student.student)?.last_name} ${getStudent(student.student)?.first_name}`}</td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max={activeTerm?.ca_max_score}
                            value={
                              resultData[student.student]?.[
                                subjects[currentSubject]?.id
                              ]?.ca_score || ""
                            }
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              const min = 0;
                              const max = activeTerm?.ca_max_score;

                              if (value < min || value > max) {
                                setMessage(
                                  `Value must be between ${min} and ${max}.`,
                                );
                                setSuccessStatus(false);
                                return;
                              }

                              // Call the handler if the value is valid
                              handleResult(
                                student.student,
                                value,
                                subjects[currentSubject]?.id,
                                "ca_score",
                              );
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max={activeTerm?.test_max_score}
                            value={
                              resultData[student.student]?.[
                                subjects[currentSubject]?.id
                              ]?.test_score || ""
                            }
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              const min = 0;
                              const max = activeTerm?.test_max_score;

                              if (value < min || value > max) {
                                setMessage(
                                  `Value must be between ${min} and ${max}.`,
                                );
                                setSuccessStatus(false);
                                return;
                              }

                              handleResult(
                                student.student,
                                value,
                                subjects[currentSubject]?.id,
                                "test_score",
                              );
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max={activeTerm?.ca_max_score}
                            value={
                              resultData[student.student]?.[
                                subjects[currentSubject]?.id
                              ]?.exam_score || ""
                            }
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              const min = 0;
                              const max = activeTerm?.exam_max_score;

                              if (value < min || value > max) {
                                setMessage(
                                  `Value must be between ${min} and ${max}.`,
                                );
                                setSuccessStatus(false);
                                return;
                              }

                              // Call the handler if the value is valid
                              handleResult(
                                student.student,
                                value,
                                subjects[currentSubject]?.id,
                                "exam_score",
                              );
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <div className="no-record-container">
          <NoRecord
            message="No students found in this class."
            addon={
              <Link to={"/registration"}>
                <CustomSmallButton
                  text={"Add Student"}
                  icon={<PiPlusCircleBold className="use-font-style" />}
                />
              </Link>
            }
          />
        </div>
      )}
      <div className="setting-action-button-single">
        <CustomSmallButton
          text={loading ? <Loading /> : "Submit result"}
          runFunction={handleSubmitResult}
          icon={!loading && <PiCheckCircleBold style={{ fontSize: "20px" }} />}
          disabled={!inLatestSession ? true : loading}
        />
      </div>
      <AlertModal
        isVisible={message ? true : false}
        onClose={() => setMessage("")}
        message={message}
        success={successStatus}
      />
    </div>
  ) : (
    <FeatureLockModal isLocked={hasAccess(6)} />
  );
};

export default ResultManager;
//
