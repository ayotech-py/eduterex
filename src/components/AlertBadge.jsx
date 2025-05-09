import { BsExclamationCircleFill } from "react-icons/bs";
import { FiAlertCircle } from "react-icons/fi";

export const AlertBadge = ({ message, success, icon = true }) => {
  return (
    <div
      className="alert-message"
      style={{
        color: success ? "#4caf50" : "#f44336",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <p style={{ textAlign: "center" }}>
        {message ? message : "Please fill in all fields"}
      </p>
    </div>
  );
};
