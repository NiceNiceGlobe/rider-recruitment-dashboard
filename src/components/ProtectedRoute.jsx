import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user");
  const isLoggedIn = !!user;

  return isLoggedIn ? children : <Navigate to="/login" replace />;
}