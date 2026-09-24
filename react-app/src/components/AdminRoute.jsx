import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/** Like ProtectedRoute, but also requires user.role === "admin".
 *  A logged-in student hitting an admin route is sent to their
 *  own dashboard rather than back to /login. */
export default function AdminRoute({ children }) {
  const { isLoggedIn, user } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}
