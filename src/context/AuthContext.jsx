// context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from "react";
import { getToken, removeToken, setToken } from "../utils/tokenHelper";
import { getUser, removeUser, setUser } from "../utils/userHelper";
import { removeSchoolData } from "../utils/schoolHelper";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    class_subject_permission: null,
    accessToken: null,
    refreshToken: null,
    loading: true,
  });

  useEffect(() => {
    const loadUserData = () => {
      setAuthState({ ...authState, loading: true });
      try {
        const token = getToken();
        if (token) {
          setAuthState({
            ...authState,
            isAuthenticated: true,
            accessToken: token,
            loading: false,
          });
        } else {
          setAuthState({ ...authState, loading: false });
        }
      } catch (error) {
        setAuthState({ ...authState, loading: false });
        if (window.location.href.includes("school-not-found")) return;
        window.location.replace("/auth/signin");
      }
    };
    loadUserData();
  }, []);

  const login = (userData, tokens) => {
    setAuthState({
      ...authState,
      isAuthenticated: true,
      user: userData,
      ...tokens,
    });
    setToken(tokens.accessToken); // Save the access token
    //setUser(userData);
  };

  const updateUser = (userData) => {
    setAuthState({
      ...authState,
      user: userData,
      class_subject_permission: userData.class_subject_permission,
    });
    //setUser(userData);
  };

  const logout = () => {
    setAuthState({ ...authState, isAuthenticated: false, user: null });
    removeToken(); // Remove the access token
    removeUser();
    removeSchoolData();
    window.location.replace("/auth/signin");
  };

  const hasAccess = (feature_id) => {
    const user_school_features =
      authState.user?.school.subscription?.features || [];
    return !user_school_features.includes(feature_id);
  };

  const getMaxMembers = () => {
    return authState.user?.school.subscription?.members;
  };

  return (
    <AuthContext.Provider
      value={{ authState, updateUser, login, logout, hasAccess, getMaxMembers }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
