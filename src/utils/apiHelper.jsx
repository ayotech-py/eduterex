import axios from "axios";
import { getToken } from "./tokenHelper"; // Correctly import getToken from the tokenHelper file

//const API_URL = process.env.REACT_APP_BASE_URL;
const API_URL = "https://eduterexbackend-production.up.railway.app/api";
const API_KEY = process.env.REACT_APP_API_KEY;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    ApiAuthorization: API_KEY,
  },
});

// Add token to request headers dynamically
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Set Content-Type dynamically
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle API response errors
api.interceptors.response.use(
  (response) => response, // Pass successful responses as is
  (error) => {
    if (error.response) {
      // Backend returned an error response
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // No response was received
      return Promise.reject({
        message: "No response from server. Please try again.",
      });
    } else {
      // Request setup issue
      return Promise.reject({ message: "Request error. Please try again." });
    }
  },
);

export const apiHelper = {
  post: (url, data) => api.post(url, data),
  get: (url) => api.get(url),
  put: (url, data) => api.put(url, data),
  delete: (url) => api.delete(url),
};
