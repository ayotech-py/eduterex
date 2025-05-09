import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [subject, setSubject] = useState([]);
  const [classes, setClasses] = useState([]);
  const [token, setToken] = useState("");
  const [schoolStaffList, setSchoolStaffList] = useState([]);
  const [schoolSession, setSchoolSession] = useState([]);
  const [schoolStudents, setSchoolStudents] = useState([]);

  const updateUser = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  useEffect(() => {
    const loadUserData = () => {
      try {
        const access_token = localStorage.getItem("accessToken");
        const userData = localStorage.getItem("user");
        const school_config = localStorage.getItem("schoolConfig");

        const parsed_data = JSON.parse(school_config);
        setUser(JSON.parse(userData));
        setToken(access_token);
        setSubject(parsed_data.subjects);
        setClasses(parsed_data.classes);
        setSchoolSession(parsed_data.session);
        setSchoolStaffList(parsed_data.staffs);
        setSchoolStudents(parsed_data.students);
      } catch (error) {
        console.error("Unable to fetch data");
      }
    };

    loadUserData();
  }, []);

  // Simulate login
  const login = (userData, tokens, school_config) => {
    localStorage.setItem("accessToken", tokens.access);
    localStorage.setItem("refreshToken", tokens.refresh);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("schoolConfig", JSON.stringify(school_config));
    setUser(userData);
    setToken(tokens.access);
    setSubject(school_config.subjects);
    setClasses(school_config.classes);
    setSchoolSession(school_config.session);
    setSchoolStaffList(school_config.staffs);
    setSchoolStudents(school_config.students);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("user");
    localStorage.clear();
    setUser(null);
    setSubject([]);
  };

  const updateSchoolConfig = (school_config) => {
    localStorage.setItem("schoolConfig", JSON.stringify(school_config));
    setSubject(school_config.subjects);
    setClasses(school_config.classes);
    setSchoolStaffList(school_config.staffs);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        subject,
        classes,
        token,
        schoolSession,
        schoolStaffList,
        schoolStudents,
        updateUser,
        login,
        logout,
        updateSchoolConfig,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
