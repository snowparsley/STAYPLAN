// src/components/seller/SellerSidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiList, FiEdit3, FiBarChart2, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

function SellerSidebar() {
  const { logout } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const location = useLocation();

  const c = {
    bg: isDark ? "#1E1D1A" : "#F8F5EF",
    text: isDark ? "#EDE9E2" : "#4A3F35",
    activeBg: isDark ? "#2D2B28" : "#EFE9E0",
    border: isDark ? "#3F3C38" : "#E5E1D8",
  };

  const menu = [
    { name: "대시보드", icon: <FiHome />, path: "/seller/dashboard" },
    { name: "내 숙소 목록", icon: <FiList />, path: "/seller/listings" },
    { name: "숙소 등록", icon: <FiEdit3 />, path: "/seller/add-listing" },
    { name: "예약 관리", icon: <FiList />, path: "/seller/reservations" },
  ];

  return (
    <div
      style={{
        width: 240,
        background: c.bg,
        height: "100vh",
        borderRight: `1px solid ${c.border}`,
        padding: "28px 18px",
        boxSizing: "border-box",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <h2
        style={{
          fontSize: 22,
          fontWeight: 800,
          marginBottom: 30,
          color: c.text,
        }}
      >
        판매자 메뉴
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {menu.map((m) => (
          <Link
            key={m.path}
            to={m.path}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 14px",
              borderRadius: 10,
              textDecoration: "none",
              color: c.text,
              background:
                location.pathname === m.path ? c.activeBg : "transparent",
              fontWeight: location.pathname === m.path ? 700 : 500,
            }}
          >
            {m.icon}
            {m.name}
          </Link>
        ))}

        <button
          onClick={() => {
            logout();
            window.location.href = "/";
          }}
          style={{
            marginTop: 22,
            padding: "12px 14px",
            borderRadius: 10,
            border: "none",
            background: "#B33A3A",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <FiLogOut />
          로그아웃
        </button>
      </div>
    </div>
  );
}

export default SellerSidebar;
