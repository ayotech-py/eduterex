import React, { useState, useEffect } from "react";
import "../CreateAssignmentModal/CreateAssignmentModal.css";
import "../AddStaffModal/AddStaffModal.css";
import "./DownloadQuestion.css";
import CustomTextInput from "../../CustomTextInput/CustomTextInput";
import { FiUser, FiMail, FiPhone, FiUserPlus } from "react-icons/fi";
import CustomSelectionInput from "../../CustomSelectionInput/CustomSelectionInput";
import { AiFillCalendar } from "react-icons/ai";
import { AlertBadge } from "../../AlertBadge";
import { isFormValid } from "../../../utils/OnboardingUtils/FormChecker";
import { MdClose } from "react-icons/md";
import Loading from "../../../utils/Loader";
import BillManagement from "../../BillManagement/BillManagement";
import CustomSmallButton from "../../Buttons/CustomSmallButton";
import { PiArrowCircleLeft, PiCheckCircleBold } from "react-icons/pi";
import WaiverBills from "../../BillManagement/WaiverBills";
import { numberToOrdinalWord } from "../../../utils/Utils";
import NoRecord from "../../NoRecord";
import { useSchool } from "../../../context/SchoolContext";
import ExamQuestionPDF from "../../QuestionPDF/ExamQuestionPDF";
import { useAuth } from "../../../context/AuthContext";
import { PDFViewer } from "@react-pdf/renderer";

const DownloadQuestion = ({ isVisible, onClose, classes, subject }) => {
  const { schoolState, setSchoolDatas, inLatestSession, sessionId, termId } =
    useSchool();
  const { schoolQuestionBank, schoolAssignments, schoolSession } = schoolState;
  const { hasAccess, authState } = useAuth();
  const { user } = authState;

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    column_layout: "",
    question_layout: "",
    option_layout: "",
    duration: "",
    date: "",
    questions: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setMessage("");
  };

  const actionTypeList = ["Question Bank", "Lesson Material"];
  const [actionType, setActionType] = useState("question bank");
  const [tab, setTab] = useState(1);

  useEffect(() => {
    setQuestions(
      schoolQuestionBank[0]?.questions?.filter(
        (obj) => obj.classes === classes.id && obj.subject === subject.id,
      ) || [],
    );
  }, [termId, schoolQuestionBank]);

  const handleCheckQuestion = (question) => {
    const selectedQuestionsID = formData.questions?.map((obj) => obj?.id);
    const isSelected = selectedQuestionsID.includes(question.id);
    if (isSelected) {
      const updatedSelectedQuestions = formData.questions?.filter(
        (obj) => obj.id !== question.id,
      );
      setFormData((prev) => ({ ...prev, questions: updatedSelectedQuestions }));
    } else {
      setFormData((prev) => ({
        ...prev,
        questions: [...prev.questions, question],
      }));
    }
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
                  ?.map((obj) => obj?.id)
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
            <span>Point: </span>
            {data.point}
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
                  ?.map((obj) => obj?.id)
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
            <span>Point: </span>
            {data.point}
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
                  ?.map((obj) => obj?.id)
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
            <span>Point: </span>
            {data.point}
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
      return <CustomSmallButton text={"Download"} />;
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
            onClose();
            setMessage("");
            setTab(1);
          }}
        />
        <div
          style={{ textAlign: "center" }}
          className="modal-heading-container"
        >
          <h2>Set Exam Questions</h2>
        </div>
        <div className="modal-sub-container overflow">
          <div
            className={`assignment-info-section overflow ${tab === 1 ? "show-in-mobile" : "hide-in-mobile"}`}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1px",
                width: "100%",
              }}
            >
              <p style={{ textAlign: "center", flex: 1 }}>
                Quesitins Layout Settings
              </p>
            </div>
            <div className="question-setup-layout">
              <p style={{ fontWeight: 600 }}>Column Layout</p>
              {[
                "Single Column - One question per row, stacked vertically",
                "Double Column - Two question side by side on each row",
              ].map((obj, index) => (
                <p
                  key={index}
                  className="radio-item"
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <input
                    type="radio"
                    className="custom-radio"
                    name={`column_layout`}
                    value={obj}
                    checked={obj === formData.column_layout}
                    onChange={(e) => handleChange(e)}
                  />
                  {obj}
                </p>
              ))}
            </div>

            <div className="question-setup-layout">
              <p style={{ fontWeight: 600 }}>Question Layout</p>
              {[
                "Side by Side - Questions and options appear on the same line",
                "Stacked - Options appear beneath each question",
              ].map((obj, index) => (
                <p
                  key={index}
                  className="radio-item"
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <input
                    type="radio"
                    className="custom-radio"
                    name={`question_layout`}
                    value={obj}
                    checked={obj === formData.question_layout}
                    onChange={(e) => handleChange(e)}
                  />
                  {obj}
                </p>
              ))}
            </div>
            <div className="question-setup-layout">
              <p style={{ fontWeight: 600 }}>Option Layout</p>
              {[
                "Side by Side - All options are shown in a single horizontal row",
                "Stacked Vertically - Each option appears on its own line",
              ].map((obj, index) => (
                <p
                  key={index}
                  className="radio-item"
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <input
                    type="radio"
                    className="custom-radio"
                    name={`option_layout`}
                    value={obj}
                    checked={obj === formData.option_layout}
                    onChange={(e) => handleChange(e)}
                  />
                  {obj}
                </p>
              ))}
            </div>
            <CustomSelectionInput
              placeholder={"Duration "}
              name={"duration"}
              value={formData.duration}
              handleChange={handleChange}
              data={[
                "30minutes",
                "45minutes",
                "1hour",
                "1hr: 30mins",
                "1hr: 45mins",
                "2hours",
                "2hrs: 30mins",
              ]}
            />
            <div style={{ width: "100%", textAlign: "left" }}>
              <CustomTextInput
                name={"date"}
                placeholder={"Exam Date"}
                value={formData.date}
                handleChange={handleChange}
              />
              <label style={{ fontSize: "12px" }}>Exam Date</label>
            </div>
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
                Choose the source for your questions
              </p>
            </div>
            <div>
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
              <p style={{ textAlign: "center", flex: 1, marginTop: "5px" }}>
                Select questions
              </p>
            </div>
            <div className="choose-question-div overflow">
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
              <p style={{ textAlign: "center", flex: 1 }}></p>
            </div>
            <div className="choose-question-div" style={{ height: "100%" }}>
              <PDFViewer style={{ width: "100%", height: "100%" }}>
                <ExamQuestionPDF
                  school={user?.school}
                  session={schoolSession.find(
                    (session) => session.id === sessionId,
                  )}
                  term={schoolSession
                    .find((session) => session.id === sessionId)
                    .terms.find((term) => term.id === termId)}
                  subject={subject.name}
                  class_name={classes.name}
                  settings={formData}
                />
              </PDFViewer>
            </div>
          </div>
        </div>
        {message && <AlertBadge message={message} />}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="mobile-ui-show">{returnButton(tab)}</div>
          <div className="hide-in-mobile">
            <CustomSmallButton text={"Download"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadQuestion;
