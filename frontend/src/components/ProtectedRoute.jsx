import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const isTokenValid = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  if (!token || !isTokenValid(token)) {
    // Clean up stale tokens
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;