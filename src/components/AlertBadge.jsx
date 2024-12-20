import { FiAlertCircle } from "react-icons/fi";

export const AlertBadge = ({ message }) => {
  return (
    <div className="alert-message">
      <FiAlertCircle className="alert-icon" />
      <p>{message ? message : "Please fill in all fields"}</p>
    </div>
  );
};
