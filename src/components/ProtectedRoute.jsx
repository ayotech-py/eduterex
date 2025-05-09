import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles, userRole }) => {
  if (!userRole) {
    console.error("User role is required");
    return <Navigate to="/auth/signin" replace />;
  } else if (!roles.includes(userRole)) {
    return <Navigate to="/not-authorized" replace />;
  }
  return children;
};

export default ProtectedRoute;
