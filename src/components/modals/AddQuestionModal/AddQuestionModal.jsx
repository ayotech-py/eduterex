import React, { useEffect, useState } from "react";
import "./AddQuestionModal.css"; // Import the CSS file
import { FaPlus, FaTimes } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import CustomSmallButton from "../../Buttons/CustomSmallButton";
import {
  PiCameraBold,
  PiMinusCircleBold,
  PiPlusCircleBold,
} from "react-icons/pi";
import CustomSelectionInput from "../../CustomSelectionInput/CustomSelectionInput";
import CustomTextAreaInput from "../../CustomTextInput/CustomTextAreaInput";
import CustomTextInput from "../../CustomTextInput/CustomTextInput";
import {
  allowedImageTypes,
  checkImageType,
  compressImage,
  numberToOrdinal,
  numberToOrdinalWord,
} from "../../../utils/Utils";

const QuestionModal = ({
  isOpen,
  onClose,
  onAddQuestion,
  editQuestionID,
  questionToEdit,
  setEditQuestionID,
}) => {
  const [questionType, setQuestionType] = useState("MCQ");
  const [question, setQuestion] = useState("");
  const [point, setPoint] = useState(1);
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [possibleAnswers, setPossibleAnswers] = useState([[""]]);
  const [id, setId] = useState(null);

  const [questionImage, setQuestionImage] = useState(null);

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handlePossibleAnswerChange = (gapIndex, answerIndex, value) => {
    const updatedAnswers = [...possibleAnswers];
    updatedAnswers[gapIndex][answerIndex] = value;
    setPossibleAnswers(updatedAnswers);
  };

  const addNewGap = () => {
    setPossibleAnswers([...possibleAnswers, [""]]);
  };

  const addNewPossibleAnswer = (gapIndex) => {
    const updatedAnswers = [...possibleAnswers];
    updatedAnswers[gapIndex].push("");
    setPossibleAnswers(updatedAnswers);
  };

  const handleAddQuestion = () => {
    // Trim inputs to remove unnecessary spaces
    if (!question?.trim()) {
      alert("Question field cannot be empty.");
      return;
    }

    let newQuestion;

    if (questionType === "MCQ") {
      if (options.length < 2) {
        alert("MCQ must have at least two options.");
        return;
      }
      if (!correctAnswer.trim()) {
        alert("Please select a correct answer.");
        return;
      }

      if (options.some((ans) => !ans.trim())) {
        alert("Please fill all the options.");
        return;
      }

      newQuestion = {
        action: editQuestionID && id ? "edit" : "add",
        question,
        question_type: "MCQ",
        options,
        correct_answer: correctAnswer,
        point: parseInt(point),
      };
    } else if (questionType === "Cloze") {
      if (
        possibleAnswers.length === 0 ||
        possibleAnswers.some((ansArray) => ansArray.some((ans) => !ans.trim()))
      ) {
        alert(
          "Each blank in the German question must have at least one possible answer.",
        );
        return;
      }

      newQuestion = {
        action: editQuestionID && id ? "edit" : "add",
        question,
        question_type: "Cloze",
        possible_answers: possibleAnswers,
        point: parseInt(point),
      };
    } else if (questionType === "Theory") {
      newQuestion = {
        action: editQuestionID && id ? "edit" : "add",
        question,
        question_type: "Theory",
        point: parseInt(point),
      };
    }

    if (editQuestionID) {
      newQuestion.id = id; // Ensure 'id' is properly defined before using it
    }

    if (questionImage && !questionImage.includes("http")) {
      newQuestion.image = questionImage;
    }

    // If all fields are filled, proceed with adding the question
    onAddQuestion(newQuestion);
    clearForm();
    onClose(); // Close modal after adding
  };

  const clearForm = () => {
    setQuestion("");
    setOptions([]);
    setCorrectAnswer("");
    setPossibleAnswers([[""]]);
    setEditQuestionID(null);
    setId(null);
    setQuestionImage(null);
  };

  const handleRemoveOption = (id) => {
    const updatedOptions = options.filter((_, index) => index !== id);
    setOptions(updatedOptions);
  };

  const handlePossibleAnswer = (gapIndex, id) => {
    let updatedPossibleAnswers = possibleAnswers;
    let updatedOptions = possibleAnswers[gapIndex].filter(
      (_, index) => index !== id,
    );
    updatedPossibleAnswers[gapIndex] = updatedOptions;
    if (updatedPossibleAnswers[gapIndex].length === 0) {
      updatedPossibleAnswers = updatedPossibleAnswers.filter(
        (_, index) => index !== gapIndex,
      );
    }
    setPossibleAnswers([...updatedPossibleAnswers]);
  };

  useEffect(() => {
    if (editQuestionID) {
      const questionToEditType = questionToEdit.question_type;
      setQuestionType(questionToEditType);
      setQuestion(questionToEdit.question);
      setId(questionToEdit.id);
      setQuestionImage(questionToEdit?.image || null);
      setPoint(questionToEdit.point);
      if (questionToEditType === "MCQ") {
        setOptions(questionToEdit.options);
        setCorrectAnswer(questionToEdit.correct_answer);
      } else if (questionToEditType === "Cloze") {
        setPossibleAnswers(questionToEdit.possible_answers);
      }
    }
  }, [editQuestionID, questionToEdit]);

  useEffect(() => {
    if (!isOpen) return;

    const fileInput = document.getElementById("fileInput");

    const handleFileChange = async (e) => {
      const uploaded_file = e.target.files[0];
      if (!allowedImageTypes.includes(uploaded_file?.type)) {
        return;
      }
      const file = await compressImage(e.target.files[0]);
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setQuestionImage(reader.result); // Set the uploaded image
        };
        reader.readAsDataURL(file);
      }
    };

    fileInput.addEventListener("change", handleFileChange);

    return () => {
      fileInput.removeEventListener("change", handleFileChange); // Cleanup event listener
    };
  }, [isOpen]);

  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <div
            style={{ textAlign: "center" }}
            className="modal-heading-container"
          >
            <h2>{editQuestionID ? "Edit" : "Create"} Question</h2>
          </div>
          <MdClose
            className="close-modal"
            onClick={() => {
              clearForm();
              onClose();
            }}
          />
          <div className="modal-sub-container overflow">
            <CustomSelectionInput
              name={"questiontype"}
              placeholder={"Question Type"}
              value={questionType}
              options={[
                {
                  value: "MCQ",
                  label: "MCQ",
                },
                {
                  value: "Cloze",
                  label: "Cloze",
                },
                {
                  value: "Theory",
                  label: "Theory",
                },
              ]}
              handleChange={(e) => setQuestionType(e.target.value)}
            />

            <CustomTextAreaInput
              placeholder={"Question"}
              name={"question"}
              value={question}
              handleChange={(e) => setQuestion(e.target.value)}
            />
            <div
              className="image-upload"
              style={{ borderRadius: "3px", width: "125px", height: "125px" }}
            >
              <input
                type="file"
                id="fileInput"
                className="hidden"
                accept="image/*"
              />
              <label htmlFor="fileInput" id="imageBox">
                <span className={questionImage ? "hid-image" : "show-image"}>
                  <PiCameraBold
                    size={65}
                    color="#711a75"
                    className="camera-icon"
                    style={{
                      borderRadius: "3px",
                    }}
                  />
                </span>
                {questionImage && (
                  <img
                    className="show-image"
                    id="uploadedImage"
                    src={questionImage}
                    alt="Uploaded"
                    style={{ borderRadius: "3px" }}
                  />
                )}
              </label>
            </div>
            <p>
              Attach Question image <i>(optional)</i>
            </p>

            {questionType === "MCQ" && (
              <div className="input-question-type-container">
                <p style={{ textAlign: "left", fontWeight: "600" }}>Options:</p>
                {options.map((option, index) => (
                  <div key={index} className="option-input-action">
                    <CustomTextInput
                      placeholder={`Option ${index + 1}`}
                      name={"option"}
                      value={option}
                      handleChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                    />
                    <div
                      className="standalone-action-button"
                      onClick={() => handleRemoveOption(index)}
                    >
                      <PiMinusCircleBold className="use-font-style" />
                    </div>
                  </div>
                ))}
                <CustomSmallButton
                  text={"Add Option"}
                  icon={<PiPlusCircleBold className="use-font-style" />}
                  runFunction={handleAddOption}
                />
                <p style={{ textAlign: "left", fontWeight: "600" }}>
                  Correct Answer:
                </p>

                <CustomSelectionInput
                  name={"correctAnswer"}
                  placeholder={"Correct Answer"}
                  value={correctAnswer}
                  data={options}
                  handleChange={(e) => setCorrectAnswer(e.target.value)}
                />
              </div>
            )}

            {questionType === "Cloze" && (
              <div className="input-question-type-container">
                <p style={{ textAlign: "left", fontWeight: "600" }}>
                  Possible Answers for Each Gap:
                </p>
                {possibleAnswers.map((answers, gapIndex) => (
                  <div key={gapIndex} className="gap-container">
                    {answers.map((answer, answerIndex) => (
                      <div className="option-input-action">
                        <CustomTextInput
                          placeholder={`${numberToOrdinalWord(gapIndex + 1)} gap possible answer ${answerIndex + 1}`}
                          name={"answer"}
                          value={answer}
                          handleChange={(e) =>
                            handlePossibleAnswerChange(
                              gapIndex,
                              answerIndex,
                              e.target.value,
                            )
                          }
                          key={answerIndex}
                        />
                        <div
                          className="standalone-action-button"
                          onClick={() =>
                            handlePossibleAnswer(gapIndex, answerIndex)
                          }
                        >
                          <PiMinusCircleBold className="use-font-style" />
                        </div>
                      </div>
                    ))}
                    <div className="no-width">
                      <CustomSmallButton
                        text={`Add ${numberToOrdinalWord(gapIndex + 1).toLowerCase()} gap possible answer`}
                        icon={<PiPlusCircleBold className="use-font-style" />}
                        runFunction={() => addNewPossibleAnswer(gapIndex)}
                      />
                    </div>
                  </div>
                ))}
                <CustomSmallButton
                  text={"Add New Gap"}
                  icon={<PiPlusCircleBold className="use-font-style" />}
                  runFunction={addNewGap}
                />
              </div>
            )}
            <div className="input-question-type-container">
              <p style={{ textAlign: "left", fontWeight: "600" }}>Marks:</p>
              <CustomTextInput
                placeholder={"Marks"}
                name={"point"}
                value={point}
                handleChange={(e) => setPoint(e.target.value)}
              />
            </div>
          </div>
          <CustomSmallButton
            text={editQuestionID ? "Update Question" : "Add Question"}
            icon={<PiPlusCircleBold className="use-font-style" />}
            runFunction={handleAddQuestion}
          />
        </div>
      </div>
    )
  );
};

export default QuestionModal;
