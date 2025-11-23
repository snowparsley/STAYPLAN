// src/components/admin/AdminHeader.js
import React from "react";
import { FiUser, FiSun, FiMoon, FiMenu } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function AdminHeader({ onMenuToggle }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname.includes("reservations")) return "예약 관리";
    if (location.pathname.includes("listings")) return "숙소 관리";
    if (location.pathname.includes("users")) return "유저 관리";
    if (location.pathname.includes("notices")) return "공지사항";
    return "관리자 대시보드";
  };

  const c = {
    bg: theme === "dark" ? "#2A2926" : "#F6F3E7",
    text: theme === "dark" ? "#EFEDE8" : "#4a3f35",
    line: theme === "dark" ? "#44413c" : "#E3DDD2",
  };

  return (
    <header
      style={{
        width: "100%",
        padding: "16px 22px",
        background: c.bg,
        borderBottom: `1px solid ${c.line}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* 👉 모바일 메뉴 버튼 */}
      <button
        onClick={onMenuToggle}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: c.text,
          fontSize: 26,
          marginRight: 12,
          display: "flex",
        }}
        className="mobile-only"
      >
        <FiMenu />
      </button>

      <h1 style={{ fontSize: 24, fontWeight: 800, color: c.text }}>
        {getPageTitle()}
      </h1>

      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <button
          onClick={toggleTheme}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: c.text,
            fontSize: 22,
          }}
        >
          {theme === "dark" ? <FiSun /> : <FiMoon />}
        </button>

        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#D9D2C8",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#4a3f35",
            fontSize: 18,
          }}
        >
          <FiUser />
        </div>

        <p style={{ fontWeight: 800, color: c.text, fontSize: 15 }}>
          {user?.name || "관리자"}
        </p>
      </div>
    </header>
  );
}

export default AdminHeader;
