import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/*
  Usage:

  <PrivateRoute adminOnly>
      <AdminDashboard />
  </PrivateRoute>

  <PrivateRoute sellerOnly>
      <SellerDashboard />
  </PrivateRoute>

  <PrivateRoute>
      <ProfilePage />
  </PrivateRoute>
*/

function PrivateRoute({ children, adminOnly = false, sellerOnly = false }) {
  const { isLoggedIn, user } = useAuth();

  // ⭐ 로그인하지 않은 경우
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // ⭐ 관리자 전용 페이지
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ⭐ 판매자 전용 페이지
  if (sellerOnly && user?.role !== "seller") {
    return <Navigate to="/" replace />;
  }

  // ⭐ 접근 허용
  return children;
}

export default PrivateRoute;
