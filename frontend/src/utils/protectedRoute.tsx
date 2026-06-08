import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.JSX.Element;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");

  // 1. If there is no token, redirect the user to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. If there is a token, render the protected component
  return children;
}
