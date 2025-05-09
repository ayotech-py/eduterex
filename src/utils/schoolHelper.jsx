export const getSchoolData = () => {
  try {
    const storedSchoolData = localStorage.getItem("schoolData");
    return JSON.parse(storedSchoolData) || null;
  } catch (error) {
    return null;
  }
};

export const setSchoolData = (user) => {
  localStorage.setItem("schoolData", JSON.stringify(user));
};

export const removeSchoolData = () => {
  localStorage.removeItem("schoolData");
};
