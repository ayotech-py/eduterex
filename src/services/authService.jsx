import { apiHelper } from "../utils/apiHelper";

export const loginUser = async (body) => {
  try {
    const response = await apiHelper.post("login/", body);
    return response.data;
  } catch (error) {
    throw error.message || "An error occurred while signing in.";
  }
};

export const logoutUser = async () => {
  try {
    const response = await apiHelper.post("logout/");
    return response.data;
  } catch (error) {
    throw error.message || "An error occurred while login out.";
  }
};

export const fetchData = async () => {
  try {
    const response = await apiHelper.get("fetch-data/");
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred.";
    }
  }
};

export const getOTP = async (body) => {
  try {
    const response = await apiHelper.post("get-otp/", body);
    return response.data;
  } catch (error) {
    throw error.message || "An error occurred while sending OTP.";
  }
};
