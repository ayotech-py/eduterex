import React, { useEffect, useState } from "react";
import "../QuestionBank/QuestionBank.css";
import "./SmartQuestioner.css";
import { BiEdit, BiFilter, BiSearch, BiTrash } from "react-icons/bi";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import { PiCheckCircleBold, PiPlusCircleBold } from "react-icons/pi";
import QuestionModal from "../../components/modals/AddQuestionModal/AddQuestionModal";
import {
  deleteQuestions,
  generateAIQuestions,
  postQuestions,
} from "../../services/schoolService";
import { useSchool } from "../../context/SchoolContext";
import Loading from "../../utils/Loader";
import AlertModal from "../../components/modals/AlertModal/AlertModal";
import NoRecord from "../../components/NoRecord";
import {
  extractTextFromFileUrl,
  getFileIcon,
  numberToOrdinalWord,
} from "../../utils/Utils";
import DownloadQuestion from "../../components/modals/DownloadQuestion/DownloadQuestion";
import { getToken } from "../../utils/tokenHelper";

const SmartQuestioner = ({ subject, class_id, role }) => {
  const { schoolState, setSchoolDatas, inLatestSession, sessionId, termId } =
    useSchool();
  const { classes, schoolLessonPlan } = schoolState;

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
  const [selectedFileID, setSelectedFileID] = useState(null);

  const [loading, setLoading] = useState({
    postQuestionLoading: false,
    deleteQuestionLoading: false,
    generateQuestionLoading: false,
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
        file: selectedFileID,
        questions: questions,
      });
      setLoading((prev) => ({ ...prev, postQuestionLoading: false }));

      if (response.success) {
        setSchoolDatas(response.schoolData);
        setQuestions({});
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

  const handleGenerateQuestionExt = async () => {
    setLoading((prev) => ({ ...prev, generateQuestionLoading: true }));
    const token = getToken();
    const url =
      "https://eduterexbackend-production.up.railway.app/api/generate-mcqs/";
    //const url = "http://127.0.0.1:7000/api/generate-mcqs/";

    try {
      const extractedText = await extractTextFromFileUrl(selectedFile);
      if (!extractedText || extractedText.trim() === "") {
        console.error("No text found in the file.");
        return;
      }

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          q_type: generateQType.join(", "),
          text: extractedText,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading((prev) => ({ ...prev, generateQuestionLoading: false }));

      const data = await response.json();
      if (response.status === 200) {
        setQuestions(data.data);
      } else {
        setMessage(data.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setLoading((prev) => ({ ...prev, generateQuestionLoading: false }));
      setMessage("An error occured, please try again later.");
      setSuccessStatus(false);
    }
  };

  const MCQQuestionUI = ({ data, index }) => {
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
            <span>Point: </span>
            {data.point}
          </p>
          <span className="question-type-tag">MCQ</span>
          <div style={{ display: "flex", gap: "10px" }}>
            <div
              className="standalone-action-button"
              onClick={() => {
                setQuestionDeleteId(index);
                if (data.id) {
                  handleAsyncDeleteQuestion(data.id);
                } else {
                  handleDeleteQuestion(index - 1);
                }
              }}
            >
              {loading.deleteQuestionLoading && questionDeleteId === index ? (
                <div className="no-loader-width">
                  <Loading />
                </div>
              ) : (
                <BiTrash className="use-font-style" />
              )}
            </div>
            <div
              className="standalone-action-button"
              onClick={() => handleEditQuestion(index)}
            >
              <BiEdit className="use-font-style" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TheoryQuestionUI = ({ data, index }) => {
    return (
      <div className="list-question-container">
        <p className="list-question-index">{index}.</p>
        <div className="list-questions">
          <p>
            <span>Question: </span>
            {data.question}
          </p>
          <p>
            <span>Point: </span>
            {data.point}
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
            <div
              className="standalone-action-button"
              onClick={() => handleDeleteQuestion(index - 1)}
            >
              <BiTrash className="use-font-style" />
            </div>
            <div
              className="standalone-action-button"
              onClick={() => handleEditQuestion(index)}
            >
              <BiEdit className="use-font-style" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const GermanQuestionUI = ({ data, index }) => {
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
            <span>Point: </span>
            {data.point}
          </p>
          <span className="question-type-tag">Cloze</span>
          <div style={{ display: "flex", gap: "10px" }}>
            <div
              className="standalone-action-button"
              onClick={() => handleDeleteQuestion(index - 1)}
            >
              <BiTrash className="use-font-style" />
            </div>
            <div
              className="standalone-action-button"
              onClick={() => handleEditQuestion(index)}
            >
              <BiEdit className="use-font-style" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const [allFileUploads, setAllFileUploads] = useState([]);
  const supportedFileTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  useEffect(() => {
    const lesson_plan = schoolLessonPlan.find(
      (obj) =>
        obj?.term === termId &&
        obj?.classes === class_id &&
        obj?.subject === subject?.id,
    );
    const allLessons = lesson_plan?.weekly_syllabus.flatMap((lesson) =>
      lesson.lesson_notes.map((note) => note.file_upload),
    );
    setAllFileUploads(
      allLessons?.filter((file) =>
        supportedFileTypes.includes(file.file_type.toLowerCase()),
      ) || [],
    );
  }, [termId, class_id, subject]);

  const [generateQType, setGenerateQType] = useState(["MCQ"]);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChangeQType = (type) => {
    if (generateQType.includes(type)) {
      setGenerateQType([...generateQType.filter((obj) => obj !== type)]);
    } else {
      setGenerateQType([...generateQType, type]);
    }
  };

  const generateQuestion = async () => {
    setLoading((prev) => ({ ...prev, generateQuestionLoading: true }));

    try {
      const response = await generateAIQuestions(
        generateQType.join(", "),
        selectedFile,
      );
      setLoading((prev) => ({ ...prev, generateQuestionLoading: false }));
      if (response.success) {
        setQuestions(response.data);
        setMessage(response.message);
        setSuccessStatus(true);
      } else {
        setMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setLoading((prev) => ({ ...prev, generateQuestionLoading: false }));
      setMessage(error);
      setSuccessStatus(false);
    }
  };

  return (
    <div className="ui-questionbank sq-container">
      <div className="sq-aside">
        <div className="sq-aside-inner overflow">
          {allFileUploads.length > 0 ? (
            <div className="sq-all-files">
              <p>
                Select a lesson material you want to fetch questions from. Only
                20questions of the selected question type can be generated at
                once.
              </p>
              {allFileUploads.map((file, index) => (
                <div className="file-preview" key={index}>
                  <input
                    type="radio"
                    className="custom-radio"
                    name={`file_selected`}
                    checked={selectedFile === file.file}
                    onChange={(e) => {
                      setSelectedFile(file.file);
                      setSelectedFileID(file.id);
                    }}
                  />
                  {getFileIcon(file)}
                  <div className="file-details">
                    <h3>{file.name}</h3>
                    <p>{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
              ))}
              <p>Select type of questions to generate</p>
              <p className="radio-item checkbox-item">
                MCQ:{" "}
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  value={"MCQ"}
                  checked={generateQType.includes("MCQ")}
                  onChange={(e) => handleChangeQType("MCQ")}
                />
              </p>
              <p className="radio-item checkbox-item">
                Cloze:{" "}
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  value={"Cloze"}
                  checked={generateQType.includes("Cloze")}
                  onChange={(e) => handleChangeQType("Cloze")}
                />
              </p>
              <p className="radio-item checkbox-item">
                Theory:{" "}
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  value={"Theory"}
                  checked={generateQType.includes("Theory")}
                  onChange={(e) => handleChangeQType("Theory")}
                />
              </p>
            </div>
          ) : (
            <NoRecord message={"No supported lesson material found"} />
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CustomSmallButton
            text={loading.generateQuestionLoading ? <Loading /> : "Generate"}
            runFunction={handleGenerateQuestionExt}
            disabled={!selectedFile || loading.generateQuestionLoading}
          />
        </div>
      </div>
      <div className="sq-main-container">
        <div className="sq-main">
          {questions?.length > 0 ? (
            <div className="ui-questionbank-content overflow">
              {questions?.map((obj, index) => {
                if (obj.question_type === "MCQ") {
                  return (
                    <MCQQuestionUI key={index} data={obj} index={index + 1} />
                  );
                } else if (obj.question_type === "Theory") {
                  return (
                    <TheoryQuestionUI
                      key={index}
                      data={obj}
                      index={index + 1}
                    />
                  );
                } else if (obj.question_type === "Cloze") {
                  return (
                    <GermanQuestionUI
                      key={index}
                      data={obj}
                      index={index + 1}
                    />
                  );
                }
                return null; // Ensure other question types don't cause issues
              })}
            </div>
          ) : (
            <NoRecord message={"No questions generated yet"} />
          )}
        </div>
        <div style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
          <CustomSmallButton
            text={
              loading.postQuestionLoading ? (
                <Loading />
              ) : (
                "Save to Question Bank"
              )
            }
            icon={
              !loading.postQuestionLoading && (
                <PiCheckCircleBold className="use-font-style" />
              )
            }
            runFunction={handlePostQuestion}
            disabled={!questions.length > 0 || loading.postQuestionLoading}
          />
        </div>
      </div>

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

export default SmartQuestioner;
