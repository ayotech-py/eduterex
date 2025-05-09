export const isFormValid = (formData, setAlertMessage) => {
  // Check if formData is empty or null
  if (!formData || Object.keys(formData).length === 0) {
    setAlertMessage("Form data is empty.");
    return false;
  }

  // Check for empty fields
  for (let field in formData) {
    if (field !== "selectedStatus" && field !== "is_active") {
      if (!formData[field] || formData[field].toString().trim() === "") {
        setAlertMessage(
          `The ${field.replace(/_/g, " ")} field cannot be empty.`,
        );
        return false;
      }
    }
  }

  // Email validation
  if (formData.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setAlertMessage("Please enter a valid email address.");
      return false;
    }
  }

  if (formData.contact_phone || formData?.phone || formData?.phone_number) {
    const phoneRegex = /^(\+?\d{10,35})(\s*,\s*\+?\d{10,35})*$/;
    // Allows optional '+' and 10 to 15 digits
    if (
      !phoneRegex.test(
        formData.contact_phone || formData?.phone || formData?.phone_number,
      )
    ) {
      setAlertMessage("Please enter a valid phone number.");
      return false;
    }
  }

  // Password validation
  if (formData.password && formData.confirm_password) {
    if (formData.password.length < 8) {
      setAlertMessage("Password must be at least 8 characters long.");
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

export const isListValid = (formData, setAlertMessage) => {
  for (let field in formData) {
    if (!formData[field] || formData[field].toString().trim() === "") {
      setAlertMessage(
        `The ${field.replaceAll("_", " ")} field cannot be empty.`,
      );
      return false;
    }
  }
};
