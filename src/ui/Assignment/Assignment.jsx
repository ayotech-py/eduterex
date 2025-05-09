import React, { useEffect, useState } from "react";
import "./Assignment.css";
import NoRecord from "../../components/NoRecord";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import {
  PiArrowCircleDownBold,
  PiArrowCircleLeft,
  PiArrowDownBold,
  PiCheckCircleBold,
  PiPlusCircleBold,
  PiX,
} from "react-icons/pi";
import { BiChevronDown, BiChevronUp, BiEdit } from "react-icons/bi";
import { BsEye, BsTrash3 } from "react-icons/bs";
import Loading from "../../utils/Loader";
import CreateAssignmentModal from "../../components/modals/CreateAssignmentModal/CreateAssignmentModal";
import { useSchool } from "../../context/SchoolContext";
import {
  deleteAssignment,
  postAssignment,
  postAssignmentSubmission,
  updateAssignmentSubmission,
} from "../../services/schoolService";
import AlertModal from "../../components/modals/AlertModal/AlertModal";
import {
  allowedTypes,
  convertToAMPM,
  formatDate,
  getPageCount,
  isDueDateValid,
  MAX_FILE_SIZE,
  numberToOrdinalWord,
  toTitleCase,
} from "../../utils/Utils";
import AlertOptionModal from "../../components/modals/AlertModal/AlertOptionModal";
import { isFormValid } from "../../utils/OnboardingUtils/FormChecker";
import CBTQuestionModal from "../../components/modals/CBTQuestionModal/CBTQuestionModal";
import {
  FaFileAlt,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
  FaUpload,
} from "react-icons/fa";
import ViewSubmissionModal from "../../components/modals/ViewSubmissionModal/ViewSubmissionModal";
import { IoRefreshCircle, IoRefreshCircleOutline } from "react-icons/io5";
import { HandleFetchData } from "../../App";
import UploadFile from "../../components/UploadFile";

const Assignment = ({ subject, class_id, role }) => {
  const {
    schoolState,
    setSchoolDatas,
    sessionId,
    termId,
    reloadData,
    updateSchoolStateById,
  } = useSchool();
  const {
    classes,
    schoolAssignments,
    schoolAssignmentSubmissions,
    schoolStudents,
  } = schoolState;

  const [isAssignmentModalVisible, setIsAssignmentModalVisible] =
    useState(false);
  const handleOpenAssignmentModal = () => setIsAssignmentModalVisible(true);
  const handleCloseAssignmentModal = () => setIsAssignmentModalVisible(false);

  const [isOptionModalVisible, setIsOptionModalVisible] = useState(false);
  const handleOpenOptionModal = () => setIsOptionModalVisible(true);
  const handleCloseOptionModal = () => setIsOptionModalVisible(false);

  const [isAssSubmitModalVisible, setIsAssSubmitModalVisible] = useState(false);
  const handleOpenAssSubmitModal = () => setIsAssSubmitModalVisible(true);
  const handleCloseAssSubmitModal = () => setIsAssSubmitModalVisible(false);

  const [isCBTModalVisible, setIsCBTModalVisible] = useState(false);
  const handleOpenCBTModal = () => setIsCBTModalVisible(true);
  const handleCloseCBTModal = () => setIsCBTModalVisible(false);

  const [isSubmissionModalVisible, setIsSubmissionModalVisible] =
    useState(false);
  const handleOpenSubmissionModal = () => setIsSubmissionModalVisible(true);
  const handleCloseSubmissionModal = () => setIsSubmissionModalVisible(false);

  const [studentSubmission, setStudentSubmission] = useState(null);

  const [tab, setTab] = useState("assignments");
  const [assignments, setAssignments] = useState([]);

  const [message, setMessage] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);
  const [assignmentID, setAssignmentID] = useState(null);

  const [submittedAssignmentID, setSubmittedAssignmentID] = useState(null);
  const [submittedAnswers, setSubmittedAnswers] = useState(null);
  const [view, setView] = useState(null);
  const [file, setFile] = useState(null);

  const [submissionToggle, setSubmissionToggle] = useState({});

  const [theoryPoint, setTheoryPoint] = useState("");
  const [refreshLoading, setRefreshLoading] = useState(false);

  const [data, setData] = useState({
    session: sessionId,
    term: termId,
    title: "",
    classes: class_id,
    subject: subject.id,
    assignment_type: "MCQ",
    questions: [],
    is_auto_graded: "",
    show_scores_immediately: "",
    assessment_mode: "",
    due_time: "",
    due_date: "",
    total_points: 0,
  });

  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const [loading, setLoading] = useState({
    postAssignmentLoading: false,
    deleteAssignmentLoading: false,
    postSubmissionLoading: false,
    updateSubmissionLoading: false,
  });

  const getSubmission = (assignmentID) => {
    if (role === "Student") {
      return (
        schoolAssignmentSubmissions?.find(
          (obj) => obj?.assignment === assignmentID,
        ) || false
      );
    } else {
      return (
        schoolAssignmentSubmissions?.filter(
          (obj) => obj?.assignment === assignmentID,
        ) || false
      );
    }
  };

  useEffect(() => {
    if (role === "Student") {
      const ass = schoolAssignments.filter((obj) => obj.subject === subject.id);
      setAssignments(ass.reverse());
      if (!selectedAssignment) {
        setSelectedAssignment(ass[0]?.id);
        setFile(getSubmission(ass[0]?.id).file_upload || null);
      } else {
        setFile(getSubmission(selectedAssignment).file_upload || null);
      }
    } else {
      const ass = schoolAssignments.filter(
        (obj) => obj.classes === class_id && obj.subject === subject.id,
      );
      setAssignments(ass.reverse().sort((a, b) => b.id - a.id));
      if (!selectedAssignment) {
        setSelectedAssignment(ass[0]?.id);
      }
    }
  }, [schoolAssignments, class_id, role, schoolAssignmentSubmissions]);

  useEffect(() => {
    if (role === "Student") {
      const ass = schoolAssignments.filter((obj) => obj.subject === subject.id);
      setAssignments(ass.reverse());
      setSelectedAssignment(ass[0]?.id);
      setFile(getSubmission(ass[0]?.id).file_upload || null);
    } else {
      const ass = schoolAssignments.filter(
        (obj) => obj.classes === class_id && obj.subject === subject.id,
      );
      setAssignments(ass);
      setSelectedAssignment(ass[0]?.id);
    }
  }, [subject]);

  const getAssignmentDetails = (assignment_id) => {
    return assignments.find((obj) => obj.id === assignment_id);
  };

  const handlePostQuestion = async (
    body,
    setModalLoading,
    setModalMessage,
    setModalTab,
  ) => {
    const mutatedFormData = {
      ...body,
      is_auto_graded: true,
      show_scores_immediately: true,
    };
    if (!isFormValid(mutatedFormData, setModalMessage)) return;
    setLoading((prev) => ({ ...prev, postAssignmentLoading: true }));
    setModalLoading(true);

    try {
      const response = await postAssignment(body);
      setLoading((prev) => ({ ...prev, postAssignmentLoading: false }));
      setModalLoading(false);

      if (response.success) {
        clearForm();
        setModalTab(1);
        handleCloseAssignmentModal();
        updateSchoolStateById(response.schoolData);
        setMessage(response.message);
        setSuccessStatus(true);
      } else {
        setModalMessage(response.message);
      }
    } catch (error) {
      setLoading((prev) => ({ ...prev, postAssignmentLoading: false }));
      setModalLoading(false);
      setModalMessage(error);
      setSuccessStatus(false);
    }
  };

  const handleDeleteAssignment = async (id) => {
    setLoading((prev) => ({ ...prev, deleteAssignmentLoading: true }));

    try {
      const response = await deleteAssignment(id);
      setLoading((prev) => ({ ...prev, deleteAssignmentLoading: false }));

      if (response.success) {
        setSchoolDatas(response.schoolData);
        setMessage(response.message);
        setSuccessStatus(true);
        setAssignmentID(null);
      } else {
        setMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setLoading((prev) => ({ ...prev, deleteAssignmentLoading: false }));
      setMessage(error);
      setSuccessStatus(false);
    }
  };

  useEffect(() => {
    if (assignmentID) {
      handleOpenOptionModal();
    }
  }, [assignmentID]);

  const clearForm = () => {
    setData({
      session: sessionId,
      term: termId,
      title: "",
      classes: class_id,
      subject: subject.id,
      assignment_type: "MCQ",
      questions: [],
      is_auto_graded: "",
      show_scores_immediately: "",
      assessment_mode: "",
      due_time: "",
      due_date: "",
      total_points: 0,
    });
  };

  const [progress, setProgress] = useState(0);

  const submitAssignment = (assignmentId, answers) => {
    setSubmittedAnswers(answers);
    setSubmittedAssignmentID(assignmentId);
    handleOpenAssSubmitModal();
  };

  const handleSubmitAssignment = async () => {
    setLoading((prev) => ({ ...prev, postSubmissionLoading: true }));
    let body;
    const formData = new FormData();

    let type = getAssignmentDetails(selectedAssignment)?.assessment_mode;
    let question_type =
      getAssignmentDetails(selectedAssignment)?.assignment_type;

    if (type === "File Upload") {
      if (!file) {
        setMessage("Please select a file to upload.");
        setSuccessStatus(false);
        return;
      }
      formData.append(
        "assignment",
        getAssignmentDetails(selectedAssignment)?.id,
      );
      formData.append("type", type);

      const file_type = file.type;
      const cloudinary_response = await UploadFile(file, setProgress);
      if (cloudinary_response.status !== 200) {
        setLoading((prev) => ({ ...prev, postSubmissionLoading: false }));
        setMessage("Am error occured while uploading file.");
        return;
      }
      formData.append("file", cloudinary_response.data.secure_url);
      formData.append("file_name", file.name);
      formData.append("file_type", file_type);
      formData.append("file_size", file.size);
      formData.append("duration", cloudinary_response["duration"]);
      const page_count = await getPageCount(file);
      formData.append("page_count", page_count);
    } else {
      let points = 0;
      const questions = assignments.find(
        (obj) => obj.id === submittedAssignmentID,
      ).questions;
      for (let obj in submittedAnswers) {
        const check_q = questions.find(
          (q) => q.id === submittedAnswers[obj].questionID,
        );
        if (question_type === "MCQ") {
          if (check_q?.correct_answer === submittedAnswers[obj].answer) {
            points = points + check_q.point;
          }
        } else {
          let scores_array = [];
          submittedAnswers[obj].answer.forEach((obj, index) => {
            const new_answer = check_q.possible_answers[index].map((obj) =>
              obj.toLowerCase(),
            );
            if (new_answer.includes(obj.toLowerCase())) {
              scores_array.push(1);
            } else {
              scores_array.push(0);
            }
          });
          if (!scores_array.includes(0)) {
            points += 1;
          }
        }
      }

      body = {
        assignment: submittedAssignmentID,
        cbt_answers: submittedAnswers,
        points: points,
        type: type,
      };
    }

    try {
      const response = await postAssignmentSubmission(
        type === "File Upload" ? formData : body,
      );
      setLoading((prev) => ({ ...prev, postSubmissionLoading: false }));
      handleCloseAssSubmitModal();

      if (response.success) {
        if (type === "File Upload") {
          setFile(getSubmission(selectedAssignment).file_upload || null);
          setProgress(0);
        }
        handleCloseCBTModal();
        setSchoolDatas(response.schoolData);
        setMessage(response.message);
        setSuccessStatus(true);
      } else {
        setMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setProgress(0);
      handleCloseAssSubmitModal();
      setLoading((prev) => ({ ...prev, postSubmissionLoading: false }));
      setMessage(error);
      setSuccessStatus(false);
    }
  };

  const handleUpdateSubmission = async (submission_id, point) => {
    setLoading((prev) => ({ ...prev, updateSubmissionLoading: true }));

    try {
      const response = await updateAssignmentSubmission(
        { point: point, submission_id: submission_id },
        submission_id,
      );
      setLoading((prev) => ({ ...prev, updateSubmissionLoading: false }));
      handleCloseAssSubmitModal();

      if (response.success) {
        setTheoryPoint("");
        updateSchoolStateById(response.schoolData);
        setMessage(response.message);
        setSuccessStatus(true);
      } else {
        setMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      handleCloseAssSubmitModal();
      setLoading((prev) => ({ ...prev, updateSubmissionLoading: false }));
      setMessage(error);
      setSuccessStatus(false);
    }
  };

  useEffect(() => {
    if (role !== "Student") {
      getSubmissionInstance.forEach((sub) => {
        setSubmissionToggle((prev) => ({
          ...prev,
          [getStudent(sub.student).student_id]: false,
        }));
      });
    }
  }, [assignmentID, selectedAssignment]);

  const handleToggleSubss = (student) => {
    const assignmentId = getAssignmentDetails(selectedAssignment)?.id;
    const studentId = getStudent(student).student_id;

    if (!assignmentId) return; // Ensure assignmentId is valid
    setStudentSubmission(student);

    const filteredSubmissions = getSubmission(assignmentId).filter(
      (sub) => sub.student !== student,
    );

    setSubmissionToggle((prev) => {
      const updatedToggle = { ...prev };

      // Reset toggles for other students
      filteredSubmissions.forEach((sub) => {
        updatedToggle[getStudent(sub.student).student_id] = false;
      });

      // Toggle the selected student
      updatedToggle[studentId] = !prev[studentId];

      return updatedToggle;
    });
  };

  const getStudent = (id) =>
    schoolStudents.find((student) => student.id === id);

  const getQuestionType = (type) => {
    if (type === "MCQ") return "multiple-choice";
    else if (type === "Cloze") return "cloze";
    else if (type === "Theory") return "theory";
    else return "";
  };

  const instructionList = {
    MCQ: [
      "✅ Select the correct answer for each question.",
      "✅ You can not retry after submission.",
      "✅ Read each question carefully before selecting an answer.",
      "✅ Ensure a stable internet connection to avoid interruptions.",
      "✅ Once you start, you must complete the assignment before leaving the page",
    ],
    Theory: [
      "✅ You are to upload a file document containing your answers for this assignment.",
      "✅ You can re-submit before the due date.",
      "✅ Ensure you submit the correct file containing your solutions.",
    ],
    Cloze: [
      "✅ Fill in the correct answer in each of the gaps in each question.",
      "✅ You can not retry after submission.",
      "✅ Ensure a stable internet connection to avoid interruptions.",
      "✅ Once you start, you must complete the assignment before leaving the page.",
    ],
  };

  const getFileIcon = (file) => {
    if (!file) return null;
    const fileType = file.type || file.file_type;
    if (fileType.includes("pdf"))
      return <FaFilePdf className="file-icon pdf" />;
    if (fileType.includes("word"))
      return <FaFileWord className="file-icon word" />;
    if (fileType.includes("powerpoint"))
      return <FaFilePowerpoint className="file-icon ppt" />;
    return <FaFileAlt className="file-icon generic" />;
  };

  const handleFileChange = (event) => {
    const uploaded_file = event.target.files[0];
    if (uploaded_file) {
      if (!allowedTypes.includes(uploaded_file.type)) {
        setFile(null);
        setMessage("Only PDF, Word, or image files are allowed.");
        setSuccessStatus(false);
        return;
      }
      if (uploaded_file.size > MAX_FILE_SIZE) {
        setFile(null);
        setMessage("File size must be less than 10MB!");
        setSuccessStatus(false);
        return;
      }
      setFile(event.target.files[0]);
      setMessage("");
    }
  };

  const getSubmissionInstance = getSubmission(
    getAssignmentDetails(selectedAssignment)?.id,
  );

  return (
    <div className="ui-classroom">
      <div
        className={`classroom-div scheme-of-work ${tab === "assignments" ? "show-in-mobile" : "hide-in-mobile"}`}
      >
        <div className="ui-classroom-heading no-width">
          <h3>Assignments</h3>
          {role !== "Student" ? (
            <CustomSmallButton
              text={"Create"}
              icon={<PiPlusCircleBold className="use-font-style" />}
              runFunction={handleOpenAssignmentModal}
            />
          ) : (
            <div>
              <CustomSmallButton
                text={refreshLoading ? <Loading /> : "Refresh"}
                icon={
                  !refreshLoading && (
                    <IoRefreshCircle className="use-font-style" />
                  )
                }
                runFunction={() => reloadData(setRefreshLoading)}
                disabled={refreshLoading}
              />
            </div>
          )}
        </div>
        <div className="ui-classroom-content overflow">
          {assignments.length > 0 ? (
            assignments.map((obj) => (
              <div
                className={
                  selectedAssignment === obj.id
                    ? "scheme-list scheme-selected"
                    : "scheme-list"
                }
                key={obj.id}
                onClick={() => {
                  if (role === "Student") {
                    setSelectedAssignment(obj.id);
                    setFile(getSubmission(obj?.id).file_upload || null);
                    setTab("submission");
                  }
                }}
              >
                <div
                  onClick={() => {
                    if (role !== "Student") {
                      setSelectedAssignment(obj.id);
                      setTab("submission");
                    }
                  }}
                  className="ui-list-card-content"
                >
                  <p>
                    <span>{obj.title}</span>
                  </p>
                  <p style={{ fontSize: "13px", marginTop: "2px" }}>
                    {obj?.assignment_type} • {obj.questions.length} Questions •{" "}
                    {obj?.assessment_mode}
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      marginTop: "2px",
                      color: isDueDateValid(obj.due_date, obj.due_time)
                        ? "green"
                        : "red",
                    }}
                  >
                    Due Date: {formatDate(obj.due_date)} •{" "}
                    {convertToAMPM(obj.due_time)}
                  </p>
                </div>
                {role === "Student" ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      alignItems: "center",
                    }}
                  >
                    {getSubmission(obj?.id) ? (
                      <span
                        style={{ marginLeft: "5px" }}
                        className="tuition-cleared very-small-font-size"
                      >
                        Submitted
                      </span>
                    ) : isDueDateValid(obj.due_date, obj.due_time) ? (
                      <span
                        style={{
                          marginLeft: "5px",
                          backgroundColor: "#FFC107",
                          color: "#000",
                        }}
                        className="tuition-not-cleared very-small-font-size"
                      >
                        Pending
                      </span>
                    ) : (
                      <span
                        style={{
                          marginLeft: "5px",
                        }}
                        className="tuition-not-cleared very-small-font-size"
                      >
                        Missed
                      </span>
                    )}
                    <p
                      className="very-small-font-size"
                      style={{ textAlign: "center", flex: 1 }}
                    >
                      Scores:{" "}
                      {Number(getSubmission(obj?.id)?.points || 0.0).toFixed(1)}
                      /{Number(obj?.total_points).toFixed(1)}
                    </p>
                  </div>
                ) : (
                  <div className="scheme-list-action">
                    <BsEye
                      onClick={() => {
                        setData(obj);
                        handleOpenAssignmentModal();
                      }}
                      className="action-icon"
                    />

                    <BsTrash3
                      onClick={() => {
                        setAssignmentID(obj.id);
                      }}
                      className="action-icon"
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <NoRecord message={"No assignment has been created yet."} />
          )}
        </div>
      </div>
      {role === "Student" ? (
        selectedAssignment ? (
          <div
            className={`classroom-div lessons overflow ${tab === "submission" ? "show-in-mobile" : "hide-in-mobile"}`}
          >
            <div className="ui-classroom-heading no-width">
              <div
                style={{ display: "flex", alignItems: "center", gap: "1px" }}
              >
                <PiArrowCircleLeft
                  className="mobile-ui-show"
                  onClick={() => setTab("assignments")}
                  style={{ fontSize: "20px", padding: "5px 5px 5px 0px" }}
                />
                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <h3>{getAssignmentDetails(selectedAssignment)?.title} </h3>
                  {getSubmissionInstance ? (
                    <span
                      style={{ marginLeft: "5px" }}
                      className="tuition-cleared very-small-font-size"
                    >
                      Submitted
                    </span>
                  ) : isDueDateValid(
                      getAssignmentDetails(selectedAssignment)?.due_date,
                      getAssignmentDetails(selectedAssignment)?.due_time,
                    ) ? (
                    <span
                      style={{
                        marginLeft: "5px",
                        backgroundColor: "#FFC107",
                        color: "#000",
                      }}
                      className="tuition-not-cleared very-small-font-size"
                    >
                      Pending
                    </span>
                  ) : (
                    <span
                      style={{
                        marginLeft: "5px",
                      }}
                      className="tuition-not-cleared very-small-font-size"
                    >
                      Missed
                    </span>
                  )}

                  <p style={{ minWidth: "max-content" }}>
                    Scores:{" "}
                    {Number(getSubmissionInstance?.points || 0.0).toFixed(1)}/
                    {Number(
                      getAssignmentDetails(selectedAssignment)?.total_points,
                    ).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
            <div className="assignment-preview">
              <h3>Assignment Preview</h3>
              <p>
                Type:{" "}
                {toTitleCase(
                  getQuestionType(
                    getAssignmentDetails(selectedAssignment)?.assignment_type,
                  ).replaceAll("-", " "),
                )}{" "}
                Questions
              </p>
              <p>
                Due Date:{" "}
                {formatDate(getAssignmentDetails(selectedAssignment)?.due_date)}
              </p>
              <p>
                Due Time:{" "}
                {convertToAMPM(
                  getAssignmentDetails(selectedAssignment)?.due_time,
                )}
              </p>
              <h3>Instructions:</h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                <p>
                  ✅ This assignment consists of{" "}
                  {getAssignmentDetails(selectedAssignment)?.questions.length}{" "}
                  {getQuestionType(
                    getAssignmentDetails(selectedAssignment)?.assignment_type,
                  )}{" "}
                  questions.
                </p>
                {instructionList[
                  getAssignmentDetails(selectedAssignment)?.assignment_type
                ]?.map((obj) => (
                  <p>{obj}</p>
                ))}
              </div>
              {getAssignmentDetails(selectedAssignment)?.assessment_mode ===
                "File Upload" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                  }}
                >
                  <h3>Questions:</h3>
                  {getAssignmentDetails(selectedAssignment)?.questions.map(
                    (q, index) => (
                      <div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            backgroundColor: "#f3e8ff",
                            borderRadius: "5px",
                            padding: "15px",
                            alignItems: "flex-start",
                            marginBottom: "15px",
                          }}
                        >
                          <p style={{ fontWeight: 600 }}>
                            Q{index + 1}. {q.question}
                          </p>
                          {q.image && (
                            <img
                              src={q.image}
                              alt="question"
                              className="assignment-add-image"
                            />
                          )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            marginLeft: "18px",
                          }}
                        >
                          {q.options &&
                            q.options.map((opt, index) => (
                              <p>
                                {"(" +
                                  String.fromCharCode(97 + index) +
                                  ") " +
                                  opt}{" "}
                              </p>
                            ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
              {getAssignmentDetails(selectedAssignment)?.assessment_mode ===
              "File Upload" ? (
                isDueDateValid(
                  getAssignmentDetails(selectedAssignment)?.due_date,
                  getAssignmentDetails(selectedAssignment)?.due_time,
                ) && !getSubmissionInstance.points ? (
                  <div className="upload-container assignment-file-upload">
                    <h3>Solution:</h3>
                    {file ? (
                      <div className="file-preview">
                        {getFileIcon(file)}
                        <div className="file-details">
                          <h3>{file.name}</h3>
                          <p>{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                        {file?.file ? (
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                            }}
                          >
                            <a
                              href={`${file?.file}`}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <PiArrowDownBold
                                className="sc-action"
                                size={20}
                              />
                            </a>

                            <PiX
                              onClick={() => setFile(null)}
                              className="sc-action"
                              size={20}
                            />
                          </div>
                        ) : (
                          <PiX
                            onClick={() => setFile(null)}
                            className="sc-action"
                            size={20}
                          />
                        )}
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "15px",
                        }}
                      >
                        <p style={{ color: "red" }}>
                          <i>No file submitted yet</i>
                        </p>
                        <label className="file-input-label">
                          <FaUpload className="upload-icon" />
                          <span>Select File</span>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,image/*"
                            onChange={handleFileChange}
                            hidden
                          />
                        </label>

                        <p className="very-small-font-size">
                          <i>File must not exceed 10MB!</i>
                        </p>
                      </div>
                    )}
                    <CustomSmallButton
                      text={
                        loading.postSubmissionLoading ? (
                          <span>Uploading... {progress}%</span>
                        ) : (
                          "Submit"
                        )
                      }
                      disabled={file?.file || loading.postSubmissionLoading}
                      runFunction={handleSubmitAssignment}
                    />
                  </div>
                ) : (
                  <div className="upload-container assignment-file-upload">
                    {file ? (
                      <div className="file-preview">
                        {getFileIcon(file)}
                        <div className="file-details">
                          <h3>{file.name}</h3>
                          <p>{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                        <a
                          href={`${file?.file}`}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <PiArrowDownBold className="sc-action" size={20} />
                        </a>
                      </div>
                    ) : (
                      <p style={{ color: "red" }}>
                        <i>No file was submitted</i>
                      </p>
                    )}
                  </div>
                )
              ) : (
                <div>
                  {getSubmissionInstance ||
                  !isDueDateValid(
                    getAssignmentDetails(selectedAssignment)?.due_date,
                    getAssignmentDetails(selectedAssignment)?.due_time,
                  ) ? (
                    <CustomSmallButton
                      text={"View submission"}
                      runFunction={handleOpenCBTModal}
                    />
                  ) : (
                    <CustomSmallButton
                      text={"Start Now"}
                      runFunction={() => {
                        setView(
                          getSubmission(
                            getAssignmentDetails(selectedAssignment)?.id,
                          ) || null,
                        );
                        handleOpenCBTModal();
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            className={`classroom-div lessons overflow ${tab === "submission" ? "show-in-mobile" : "hide-in-mobile"}`}
          >
            <NoRecord message={"No record found."} />
          </div>
        )
      ) : (
        <div
          className={`classroom-div lessons overflow ${tab === "submission" ? "show-in-mobile" : "hide-in-mobile"}`}
        >
          <div className="ui-classroom-heading no-width">
            <div style={{ display: "flex", alignItems: "center", gap: "1px" }}>
              <PiArrowCircleLeft
                className="mobile-ui-show"
                onClick={() => setTab("assignments")}
                style={{ fontSize: "20px", padding: "5px 5px 5px 0px" }}
              />
              <h3>Submissions</h3>
            </div>
            <div>
              <CustomSmallButton
                text={refreshLoading ? <Loading /> : "Refresh"}
                icon={
                  !refreshLoading && (
                    <IoRefreshCircle className="use-font-style" />
                  )
                }
                runFunction={() => reloadData(setRefreshLoading)}
                disabled={refreshLoading}
              />
            </div>
          </div>
          <div className="student-submissions-div">
            {getSubmissionInstance?.length > 0 ? (
              getSubmissionInstance?.map((sub, index) => (
                <div className="submission-card">
                  <div className="submission-card-info">
                    <div className="sc-profile-div">
                      <img src={getStudent(sub.student)?.passport} alt="" />
                      <p className="sc-name">
                        {getStudent(sub.student).last_name +
                          " " +
                          getStudent(sub.student).first_name}
                      </p>
                    </div>

                    <p className="sc-date sc-show-in-mobile">
                      {formatDate(sub.submitted_at)}
                    </p>
                    <p className="sc-time sc-show-in-mobile">
                      {convertToAMPM(sub.submitted_at.split("T")[1])}
                    </p>
                    <p className="sc-point sc-show-in-mobile">
                      {Number(sub?.points || 0.0).toFixed(1)}/
                      {Number(
                        getAssignmentDetails(selectedAssignment)?.total_points,
                      ).toFixed(1)}
                    </p>
                    {submissionToggle[getStudent(sub.student).student_id] ? (
                      <BiChevronUp
                        className="sc-action"
                        size={25}
                        onClick={() => handleToggleSubss(sub.student)}
                      />
                    ) : (
                      <BiChevronDown
                        className="sc-action"
                        size={25}
                        onClick={() => handleToggleSubss(sub.student)}
                      />
                    )}
                  </div>
                  <div
                    className={`submission-card-detail overflow ${submissionToggle[getStudent(sub.student).student_id] ? "show-sub-dropdown" : "hide-sub-dropdown"}`}
                  >
                    <p style={{ paddingTop: "15px" }}>
                      <span>Name: </span>
                      {getStudent(sub.student).last_name +
                        " " +
                        getStudent(sub.student).first_name}
                    </p>
                    <p>
                      <span>Student ID: </span>
                      {getStudent(sub.student).student_id}
                    </p>
                    <p>
                      <span>Submitted at: </span>
                      {formatDate(sub.submitted_at)} |{" "}
                      {convertToAMPM(sub.submitted_at.split("T")[1])}
                    </p>
                    <p>
                      <span>Scores: </span>{" "}
                      {Number(sub?.points || 0.0).toFixed(1)}/
                      {Number(
                        getAssignmentDetails(selectedAssignment)?.total_points,
                      ).toFixed(1)}
                    </p>
                    {getAssignmentDetails(selectedAssignment)
                      ?.assessment_mode === "File Upload" ? (
                      <div className="upload-container assignment-file-upload">
                        {sub.file_upload ? (
                          <div className="file-preview">
                            {getFileIcon(sub.file_upload)}
                            <div className="file-details">
                              <h3>{sub.file_upload.name}</h3>
                              <p>
                                {(sub.file_upload.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                            <a
                              href={`${sub.file_upload.file}`}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <PiArrowDownBold
                                className="sc-action"
                                size={20}
                              />
                            </a>
                          </div>
                        ) : (
                          <p style={{ color: "red" }}>
                            <i>No file was submitted</i>
                          </p>
                        )}
                        <div className="ass-point-input new-table-style no-width">
                          <p>Enter Score: </p>
                          <input
                            type="number"
                            value={theoryPoint}
                            onChange={(e) => setTheoryPoint(e.target.value)}
                          />
                          <CustomSmallButton
                            text={
                              loading.updateSubmissionLoading ? (
                                <Loading />
                              ) : (
                                "Record"
                              )
                            }
                            runFunction={() => {
                              const total_point = Number(
                                getAssignmentDetails(selectedAssignment)
                                  ?.total_points,
                              );
                              if (theoryPoint > total_point) {
                                setMessage(
                                  "Score cannot exceed the total attainable score!",
                                );
                                setSuccessStatus(false);
                                return;
                              }
                              if (theoryPoint < 0) {
                                setMessage("Score cannot be a negative value!");
                                setSuccessStatus(false);
                                return;
                              }
                              handleUpdateSubmission(sub.id, theoryPoint);
                            }}
                            disabled={loading.updateSubmissionLoading}
                            icon={
                              !loading.updateSubmissionLoading && (
                                <PiCheckCircleBold
                                  className="use-font-style"
                                  size={12}
                                />
                              )
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <CustomSmallButton
                        text={"View submission"}
                        runFunction={handleOpenSubmissionModal}
                      />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <NoRecord message={"No submissions yet"} />
            )}
          </div>
        </div>
      )}
      {role !== "Student" && (
        <CreateAssignmentModal
          isVisible={isAssignmentModalVisible}
          onClose={handleCloseAssignmentModal}
          class_name={classes.find((obj) => obj.id === class_id).name}
          subject_name={subject.name}
          handlePostQuestion={handlePostQuestion}
          data={data}
          clearForm={clearForm}
        />
      )}
      <AlertModal
        isVisible={message ? true : false}
        onClose={() => setMessage("")}
        message={message}
        success={successStatus}
      />
      {role === "Student" && (
        <AlertOptionModal
          isVisible={isAssSubmitModalVisible}
          onClose={() => {
            handleCloseAssSubmitModal();
          }}
          message={`Are you sure you want to submit? This can't be undone.`}
          runFunction={() => handleSubmitAssignment()}
          loading={loading.postSubmissionLoading}
        />
      )}
      {assignmentID && role !== "Student" && (
        <AlertOptionModal
          isVisible={isOptionModalVisible}
          onClose={() => {
            handleCloseOptionModal();
            setAssignmentID(null);
          }}
          message={`Are you sure you want to delete ${getAssignmentDetails(assignmentID)?.title}? This can't be undone.`}
          runFunction={() =>
            handleDeleteAssignment(getAssignmentDetails(assignmentID)?.id)
          }
          loading={loading.deleteAssignmentLoading}
        />
      )}
      {role === "Student" && (
        <CBTQuestionModal
          onClose={handleCloseCBTModal}
          isVisible={isCBTModalVisible}
          assignment={getAssignmentDetails(selectedAssignment)}
          submitAssignment={submitAssignment}
          view={
            getSubmissionInstance ||
            !isDueDateValid(
              getAssignmentDetails(selectedAssignment)?.due_date,
              getAssignmentDetails(selectedAssignment)?.due_time,
            )
          }
        />
      )}
      {role !== "Student" && (
        <ViewSubmissionModal
          onClose={handleCloseSubmissionModal}
          isVisible={isSubmissionModalVisible}
          assignment={getAssignmentDetails(selectedAssignment)}
          view={getSubmission(
            getAssignmentDetails(selectedAssignment)?.id,
          ).find((obj) => obj.student === studentSubmission)}
          student={getStudent(studentSubmission)}
        />
      )}
    </div>
  );
};

export default Assignment;
