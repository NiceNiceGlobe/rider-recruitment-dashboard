import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const isAdmin = user?.roles?.includes("Admin");

  return isAdmin ? children : <Navigate to="/login" replace />;
}