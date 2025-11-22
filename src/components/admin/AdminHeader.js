import React from "react";
import { FiUser, FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";
import { useLocation } from "react-router-dom";

function AdminHeader() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // 페이지 타이틀 자동 설정
  const getPageTitle = () => {
    if (location.pathname.includes("reservations")) return "예약 관리";
    if (location.pathname.includes("listings")) return "숙소 관리";
    if (location.pathname.includes("users")) return "유저 관리";
    return "관리자 대시보드";
  };

  const c = {
    bg: theme === "dark" ? "#2A2926" : "#ffffff",
    text: theme === "dark" ? "#EFEDE8" : "#4a3f35",
    line: theme === "dark" ? "#44413c" : "#e5e1d8",
  };

  return (
    <header
      style={{
        width: "100%",
        padding: "20px 32px",
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
      {/* Page Title */}
      <h1 style={{ fontSize: 26, fontWeight: 800, color: c.text }}>
        {getPageTitle()}
      </h1>

      {/* Right Tools */}
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        {/* 다크모드 토글 */}
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
        {/* 관리자 아이콘 */}
        admin
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "#d7ccc5",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#4a3f35",
            fontSize: 20,
          }}
        >
          <FiUser />
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
