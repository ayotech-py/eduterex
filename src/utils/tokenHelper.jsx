export const getToken = () => {
  // Logic to get token from localStorage or cookies
  return localStorage.getItem("access_token");
};

export const setToken = (token) => {
  // Logic to set token in localStorage or cookies
  localStorage.setItem("access_token", token);
};

export const removeToken = () => {
  // Logic to remove token from localStorage or cookies
  localStorage.removeItem("access_token");
};
