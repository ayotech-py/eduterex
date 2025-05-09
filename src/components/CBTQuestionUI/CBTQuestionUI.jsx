import React from "react";
import "./CBTQuestionUI.css";
import {
  PiCheck,
  PiCheckBold,
  PiCheckFat,
  PiCheckFatBold,
} from "react-icons/pi";
import { CgClose } from "react-icons/cg";

const CBTQuestionUI = ({
  questionID,
  question,
  options,
  sn,
  answer,
  image,
  handleAnswer,
  disabled,
  correctAnswer,
}) => {
  return (
    <div className="cbt-question-ui">
      <div className="cqu-question-div">
        <p>
          Q{sn}. {question}{" "}
          {disabled &&
            (answer === correctAnswer ? (
              <PiCheckBold style={{ color: "#4caf50" }} size={15} />
            ) : (
              <CgClose style={{ color: "red" }} size={15} />
            ))}
        </p>
      </div>
      {image && (
        <img
          src={image}
          alt="question"
          style={{ height: "250px", width: "auto", objectFit: "contain" }}
        />
      )}
      <div className="cqu-options">
        {options?.map((option, index) => (
          <p
            key={index}
            className="radio-item"
            style={{ opacity: disabled ? 0.5 : 1 }}
          >
            <input
              type="radio"
              className="custom-radio"
              name={`option_${sn}_${index}`}
              value={option}
              checked={option === answer}
              onChange={(e) =>
                handleAnswer({ questionID: questionID, answer: e.target.value })
              }
              disabled={disabled}
            />
            {option}
          </p>
        ))}
        {disabled && (
          <p style={{ fontWeight: 500 }}>Correct answer: {correctAnswer}</p>
        )}
      </div>
    </div>
  );
};

export default CBTQuestionUI;
