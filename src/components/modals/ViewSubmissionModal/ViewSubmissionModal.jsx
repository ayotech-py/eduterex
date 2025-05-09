import React, { useState, useEffect } from "react";
import "../CBTQuestionModal/CBTQuestionModal.css";
import "./ViewSubmissionModal.css";
import CustomTextInput from "../../CustomTextInput/CustomTextInput";
import CBTQuestionUI from "../../CBTQuestionUI/CBTQuestionUI";
import CustomSmallButton from "../../Buttons/CustomSmallButton";
import { AnimatePresence, motion } from "framer-motion";

import { MdClose } from "react-icons/md";
import ClozeQuestionUI from "../../CBTQuestionUI/ClozeQuestionUI";

const ViewSubmissionModal = ({
  isVisible,
  onClose,
  assignment,
  view,
  student,
}) => {
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    setAnswers([]);
    if (view) {
      setAnswers(view.cbt_answers);
    } else {
      setAnswers([]);
    }
  }, [view]);

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div
        className="modal-content cbt-assignment"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{ textAlign: "center" }}
          className="modal-heading-container"
        >
          <h2>
            {student.last_name} {student.first_name}
          </h2>
          {/* <p style={{ textAlign: "center" }}>
            Note: Creating a new term will close the previous term and set up
            all academic activities for the new one.
          </p> */}
        </div>
        <MdClose
          className="close-modal"
          onClick={() => {
            onClose();
            setAnswers([]);
          }}
        />
        <div className="modal-sub-container overflow">
          {assignment.assignment_type === "Cloze"
            ? assignment.questions.map((question, index) => (
                <ClozeQuestionUI
                  key={index}
                  questionID={question.id}
                  question={question.question}
                  options={question.options}
                  sn={index + 1}
                  image={question?.image || null}
                  answer={
                    answers?.find((obj) => obj?.questionID === question.id)
                      ?.answer || []
                  }
                  handleAnswer={() => console.log("")}
                  disabled={view ? true : false}
                  possibleAnswer={question?.possible_answers}
                />
              ))
            : assignment.questions.map((question, index) => (
                <CBTQuestionUI
                  key={index}
                  questionID={question.id}
                  question={question.question}
                  options={question.options}
                  sn={index + 1}
                  image={question?.image || null}
                  answer={
                    view?.cbt_answers.find(
                      (obj) => obj.questionID === question.id,
                    )?.answer || []
                  }
                  handleAnswer={() => console.log("")}
                  disabled={view ? true : false}
                  correctAnswer={question?.correct_answer}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default ViewSubmissionModal;
