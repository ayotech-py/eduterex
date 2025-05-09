import React, { createContext, useContext, useState, useEffect } from "react";
import { getToken } from "../utils/tokenHelper";
import {
  getSchoolData,
  setSchoolData,
  removeSchoolData,
} from "../utils/schoolHelper";
import { useAuth } from "./AuthContext";
import { fetchData } from "../services/authService";

export const SchoolContext = createContext();

export const SchoolProvider = ({ children }) => {
  const [schoolState, setSchoolState] = useState({
    classes: [],
    schoolStaffList: [],
    schoolSession: [],
    schoolStudents: [],
    subjects: [],
    schoolResult: [],
    schoolTuition: [],
    student: {},
    studentClass: {},
    schoolLessonPlan: [],
    schoolQuestionBank: [],
    schoolAssignments: [],
    schoolAssignmentSubmissions: [],
  });

  const [inLatestSession, setInLatestSession] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [termId, setTermId] = useState(null);
  const { authState, logout, updateUser } = useAuth();

  const { user } = authState;

  useEffect(() => {
    const token = getToken();
    if (token) {
      checkForLatestSession();
    }
  }, [schoolState]);

  const adminRoles = ["Admin", "Principal", "Account Manager"];

  useEffect(() => {
    const session = schoolState.schoolSession?.find(
      (obj) => obj?.is_active === true,
    );
    setSessionId(session?.id || null);
    const term = adminRoles.includes(user?.role)
      ? session?.terms?.find((obj) => obj?.is_active === true)
      : session?.terms?.find((obj) => obj?.is_open === true);
    setTermId(term?.id || null);
  }, [schoolState.schoolSession]);

  const checkForLatestSession = () => {
    if (schoolState) {
      const { schoolSession } = schoolState;
      const activeSession = schoolSession.find(
        (session) => session.is_active === true,
      );
      const activeTerm = activeSession?.terms?.find(
        (term) => term?.is_active === true,
      );

      const latestSession = schoolSession[schoolSession.length - 1];

      if (
        activeSession?.id === latestSession?.id &&
        activeTerm?.is_open === true
      ) {
        setInLatestSession(true);
      } else {
        setInLatestSession(false);
      }
    }
  };

  const setSchoolDatas = (schoolDatas) => {
    setSchoolState({
      ...schoolState,
      ...schoolDatas,
    });
    /* setSchoolData({
      ...schoolState,
      ...schoolDatas,
    }); */
    checkForLatestSession();
  };

  const updateSchoolState = (data) => {
    setSchoolState((prevState) => {
      const updatedState = { ...prevState };

      for (const key in data) {
        if (Array.isArray(data[key])) {
          updatedState[key] = [...prevState[key], ...data[key]];
        } else if (typeof data[key] === "object" && data[key] !== null) {
          updatedState[key] = { ...prevState[key], ...data[key] };
        } else {
          updatedState[key] = data[key];
        }
      }

      return updatedState;
    });
  };

  const updateSchoolStateById = (data) => {
    setSchoolState((prevState) => {
      const updatedState = { ...prevState };

      for (const key in data) {
        const incomingValue = data[key];

        if (Array.isArray(incomingValue)) {
          // Check if key is 'schoolResult' and handle it differently
          if (key === "schoolResult" || key === "schoolTuition") {
            const existingList = prevState[key] || [];

            // Filter out the existing school results for the same student and academic_term
            const filteredList = existingList.filter(
              (item) =>
                !incomingValue.some(
                  (newItem) =>
                    newItem.student === item.student &&
                    newItem.academic_term.id === item.academic_term.id,
                ),
            );

            // Now append the incoming school results
            updatedState[key] = [...filteredList, ...incomingValue];
          } else {
            // Update or add other lists by ID
            const existingList = prevState[key] || [];
            const updatedList = [...existingList];

            incomingValue.forEach((newItem) => {
              const index = existingList.findIndex(
                (item) => item.id === newItem.id,
              );

              if (index !== -1) {
                // Replace the item if ID exists
                updatedList[index] = newItem;
              } else {
                // Add new item if ID doesn't exist
                updatedList.push(newItem);
              }
            });

            updatedState[key] = updatedList;
          }
        } else if (
          typeof incomingValue === "object" &&
          incomingValue !== null
        ) {
          // For objects like `student`, `studentClass`
          updatedState[key] = { ...prevState[key], ...incomingValue };
        } else {
          updatedState[key] = incomingValue;
        }
      }

      return updatedState;
    });
  };

  const reloadData = async (setLoading = null) => {
    if (setLoading) {
      setLoading(true);
    }
    try {
      const response = await fetchData();
      if (setLoading) {
        setLoading(false);
      }
      if (response.success) {
        updateUser(response.user);
        setSchoolDatas(response.schoolData);
        checkForLatestSession();
      }
    } catch (error) {
      if (setLoading) {
        setLoading(false);
      }
      logout();
    }
  };

  return (
    <SchoolContext.Provider
      value={{
        schoolState,
        setSchoolDatas,
        inLatestSession,
        sessionId,
        termId,
        reloadData,
        updateSchoolState,
        updateSchoolStateById,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

// Custom hook for easier use
export const useSchool = () => useContext(SchoolContext);
