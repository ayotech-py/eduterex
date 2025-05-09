import React, { useEffect, useState } from "react";
import "./QuestionBank.css";
import { BiEdit, BiTrash } from "react-icons/bi";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import { PiCheckCircleBold, PiPlusCircleBold } from "react-icons/pi";
import QuestionModal from "../../components/modals/AddQuestionModal/AddQuestionModal";
import { deleteQuestions, postQuestions } from "../../services/schoolService";
import { useSchool } from "../../context/SchoolContext";
import Loading from "../../utils/Loader";
import AlertModal from "../../components/modals/AlertModal/AlertModal";
import NoRecord from "../../components/NoRecord";
import { numberToOrdinalWord } from "../../utils/Utils";
import DownloadQuestion from "../../components/modals/DownloadQuestion/DownloadQuestion";
import { useAuth } from "../../context/AuthContext";

const QuestionBank = ({ subject, class_id, role }) => {
  const { schoolState, setSchoolDatas, termId } = useSchool();
  const { classes, schoolLessonPlan, schoolQuestionBank } = schoolState;
  const { authState } = useAuth();
  const { user } = authState;

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const handleOpenFilterModal = () => setIsFilterModalVisible(true);
  const handleCloseFilterModal = () => setIsFilterModalVisible(false);

  const [isDownloadModalVisible, setIsDownloadModalVisible] = useState(false);
  const handleOpenDownloadModal = () => setIsDownloadModalVisible(true);
  const handleCloseDownloadModal = () => setIsDownloadModalVisible(false);

  const [isQuestionModalVisible, setIsQuestionModalVisible] = useState(false);
  const handleOpenQuestionModal = () => setIsQuestionModalVisible(true);
  const handleCloseQuestionModal = () => setIsQuestionModalVisible(false);

  const [message, setMessage] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [editQuestionID, setEditQuestionID] = useState(null);
  const [questionDeleteId, setQuestionDeleteId] = useState(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState({
    postQuestionLoading: false,
    deleteQuestionLoading: true,
  });

  const onAddQuestion = (data) => {
    if (editQuestionID) {
      const updatedQuestion = [...questions];
      updatedQuestion[editQuestionID - 1] = data;
      setQuestions(updatedQuestion);
      setEditQuestionID(null);
    } else {
      setQuestions((prev) => [...prev, data]);
    }
  };

  const handlePostQuestion = async () => {
    setLoading((prev) => ({ ...prev, postQuestionLoading: true }));

    try {
      const response = await postQuestions({
        term_id: termId,
        class_id: class_id,
        subject_id: subject.id,
        questions: questions,
      });
      setLoading((prev) => ({ ...prev, postQuestionLoading: false }));

      if (response.success) {
        setSchoolDatas(response.schoolData);
        setMessage(response.message);
        setSuccessStatus(true);
      } else {
        setMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setLoading((prev) => ({ ...prev, postQuestionLoading: false }));
      setMessage(error);
      setSuccessStatus(false);
    }
  };

  const handleDeleteQuestion = (id) => {
    const updatedQuestions = questions.filter((_, index) => index !== id);
    setQuestions(updatedQuestions);
  };

  const handleEditQuestion = (id) => {
    setEditQuestionID(id);
    handleOpenQuestionModal();
  };

  const handleAsyncDeleteQuestion = async (id) => {
    setLoading((prev) => ({ ...prev, deleteQuestionLoading: true }));

    try {
      const response = await deleteQuestions(id);
      setLoading((prev) => ({ ...prev, deleteQuestionLoading: false }));

      if (response.success) {
        setSchoolDatas(response.schoolData);
        setMessage(response.message);
        setSuccessStatus(true);
      } else {
        setMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setLoading((prev) => ({ ...prev, deleteQuestionLoading: false }));
      setMessage(error);
      setSuccessStatus(false);
    }
  };

  useEffect(() => {
    const fileUploadIds = [];
    const lesson_plan = schoolLessonPlan.find(
      (obj) =>
        obj?.term === termId &&
        obj?.classes === class_id &&
        obj?.subject === subject?.id,
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
          (obj.classes === class_id && obj.subject === subject.id) ||
          fileUploadIds.includes(obj?.file_upload?.id),
      ) || [],
    );
  }, [schoolLessonPlan, termId, class_id, subject, schoolQuestionBank]);

  const MCQQuestionUI = ({ data, index }) => {
    const has_permission = data?.file_upload
      ? user?.school.id === data?.file_upload.school
      : true;
    return (
      <div className="list-question-container">
        <p className="list-question-index">{index}.</p>
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
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="standalone-action-button"
              disabled={!has_permission}
              onClick={() => {
                setQuestionDeleteId(index);
                if (data.id) {
                  handleAsyncDeleteQuestion(data.id);
                } else {
                  handleDeleteQuestion(index - 1);
                }
              }}
              style={{
                opacity: has_permission ? 1.0 : 0.4,
              }}
            >
              {loading.deleteQuestionLoading && questionDeleteId === index ? (
                <div className="no-loader-width">
                  <Loading />
                </div>
              ) : (
                <BiTrash className="use-font-style" />
              )}
            </button>
            <button
              disabled={!has_permission}
              style={{
                opacity: has_permission ? 1.0 : 0.4,
              }}
              className="standalone-action-button"
              onClick={() => handleEditQuestion(index)}
            >
              <BiEdit className="use-font-style" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const TheoryQuestionUI = ({ data, index }) => {
    const has_permission = data?.file_upload
      ? user?.school.id === data?.file_upload.school
      : true;
    return (
      <div className="list-question-container">
        <p className="list-question-index">{index}.</p>
        <div className="list-questions">
          <p>
            <span>Question: </span>
            {data.question}
          </p>
          <p>
            <span>Mark: </span>
            {data.point} mark(s)
          </p>
          <span className="question-type-tag">Theory</span>
          {data?.image && (
            <img
              src={data?.image}
              alt="question"
              style={{ height: "150px", width: "auto", objectFit: "contain" }}
            />
          )}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="standalone-action-button"
              disabled={!has_permission}
              onClick={() => {
                setQuestionDeleteId(index);
                if (data.id) {
                  handleAsyncDeleteQuestion(data.id);
                } else {
                  handleDeleteQuestion(index - 1);
                }
              }}
              style={{
                opacity: has_permission ? 1.0 : 0.4,
              }}
            >
              {loading.deleteQuestionLoading && questionDeleteId === index ? (
                <div className="no-loader-width">
                  <Loading />
                </div>
              ) : (
                <BiTrash className="use-font-style" />
              )}
            </button>
            <button
              disabled={!has_permission}
              style={{
                opacity: has_permission ? 1.0 : 0.4,
              }}
              className="standalone-action-button"
              onClick={() => handleEditQuestion(index)}
            >
              <BiEdit className="use-font-style" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const GermanQuestionUI = ({ data, index }) => {
    const has_permission = data?.file_upload
      ? user?.school.id === data?.file_upload.school
      : true;
    return (
      <div className="list-question-container">
        <p className="list-question-index">{index}.</p>
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
            {data.possible_answers.map((opt, index) => (
              <p>
                <span>{numberToOrdinalWord(index + 1)} Possible answers: </span>
                {opt.join(", ")}
              </p>
            ))}
          </div>
          <p>
            <span>Mark: </span>
            {data.point} mark(s)
          </p>
          <span className="question-type-tag">Cloze</span>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="standalone-action-button"
              disabled={!has_permission}
              onClick={() => {
                setQuestionDeleteId(index);
                if (data.id) {
                  handleAsyncDeleteQuestion(data.id);
                } else {
                  handleDeleteQuestion(index - 1);
                }
              }}
              style={{
                opacity: has_permission ? 1.0 : 0.4,
              }}
            >
              {loading.deleteQuestionLoading && questionDeleteId === index ? (
                <div className="no-loader-width">
                  <Loading />
                </div>
              ) : (
                <BiTrash className="use-font-style" />
              )}
            </button>
            <button
              disabled={!has_permission}
              style={{
                opacity: has_permission ? 1.0 : 0.4,
              }}
              className="standalone-action-button"
              onClick={() => handleEditQuestion(index)}
            >
              <BiEdit className="use-font-style" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="ui-questionbank">
      <div className="ui-questionbank-heading no-width">
        <div className="tfm-heading">
          {/* <div className="tfm-filter" onClick={handleOpenFilterModal}>
            <BiFilter className="tfm-filter-icon" />
            <p>Filter</p>
          </div>
          <div className="search-container">
            <input
              type="text"
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, student id, and class."
            />
            <BiSearch className="search-icon" />
          </div> */}
          {/* <CustomSmallButton
            text={"Set Question"}
            icon={<PiPlusCircleBold className="use-font-style" />}
            runFunction={handleOpenDownloadModal}
          /> */}
          <CustomSmallButton
            text={"Add Question"}
            icon={<PiPlusCircleBold className="use-font-style" />}
            runFunction={handleOpenQuestionModal}
          />
        </div>
        <div style={{ display: "flex", gap: "5px" }}>
          <CustomSmallButton
            text={loading.postQuestionLoading ? <Loading /> : "Save Changes"}
            icon={
              !loading.postQuestionLoading && (
                <PiCheckCircleBold className="use-font-style" />
              )
            }
            runFunction={handlePostQuestion}
            disabled={loading.postQuestionLoading}
          />
        </div>
      </div>
      {questions?.length > 0 ? (
        <div className="ui-questionbank-content overflow">
          {questions?.map((obj, index) => {
            if (obj.question_type === "MCQ") {
              return <MCQQuestionUI key={index} data={obj} index={index + 1} />;
            } else if (obj.question_type === "Theory") {
              return (
                <TheoryQuestionUI key={index} data={obj} index={index + 1} />
              );
            } else if (obj.question_type === "Cloze") {
              return (
                <GermanQuestionUI key={index} data={obj} index={index + 1} />
              );
            }
            return null; // Ensure other question types don't cause issues
          })}
        </div>
      ) : (
        <NoRecord message={"No questions added yet"} />
      )}
      {role !== "Student" && (
        <DownloadQuestion
          isVisible={isDownloadModalVisible}
          onClose={handleCloseDownloadModal}
          classes={classes.find((obj) => obj.id === class_id)}
          subject={subject}
        />
      )}
      <QuestionModal
        isOpen={isQuestionModalVisible}
        onClose={handleCloseQuestionModal}
        onAddQuestion={onAddQuestion}
        editQuestionID={editQuestionID}
        setEditQuestionID={setEditQuestionID}
        questionToEdit={editQuestionID && questions[editQuestionID - 1]}
      />
      <AlertModal
        isVisible={message ? true : false}
        onClose={() => setMessage("")}
        message={message}
        success={successStatus}
      />
    </div>
  );
};

export default QuestionBank;
