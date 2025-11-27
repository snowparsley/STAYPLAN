import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function PrivateRoute({ children, adminOnly = false, sellerOnly = false }) {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  if (sellerOnly && user.role !== "seller" && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;
