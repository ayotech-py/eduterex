import React, { useState } from "react";
import "./SubjectDropdown.css";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

const SubjectDropdown = ({ handleSubject, classList, subjectsList }) => {
  // Update the initialization of selectedSubjects to work with the updated classList structure
  const [selectedSubjects, setSelectedSubjects] = useState(
    classList.reduce((acc, { className }) => ({ ...acc, [className]: [] }), {}),
  );

  const [previousLevel, setPreviousLevel] = useState(null);

  const [isOpen, setIsOpen] = useState(
    classList.reduce(
      (acc, { className }) => ({ ...acc, [className]: false }),
      {},
    ),
  );

  const toggleDropdown = (level) => {
    setIsOpen((prev) => ({
      ...prev,
      [level]: !prev[level],
    }));

    const previousLevel = getPreviousElement(classList, level);
    setPreviousLevel(previousLevel);

    const previousLevelSubjects = selectedSubjects[previousLevel];
    const levelSubjects = selectedSubjects[level];

    const isEmptyArray = levelSubjects.length > 0 ? false : true;

    if (previousLevelSubjects && isEmptyArray) {
      setSelectedSubjects((prev) => {
        const newState = { ...prev, [level]: previousLevelSubjects };

        handleSubject?.(newState);

        return newState;
      });
    }
  };

  function getPreviousElement(list, currentElement) {
    const index = list.findIndex(
      ({ className }) => className === currentElement,
    );
    if (index > 0) {
      return list[index - 1]?.className; // Return the previous className
    }
    return null;
  }

  const handleCheckboxChange = (level, subject) => {
    setSelectedSubjects((prev) => {
      const updatedSubjects = prev[level].includes(subject)
        ? prev[level].filter((item) => item !== subject)
        : [...prev[level], subject];
      const newState = { ...prev, [level]: updatedSubjects };

      handleSubject?.(newState);

      return newState;
    });
  };

  // Update the classList filtering logic
  const oddClassList = classList
    .filter((_, index) => index % 2 !== 0)
    .map(({ className }) => className);
  const evenClassList = classList
    .filter((_, index) => index % 2 === 0)
    .map(({ className }) => className);

  return (
    <div className="dropdown-container">
      <div className="dropdown-flex">
        {evenClassList.map((level) => (
          <div
            key={level}
            className={`dropdown ${isOpen[level] ? "maintain-height" : "overflow-height"}`}
          >
            <div className="dropdown-btn" onClick={() => toggleDropdown(level)}>
              {isOpen[level] ? (
                <FiChevronDown className="dropdown-icon" />
              ) : (
                <FiChevronRight className="dropdown-icon" />
              )}
              <button>{level} Subjects</button>
            </div>
            {isOpen[level] && (
              <div className="dropdown-menu overflow">
                {subjectsList.map((subject) => (
                  <label key={subject} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedSubjects[level]?.includes(subject)}
                      onChange={() => handleCheckboxChange(level, subject)}
                    />
                    {subject}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="dropdown-flex">
        {oddClassList.map((level) => (
          <div
            key={level}
            className={`dropdown ${isOpen[level] ? "maintain-height" : "overflow-height"}`}
          >
            <div className="dropdown-btn" onClick={() => toggleDropdown(level)}>
              {isOpen[level] ? (
                <FiChevronDown className="dropdown-icon" />
              ) : (
                <FiChevronRight className="dropdown-icon" />
              )}
              <button>{level} Subjects</button>
            </div>
            {isOpen[level] && (
              <div className="dropdown-menu overflow">
                {subjectsList.map((subject) => (
                  <label key={subject} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedSubjects[level]?.includes(subject)}
                      onChange={() => handleCheckboxChange(level, subject)}
                    />
                    {subject}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectDropdown;
