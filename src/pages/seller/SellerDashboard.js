// src/pages/seller/SellerDashboard.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function SellerDashboard() {
  const { user } = useAuth();

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>판매자 대시보드</h1>

      <p style={{ marginTop: "10px", fontSize: "18px" }}>
        환영합니다, {user?.name} 님!
      </p>

      <div style={{ marginTop: "30px" }}>
        <Link to="/seller/listings" style={button}>
          내 숙소 관리하기
        </Link>

        <Link to="/seller/add-listing" style={button}>
          새 숙소 등록하기
        </Link>
      </div>
    </div>
  );
}

const button = {
  display: "inline-block",
  marginRight: "15px",
  marginTop: "10px",
  padding: "12px 20px",
  background: "#4F46E5",
  color: "#fff",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "bold",
};

export default SellerDashboard;
