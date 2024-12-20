export const isFormValid = (formData, setAlertMessage) => {
  for (let field in formData) {
    if (!formData[field] || formData[field].trim() === "") {
      setAlertMessage(`The ${field.replace("_", " ")} field cannot be empty.`);
      return false;
    }
  }

  // Check for specific validations based on field names
  if (formData.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setAlertMessage("Please enter a valid email address.");
      return false;
    }
  }

  if (formData.password && formData.confirm_password) {
    if (formData.password.length <= 8) {
      setAlertMessage("Password must be greater than 8 characters.");
      return false;
    }
    if (formData.password !== formData.confirm_password) {
      setAlertMessage("Password and confirm password do not match.");
      return false;
    }
  }

  // If all validations pass
  return true;
};
