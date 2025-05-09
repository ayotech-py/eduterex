import React, { useState } from "react";
import "./CBTQuestionUI.css";
import { replace } from "react-router-dom";
import CustomTextInput from "../CustomTextInput/CustomTextInput";
import { numberToOrdinalWord } from "../../utils/Utils";
import { PiCheckBold } from "react-icons/pi";
import { CgClose } from "react-icons/cg";

const ClozeQuestionUI = ({
  questionID,
  question,
  options,
  sn,
  answer,
  image,
  handleAnswer,
  disabled,
  possibleAnswer,
}) => {
  const [inputAnswers, setInputAnswers] = useState([]);

  useState(() => {
    setInputAnswers([...answer] || [...question.match(/(_+_)/g)]);
  }, [question]);

  const replaceBlanks = (word) => {
    const parts = word.split(/(_+)/);
    let inputIndex = 0; // Counter to track the number of blank inputs

    return parts.map((part, index) => {
      if (/_+/.test(part)) {
        const currentIndex = inputIndex; // Capture the current input index
        inputIndex += 1; // Increment for the next blank

        return (
          <CustomTextInput
            key={index} // Unique key for React
            name={"input" + currentIndex} // Name based on input order
            value={inputAnswers[currentIndex]}
            disabled={disabled}
            handleChange={(e) => handleInput(currentIndex, e.target.value)} // Sequential index
          />
        );
      } else {
        return part
          .split(" ")
          .map((p, i) => <p key={index + "-" + i}>{p + ""}</p>);
      }
    });
  };

  const handleInput = (index, input) => {
    let updatedAnswer = inputAnswers;
    updatedAnswer[index] = input;
    setInputAnswers([...updatedAnswer]);
    handleAnswer({ questionID: questionID, answer: updatedAnswer });
  };

  const markSolution = () => {
    let scores_array = [];
    if (!answer.length > 0) {
      return <CgClose style={{ color: "red" }} size={15} />;
    }
    answer?.forEach((obj, index) => {
      const new_answer = possibleAnswer[index].map((obj) => obj.toLowerCase());
      if (new_answer.includes(obj.toLowerCase())) {
        scores_array.push(1);
      } else {
        scores_array.push(0);
      }
    });
    if (!scores_array.includes(0)) {
      return <PiCheckBold style={{ color: "#4caf50" }} size={15} />;
    } else {
      return <CgClose style={{ color: "red" }} size={15} />;
    }
  };

  return (
    <div className="cbt-question-ui">
      <div className="cqu-question-div">
        <div className="cloze-question-div">
          <p>Q{sn}.</p>
          {replaceBlanks(question).map((part) => part)}
          {disabled && markSolution()}
        </div>
      </div>
      {image && (
        <img
          src={image}
          alt="question"
          style={{ height: "250px", width: "auto", objectFit: "contain" }}
        />
      )}
      <div className="cqu-options">
        {disabled && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {possibleAnswer.map((obj, index) => (
              <p key={index}>
                {numberToOrdinalWord(index + 1)} blank possible answer(s):{" "}
                <span style={{ fontWeight: 500 }}>{obj.join(", ")}</span>
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClozeQuestionUI;
