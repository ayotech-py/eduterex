import React, { useState, useEffect, useMemo, useRef } from "react";
import "../../components/modals/CreateAssignmentModal/CreateAssignmentModal.css";
import "./ExamQuestionManager.css";
import { PiArrowCircleLeft, PiCheckCircleBold } from "react-icons/pi";
import ExamQuestionPDF from "../../components/QuestionPDF/ExamQuestionPDF";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import CustomTextInput from "../../components/CustomTextInput/CustomTextInput";
import NoRecord from "../../components/NoRecord";
import { useSchool } from "../../context/SchoolContext";
import { useAuth } from "../../context/AuthContext";
import CustomSelectionInput from "../../components/CustomSelectionInput/CustomSelectionInput";
import { AlertBadge } from "../../components/AlertBadge";
import { downloadPDF, numberToOrdinalWord } from "../../utils/Utils";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import FeatureLockModal from "../../components/modals/FeatureLockModal/FeatureLockModal";

const ExamQuestionManager = () => {
  const { schoolState, setSchoolDatas, inLatestSession, sessionId, termId } =
    useSchool();
  const {
    schoolQuestionBank,
    schoolAssignments,
    schoolSession,
    classes,
    schoolLessonPlan,
    subjects,
  } = schoolState;
  const { hasAccess, authState } = useAuth();
  const { user } = authState;

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    column_layout: "Single Column - One question per row, stacked vertically",
    question_layout: "Stacked - Options appear beneath each question",
    option_layout:
      "Side by Side - All options are shown in a single horizontal row",
    duration: "",
    date: "",
    questions: [],
    classes: classes[0] ?? {},
    subject: subjects[0] ?? {},
    font_size: 12,
    mcq_instr: "",
    cloze_instr: "",
    theory_instr: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "classes" || name === "subject") {
      setFormData({
        ...formData,
        [name]:
          name === "classes"
            ? classes.find((obj) => obj.id === parseInt(value))
            : subjects.find((obj) => obj.id === parseInt(value)),
        questions: [],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    setMessage("");
  };

  const actionTypeList = ["MCQ", "Cloze", "Theory"];
  const [actionType, setActionType] = useState("MCQ");
  const [tab, setTab] = useState(1);

  useEffect(() => {
    const fileUploadIds = [];
    const lesson_plan = schoolLessonPlan.find(
      (obj) =>
        obj?.term === termId &&
        obj?.classes === formData.classes?.id &&
        obj?.subject === formData.subject?.id,
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
          (obj.classes === formData.classes?.id &&
            obj.subject === formData.subject?.id) ||
          (fileUploadIds.includes(obj?.file_upload?.id) &&
            obj.question_type === actionType),
      ) || [],
    );
  }, [
    termId,
    schoolQuestionBank,
    actionType,
    formData.classes?.id,
    formData.subject?.id,
  ]);

  /* const handleCheckQuestion = (question) => {
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
                  ?.map((obj) => obj?.id)
                  .includes(data.id)}
                onChange={(e) => {
                  e.preventDefault();
                  handleCheckQuestion(data);
                }}
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
          <p>{data.point} mark(s)</p>
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
                onChange={(e) => {
                  e.preventDefault();
                  handleCheckQuestion(data);
                }}
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
          <p>{data.point} mark(s)</p>
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
                onChange={(e) => {
                  e.preventDefault();
                  handleCheckQuestion(data);
                }}
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
          <p>{data.point} mark(s)</p>
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
          text={"Download"}
          runFunction={() => handleDownloadQuestion()}
        />
      );
    }
  };

  const isMobileDevice = () => {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  };

  const checkVirtualClassroomSubscription = () => {
    if (hasAccess(8)) {
      if (hasAccess(11)) {
        return true;
      }
    }
    return false;
  };

  const doc = useMemo(
    () => (
      <ExamQuestionPDF
        school={user?.school}
        session={schoolSession.find((session) => session.id === sessionId)}
        term={schoolSession
          .find((session) => session.id === sessionId)
          ?.terms.find((term) => term.id === termId)}
        subject={formData.subject?.name}
        class_name={formData.classes?.name}
        settings={formData}
      />
    ),
    [user?.school, schoolSession, sessionId, termId, formData],
  );

  const downloadExamPDF = async (doc, filename) => {
    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadQuestion = async () => {
    await downloadExamPDF(
      doc,
      `${formData.classes?.name.replaceAll(" ", "-")}-${formData.subject.name.replaceAll(" ", "-")}-exam-question.pdf`,
    );
  };

  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      const prevScrollTop = el.scrollTop;
      const prevScrollLeft = el.scrollLeft;

      // Wait for render
      setTimeout(() => {
        el.scrollTop = prevScrollTop;
        el.scrollLeft = prevScrollLeft;
      }, 0);
    }
  }, [questions]);

  return !checkVirtualClassroomSubscription() ? (
    <div className="exam-manager">
      <div
        className="create-assignment exam-question-container"
        onClick={(e) => e.stopPropagation()}
      >
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
              <p style={{ textAlign: "center", flex: 1, fontWeight: 600 }}>
                Questions Layout Settings
              </p>
            </div>
            <div className="question-setup-layout">
              <CustomSelectionInput
                placeholder={"Class"}
                name={"classes"}
                handleChange={handleChange}
                options={classes.map((obj) => ({
                  label: obj.name,
                  value: obj.id,
                }))}
              />
              <CustomSelectionInput
                placeholder={"Subject"}
                name={"subject"}
                handleChange={handleChange}
                options={[
                  ...subjects.map((obj) => ({
                    label: obj.name,
                    value: obj.id,
                  })),
                ]}
              />
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
            <div style={{ width: "100%", textAlign: "left" }}>
              <CustomSelectionInput
                placeholder={"Body Text Font Size "}
                name={"font_size"}
                value={formData.font_size}
                handleChange={handleChange}
                data={[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]}
              />
              <label style={{ fontSize: "12px" }}>Body Font Size</label>
            </div>
            <CustomSelectionInput
              placeholder={"Duration "}
              name={"duration"}
              value={formData.duration}
              handleChange={handleChange}
              data={[
                "30 minutes",
                "45 minutes",
                "1 hour",
                "1 hr 30 mins",
                "1 hr 45 mins",
                "2 hours",
                "2 hrs 30 mins",
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
            <CustomTextInput
              name={"mcq_instr"}
              value={formData.mcq_instr}
              placeholder={"Enter MCQ Section Instruction"}
              handleChange={handleChange}
            />
            <CustomTextInput
              name={"cloze_instr"}
              value={formData.cloze_instr}
              placeholder={"Enter Cloze Section Instruction"}
              handleChange={handleChange}
            />
            <CustomTextInput
              name={"theory_instr"}
              value={formData.theory_instr}
              placeholder={"Enter Theory Section Instruction"}
              handleChange={handleChange}
            />
          </div>
          <div
            className={`choose-question-section ${tab === 2 ? "show-in-mobile" : "hide-in-mobile"}`}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <PiArrowCircleLeft
                className="mobile-ui-show"
                onClick={() => setTab(1)}
                style={{
                  fontSize: "25px",
                  padding: "5px 5px 5px 0px",
                  color: "#711a75",
                }}
              />
              <p style={{ textAlign: "center", flex: 1, fontWeight: 600 }}>
                Choose the questions to include in the exam and review their
                details before downloading.
              </p>
            </div>
            <div>
              <div className="vc-action-container">
                <div className="vc-action">
                  {actionTypeList.map((obj) => (
                    <div
                      className={`${actionType === obj ? "selected" : ""} action-name`}
                      onClick={() => setActionType(obj)}
                    >
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* <p style={{ textAlign: "center", flex: 1, marginTop: "5px" }}>
                Select questions
              </p> */}
            </div>
            <div className="choose-question-div overflow" ref={questionDivRef}>
              {questions.length > 0 ? (
                questions?.map((obj, index) => {
                  if (obj.question_type === "MCQ") {
                    return (
                      <MCQQuestionUI
                        key={obj.id}
                        data={obj}
                        index={index + 1}
                        checkbox={true}
                      />
                    );
                  } else if (obj.question_type === "Theory") {
                    return (
                      <TheoryQuestionUI
                        key={obj.id}
                        data={obj}
                        index={index + 1}
                        checkbox={true}
                      />
                    );
                  } else if (obj.question_type === "Cloze") {
                    return (
                      <GermanQuestionUI
                        key={obj.id}
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
              <p style={{ textAlign: "center", flex: 1, fontWeight: 600 }}>
                Download Your Exam Question
              </p>
            </div>
            <div
              className="choose-question-div"
              style={{ height: "100%", width: "100%", overflow: "auto" }}
            >
              {isMobileDevice() ? (
                <PDFViewer style={{ width: "100%", height: "100%" }}>
                  {
                    <ExamQuestionPDF
                      school={user?.school}
                      session={schoolSession.find(
                        (session) => session.id === sessionId,
                      )}
                      term={schoolSession
                        .find((session) => session.id === sessionId)
                        ?.terms.find((term) => term.id === termId)}
                      subject={formData.subject?.name}
                      class_name={formData.classes?.name}
                      settings={formData}
                    />
                  }
                </PDFViewer>
              ) : (
                <PDFViewer style={{ width: "100%", height: "100%" }}>
                  {
                    <ExamQuestionPDF
                      school={user?.school}
                      session={schoolSession.find(
                        (session) => session.id === sessionId,
                      )}
                      term={schoolSession
                        .find((session) => session.id === sessionId)
                        ?.terms.find((term) => term.id === termId)}
                      subject={formData.subject?.name}
                      class_name={formData.classes?.name}
                      settings={formData}
                    />
                  }
                </PDFViewer>
              )}
            </div>
          </div>
        </div>
        {message && <AlertBadge message={message} />}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="mobile-ui-show">{returnButton(tab)}</div>
          <div className="hide-in-mobile">
            <CustomSmallButton
              text={"Download"}
              runFunction={() => handleDownloadQuestion()}
              disabled={!termId ? true : false}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <FeatureLockModal isLocked={checkVirtualClassroomSubscription()} />
  );
};

export default React.memo(ExamQuestionManager);
