import React, { useEffect, useState } from "react";
import "./SubjectDropdown.css";
import { FiChevronDown, FiChevronRight, FiChevronsRight } from "react-icons/fi";

const subjectsData = {
  Nursery: [
    "Mathematics",
    "English Language",
    "Rhymes",
    "Phonics",
    "Elementary Science",
    "Computer Science & Practical",
    "Health Education",
    "Creative & Cultural Art",
    "Agricultural Science",
    "Computer Science",
    "Basic Science & Technology",
    "Social Habit",
    "Civic & Security Education",
    "C.R.S",
    "I.R.S",
    "Social Studies",
    "Home Economics",
    "Handwriting",
    "French Language",
    "P.H.E",
    "Current Affairs",
  ],
  Primary: [
    "Mathematics",
    "English Language",
    "Phonics",
    "Computer Science & Practical",
    "Creative & Cultural Art",
    "Agricultural Science",
    "Basic Science & Technology",
    "Quantitative Reasoning",
    "Civic & Security Education",
    "Verbal Reasoning",
    "C.R.S",
    "I.R.S",
    "Social Studies",
    "Pre-vocational",
    "Home Economics",
    "Security Education",
    "Handwriting",
    "Arabic Language",
    "Hausa Language",
    "French Language",
    "P.H.E",
    "Current Affairs",
  ],
  JSS: [
    "Mathematics",
    "English Language",
    "P.H.E",
    "Computer Science & Practical",
    "Creative & Cultural Art",
    "Basic Science",
    "Basic Technology",
    "Civic & Security Education",
    "Pre-vocational",
    "C.R.S",
    "I.R.S",
    "Social Studies",
    "Business Studies",
    "Arabic Language",
    "Hausa Language",
    "French Language",
    "Current Affairs",
  ],
  SSS: [
    "Mathematics",
    "English Language",
    "Literature in English",
    "Biology",
    "Chemistry",
    "Physics",
    "Geography",
    "Civic Education",
    "Animal Husbandry",
    "Economics",
    "French Language",
    "Government",
    "Commerce",
    "Pre-Vocational Studies",
    "Accounting",
    "Current Affairs",
    "Further Mathematics",
    "Computer Science & Practical",
    "C.R.S",
    "I.R.S",
    "Arabic Language",
    "Hausa Language",
  ],
};

const SubjectDropdown = ({ handleSubject }) => {
  const [selectedSubjects, setSelectedSubjects] = useState({
    Nursery: [],
    Primary: [],
    JSS: [],
    SSS: [],
  });

  const [isOpen, setIsOpen] = useState({
    Nursery: false,
    Primary: false,
    JSS: false,
    SSS: false,
  });

  const toggleDropdown = (level) => {
    setIsOpen((prev) => ({
      [level]: !prev[level],
    }));
  };

  const handleCheckboxChange = (level, subject) => {
    setSelectedSubjects((prev) => {
      const updatedSubjects = prev[level].includes(subject)
        ? prev[level].filter((item) => item !== subject)
        : [...prev[level], subject];
      const newState = { ...prev, [level]: updatedSubjects };

      handleSubject(newState);

      return newState;
    });
  };

  return (
    <div className="dropdown-container">
      {Object.keys(subjectsData).map((level) => (
        <div key={level} className="dropdown">
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
              {subjectsData[level].map((subject) => (
                <label key={subject} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedSubjects[level].includes(subject)}
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
  );
};

export default SubjectDropdown;
