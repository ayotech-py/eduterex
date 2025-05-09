import React, { useState, useEffect, useRef } from "react";
import "./CreateAssignmentModal.css";
import "../AddStaffModal/AddStaffModal.css";
import CustomTextInput from "../../CustomTextInput/CustomTextInput";
import CustomSelectionInput from "../../CustomSelectionInput/CustomSelectionInput";
import { AlertBadge } from "../../AlertBadge";
import { MdClose } from "react-icons/md";
import Loading from "../../../utils/Loader";
import CustomSmallButton from "../../Buttons/CustomSmallButton";
import { PiArrowCircleLeft, PiCheckCircleBold } from "react-icons/pi";
import { numberToOrdinalWord } from "../../../utils/Utils";
import NoRecord from "../../NoRecord";
import { useSchool } from "../../../context/SchoolContext";

const CreateAssignmentModal = ({
  isVisible,
  onClose,
  data,
  clearForm,
  handlePostQuestion,
  class_name,
  subject_name,
}) => {
  const { schoolState, setSchoolDatas, inLatestSession, sessionId, termId } =
    useSchool();
  const { schoolQuestionBank, schoolLessonPlan } = schoolState;

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    session: "",
    term: "",
    title: "",
    classes: "",
    subject: "",
    assignment_type: "MCQ",
    questions: [],
    is_auto_graded: "",
    show_scores_immediately: "",
    assessment_mode: "",
    due_time: "",
    due_date: "",
    total_points: 0,
  });

  useEffect(() => {
    setFormData({
      ...data,
      is_auto_graded: true,
      show_scores_immediately: true,
    });
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "assignment_type") {
      setFormData((prev) => ({
        ...prev,
        total_points: 0,
        questions: [],
      }));
    }
    setMessage("");
  };

  const [tab, setTab] = useState(1);

  useEffect(() => {
    const fileUploadIds = [];
    const lesson_plan = schoolLessonPlan.find(
      (obj) =>
        obj?.term === termId &&
        obj?.classes === data.classes &&
        obj?.subject === data.subject,
    );
    const less_sys = lesson_plan?.weekly_syllabus;

    less_sys?.forEach((week) => {
      week.lesson_notes?.forEach((note) => {
        const fileId = note.file_upload?.id;
        if (fileId !== undefined) {
          fileUploadIds.push(fileId);
        }
      });
    });
    setQuestions(
      schoolQuestionBank[0]?.questions?.filter(
        (obj) =>
          ((obj.classes === data.classes && obj.subject === data.subject) ||
            fileUploadIds.includes(obj?.file_upload?.id)) &&
          obj.question_type === formData.assignment_type,
      ) || [],
    );
  }, [termId, schoolQuestionBank, data, formData.assignment_type]);

  /* const handleCheckQuestion = (question) => {
    const selectedQuestionsID = formData.questions.map((obj) => obj?.id);
    const isSelected = selectedQuestionsID.includes(question.id);
    if (isSelected) {
      const updatedSelectedQuestions = formData.questions.filter(
        (obj) => obj.id !== question.id,
      );
      setFormData((prev) => ({
        ...prev,
        questions: updatedSelectedQuestions,
        total_points: prev.total_points - question.point,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        questions: [...prev.questions, question],
        total_points: prev.total_points + question.point,
      }));
    }
    setMessage("");
  }; */

  const questionDivRef = useRef(null);

  const handleCheckQuestion = (question) => {
    const scrollTop = questionDivRef.current?.scrollTop || 0;

    const selectedQuestionsID = formData.questions.map((obj) => obj?.id);
    const isSelected = selectedQuestionsID.includes(question.id);

    if (isSelected) {
      const updatedSelectedQuestions = formData.questions.filter(
        (obj) => obj.id !== question.id,
      );
      setFormData((prev) => ({
        ...prev,
        questions: updatedSelectedQuestions,
        total_points: prev.total_points - question.point,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        questions: [...prev.questions, question],
        total_points: prev.total_points + question.point,
      }));
    }
    setMessage("");

    // Restore scroll position after state update
    setTimeout(() => {
      if (questionDivRef.current) {
        questionDivRef.current.scrollTop = scrollTop;
      }
    }, 0);
  };

  const MCQQuestionUI = ({ data, index, checkbox }) => {
    return (
      <div
        className="list-question-container"
        style={{ backgroundColor: "#fff" }}
      >
        {checkbox ? (
          <div className="radio-group role-container">
            <p className="radio-item checkbox-item">
              <input
                type="checkbox"
                style={{ marginLeft: "0px" }}
                className="custom-checkbox"
                checked={formData.questions
                  .map((obj) => obj?.id)
                  .includes(data.id)}
                onChange={() => handleCheckQuestion(data)}
              />{" "}
            </p>
          </div>
        ) : (
          <p className="list-question-index">{index}.</p>
        )}
        <div className="list-questions">
          <p>
            <span>Question: </span>
            {data.question}
          </p>
          {data?.image && (
            <img
              src={data?.image}
              alt="question"
              style={{ height: "150px", width: "auto", objectFit: "contain" }}
            />
          )}
          <div className="list-questions-options">
            {data.options.map((opt, index) => (
              <p>
                <span>Option {index + 1}: </span>
                {opt}
              </p>
            ))}
          </div>
          <p>
            <span>Correct Answer: </span>
            {data.correct_answer}
          </p>
          <p>
            <span>Mark: </span>
            {data.point} mark(s)
          </p>
          <span className="question-type-tag">MCQ</span>
        </div>
      </div>
    );
  };

  const TheoryQuestionUI = ({ data, index, checkbox }) => {
    return (
      <div
        className="list-question-container"
        style={{ backgroundColor: "#fff" }}
      >
        {checkbox ? (
          <div className="radio-group role-container">
            <p className="radio-item checkbox-item">
              <input
                type="checkbox"
                className="custom-checkbox"
                style={{ marginLeft: "0px" }}
                checked={formData.questions
                  .map((obj) => obj?.id)
                  .includes(data.id)}
                onChange={() => handleCheckQuestion(data)}
              />{" "}
            </p>
          </div>
        ) : (
          <p className="list-question-index">{index}.</p>
        )}
        <div className="list-questions">
          <p>
            <span>Question: </span>
            {data.question}
          </p>
          <p>
            <span>Mark: </span>
            {data.point} mark(s)
          </p>
          {data?.image && (
            <img
              src={data?.image}
              alt="question"
              style={{ height: "150px", width: "auto", objectFit: "contain" }}
            />
          )}
          <span className="question-type-tag">Theory</span>
        </div>
      </div>
    );
  };

  const GermanQuestionUI = ({ data, index, checkbox }) => {
    return (
      <div
        className="list-question-container"
        style={{ backgroundColor: "#fff" }}
      >
        {checkbox ? (
          <div className="radio-group role-container">
            <p className="radio-item checkbox-item">
              <input
                type="checkbox"
                className="custom-checkbox"
                style={{ marginLeft: "0px" }}
                checked={formData.questions
                  .map((obj) => obj?.id)
                  .includes(data.id)}
                onChange={() => handleCheckQuestion(data)}
              />{" "}
            </p>
          </div>
        ) : (
          <p className="list-question-index">{index}.</p>
        )}
        <div className="list-questions">
          <p>
            <span>Question: </span>
            {data.question}
          </p>
          <p>
            <span>Mark: </span>
            {data.point} mark(s)
          </p>
          {data?.image && (
            <img
              src={data?.image}
              alt="question"
              style={{ height: "150px", width: "auto", objectFit: "contain" }}
            />
          )}
          <div className="list-questions-options">
            {data.possible_answers.map((opt, index) => (
              <p>
                <span>{numberToOrdinalWord(index + 1)} Possible answers: </span>
                {opt.join(", ")}
              </p>
            ))}
          </div>
          <span className="question-type-tag">Cloze</span>
        </div>
      </div>
    );
  };

  const returnButton = (id) => {
    if (id === 1) {
      return (
        <CustomSmallButton
          text={"Next"}
          runFunction={() => setTab((prev) => prev + 1)}
        />
      );
    } else if (id === 2) {
      return (
        <CustomSmallButton
          text={"Next"}
          runFunction={() => setTab((prev) => prev + 1)}
        />
      );
    } else {
      return (
        <CustomSmallButton
          text={
            loading ? (
              <Loading />
            ) : data.id ? (
              "Update Assignment"
            ) : (
              "Create Assignment"
            )
          }
          disabled={loading}
          icon={!loading && <PiCheckCircleBold className="use-font-style" />}
          runFunction={() => {
            handlePostQuestion(formData, setLoading, setMessage);
          }}
        />
      );
    }
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div
        className="modal-content create-assignment"
        onClick={(e) => e.stopPropagation()}
      >
        <MdClose
          className="close-modal"
          onClick={() => {
            clearForm();
            onClose();
            setMessage("");
            setTab(1);
          }}
        />
        <div
          style={{ textAlign: "center" }}
          className="modal-heading-container"
        >
          <h2>{data.id ? "Edit" : "Create"} Assignment</h2>
        </div>
        <div className="modal-sub-container overflow">
          <div
            className={`assignment-info-section ${tab === 1 ? "show-in-mobile" : "hide-in-mobile"}`}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1px",
                width: "100%",
              }}
            >
              <p style={{ textAlign: "center", flex: 1 }}>Assignment Details</p>
            </div>
            <CustomTextInput
              name={"title"}
              placeholder={"Enter assignment title"}
              value={formData.title}
              handleChange={handleChange}
            />
            <CustomTextInput
              name={"class"}
              placeholder={"Class"}
              value={class_name}
              disabled={true}
            />
            <CustomTextInput
              name={"subject"}
              placeholder={"Subject"}
              value={subject_name}
              disabled={true}
            />
            <CustomSelectionInput
              placeholder={"Choose type (e.g., MCQ)"}
              name={"assignment_type"}
              value={formData.assignment_type}
              handleChange={handleChange}
              data={["MCQ", "Cloze", "Theory"]}
            />
            <CustomSelectionInput
              placeholder={"Mode of Assessment"}
              name={"assessment_mode"}
              value={formData.assessment_mode}
              handleChange={handleChange}
              data={
                formData.assignment_type === "Theory"
                  ? ["File Upload"]
                  : ["CBT", "File Upload"]
              }
            />
            <div style={{ width: "100%", textAlign: "left" }}>
              <CustomTextInput
                name={"due_date"}
                placeholder={"Due Date"}
                value={formData.due_date}
                handleChange={handleChange}
              />
              <label style={{ fontSize: "12px" }}>Due Date</label>
            </div>
            <div style={{ width: "100%", textAlign: "left" }}>
              <CustomTextInput
                name={"due_time"}
                placeholder={"Due Time"}
                value={formData.due_time}
                handleChange={handleChange}
              />
              <label style={{ fontSize: "12px" }}>Due Time</label>
            </div>
            <p>
              <span style={{ fontWeight: 500 }}>Total Point: </span>
              {formData.total_points}
            </p>
          </div>
          <div
            className={`choose-question-section ${tab === 2 ? "show-in-mobile" : "hide-in-mobile"}`}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1px" }}>
              <PiArrowCircleLeft
                className="mobile-ui-show"
                onClick={() => setTab(1)}
                style={{
                  fontSize: "25px",
                  padding: "5px 5px 5px 0px",
                  color: "#711a75",
                }}
              />
              <p style={{ textAlign: "center", flex: 1 }}>
                Select questions to include in the assignment
              </p>
            </div>
            <div className="choose-question-div overflow" ref={questionDivRef}>
              {questions.length > 0 ? (
                questions?.map((obj, index) => {
                  if (obj.question_type === "MCQ") {
                    return (
                      <MCQQuestionUI
                        key={index}
                        data={obj}
                        index={index + 1}
                        checkbox={true}
                      />
                    );
                  } else if (obj.question_type === "Theory") {
                    return (
                      <TheoryQuestionUI
                        key={index}
                        data={obj}
                        index={index + 1}
                        checkbox={true}
                      />
                    );
                  } else if (obj.question_type === "Cloze") {
                    return (
                      <GermanQuestionUI
                        key={index}
                        data={obj}
                        index={index + 1}
                        checkbox={true}
                      />
                    );
                  }
                  return null; // Ensure other question types don't cause issues
                })
              ) : (
                <NoRecord message={"No questions added yet"} />
              )}
            </div>
          </div>
          <div
            className={`selected-questions-section overflow ${tab === 3 ? "show-in-mobile" : "hide-in-mobile"}`}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1px" }}>
              <PiArrowCircleLeft
                className="mobile-ui-show"
                onClick={() => setTab(2)}
                style={{
                  fontSize: "25px",
                  padding: "5px 5px 5px 0px",
                  color: "#711a75",
                }}
              />
              <p style={{ textAlign: "center", flex: 1 }}>
                All selected questions will be listed here for review
              </p>
            </div>
            <div className="choose-question-div">
              {formData.questions.length > 0 ? (
                formData.questions?.map((obj, index) => {
                  if (obj.question_type === "MCQ") {
                    return (
                      <MCQQuestionUI
                        key={index}
                        data={obj}
                        index={index + 1}
                        checkbox={false}
                      />
                    );
                  } else if (obj.question_type === "Theory") {
                    return (
                      <TheoryQuestionUI
                        key={index}
                        data={obj}
                        index={index + 1}
                        checkbox={false}
                      />
                    );
                  } else if (obj.question_type === "Cloze") {
                    return (
                      <GermanQuestionUI
                        key={index}
                        data={obj}
                        index={index + 1}
                        checkbox={false}
                      />
                    );
                  }
                  return null; // Ensure other question types don't cause issues
                })
              ) : (
                <NoRecord message={"No questions added yet"} />
              )}
            </div>
          </div>
        </div>
        {message && <AlertBadge message={message} />}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="mobile-ui-show">{returnButton(tab)}</div>
          <div className="hide-in-mobile">
            <CustomSmallButton
              text={
                loading ? (
                  <Loading />
                ) : data.id ? (
                  "Update Assignment"
                ) : (
                  "Create Assignment"
                )
              }
              disabled={loading}
              icon={
                !loading && <PiCheckCircleBold className="use-font-style" />
              }
              runFunction={() => {
                handlePostQuestion(formData, setLoading, setMessage, setTab);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignmentModal;
