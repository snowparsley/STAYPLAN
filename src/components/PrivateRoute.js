import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/*
  Usage:

  <PrivateRoute adminOnly>
      <AdminDashboard />
  </PrivateRoute>
  
  <PrivateRoute>
      <ProfilePage />
  </PrivateRoute>
*/

function PrivateRoute({ children, adminOnly = false }) {
  const { isLoggedIn, user } = useAuth();

  // 1) 로그인하지 않은 경우
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 2) 관리자 전용 페이지인데 일반 유저가 접근한 경우
  if (adminOnly && !user?.admin) {
    return <Navigate to="/" replace />;
  }

  // 3) 접근 허용
  return children;
}

export default PrivateRoute;
