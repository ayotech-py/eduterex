import React, { useState, useEffect } from "react";
import "./CBTQuestionModal.css";
import CustomTextInput from "../../CustomTextInput/CustomTextInput";
import CBTQuestionUI from "../../CBTQuestionUI/CBTQuestionUI";
import CustomSmallButton from "../../Buttons/CustomSmallButton";
import { AnimatePresence, motion } from "framer-motion";

import {
  PiArrowLeftBold,
  PiArrowRightBold,
  PiCheckCircleBold,
} from "react-icons/pi";
import { MdClose } from "react-icons/md";
import ClozeQuestionUI from "../../CBTQuestionUI/ClozeQuestionUI";

const CBTQuestionModal = ({
  isVisible,
  onClose,
  assignment,
  submitAssignment,
  view,
}) => {
  const [questionIndex, setQuestionIndex] = useState(1);
  const [answers, setAnswers] = useState([]);

  const handleAnswer = (ans) => {
    const isAnswered = answers.find((obj) => obj.questionID === ans.questionID);
    if (isAnswered) {
      const updatedAnswers = answers.filter(
        (obj) => obj.questionID !== ans.questionID,
      );
      setAnswers([...updatedAnswers, ans]);
    } else {
      setAnswers([...answers, ans]);
    }
  };

  const attemptedAnswerIDList = answers?.map((obj) => obj.questionID) || [];
  useEffect(() => {
    setAnswers([]);
    if (view && isVisible) {
      setAnswers(view.cbt_answers);
    } else {
      setAnswers([]);
    }
    setQuestionIndex(1);
  }, [view, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div
        className="modal-content cbt-assignment use-sub-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{ textAlign: "center" }}
          className="modal-heading-container"
        >
          <h2>{assignment?.title} CBT</h2>
          {/* <p style={{ textAlign: "center" }}>
            Note: Creating a new term will close the previous term and set up
            all academic activities for the new one.
          </p> */}
        </div>
        {view && (
          <MdClose
            className="close-modal"
            onClick={() => {
              onClose();
              setAnswers([]);
              setQuestionIndex(1);
            }}
          />
        )}
        <div className="modal-sub-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={questionIndex} // Ensures re-render and triggers animation
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ width: "100%" }}
            >
              {assignment.assignment_type === "Cloze" ? (
                <ClozeQuestionUI
                  questionID={assignment.questions[questionIndex - 1].id}
                  question={assignment.questions[questionIndex - 1].question}
                  options={assignment.questions[questionIndex - 1].options}
                  sn={questionIndex}
                  image={assignment.questions[questionIndex - 1]?.image || null}
                  answer={
                    answers?.find(
                      (obj) =>
                        obj?.questionID ===
                        assignment.questions[questionIndex - 1].id,
                    )?.answer || []
                  }
                  handleAnswer={handleAnswer}
                  disabled={view ? true : false}
                  possibleAnswer={
                    assignment.questions[questionIndex - 1]?.possible_answers
                  }
                />
              ) : (
                <CBTQuestionUI
                  questionID={assignment.questions[questionIndex - 1].id}
                  question={assignment.questions[questionIndex - 1].question}
                  options={assignment.questions[questionIndex - 1].options}
                  sn={questionIndex}
                  image={assignment.questions[questionIndex - 1]?.image || null}
                  answer={
                    answers?.find(
                      (obj) =>
                        obj?.questionID ===
                        assignment.questions[questionIndex - 1].id,
                    )?.answer || []
                  }
                  handleAnswer={handleAnswer}
                  disabled={view ? true : false}
                  correctAnswer={
                    assignment.questions[questionIndex - 1]?.correct_answer
                  }
                />
              )}
            </motion.div>
          </AnimatePresence>
          <div className="cbt-question-checker-container">
            {assignment.questions.map((obj, index) => (
              <div
                onClick={() => setQuestionIndex(index + 1)}
                className={`cbt-question-checker ${attemptedAnswerIDList.includes(obj.id) ? "attempted-question" : "unattempted-question"}`}
              >
                <p>{index + 1}</p>
              </div>
            ))}
          </div>
          <div className="cbt-action-buttons no-width">
            <CustomSmallButton
              text={"Prev"}
              icon={<PiArrowLeftBold className="use-font-style" />}
              disabled={questionIndex === 1}
              runFunction={() => setQuestionIndex((prev) => prev - 1)}
            />
            {!view && (
              <CustomSmallButton
                text={"Submit"}
                icon={<PiCheckCircleBold className="use-font-style" />}
                runFunction={() => submitAssignment(assignment?.id, answers)}
              />
            )}
            <CustomSmallButton
              text={"Next"}
              icon={<PiArrowRightBold className="use-font-style" />}
              disabled={questionIndex === assignment.questions.length}
              runFunction={() => setQuestionIndex((prev) => prev + 1)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CBTQuestionModal;
