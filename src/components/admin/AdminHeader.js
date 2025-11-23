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

  // 🎨 라이트모드 → 홈 화면과 같은 베이지 톤 적용
  const c = {
    bg: theme === "dark" ? "#2A2926" : "#F6F3E7", // 베이지 톤
    text: theme === "dark" ? "#EFEDE8" : "#4a3f35",
    line: theme === "dark" ? "#44413c" : "#E3DDD2", // 부드러운 베이지 라인
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
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "#D9D2C8", // 아이콘 배경도 베이지 톤 맞춤
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#4a3f35",
            fontSize: 20,
          }}
        >
          <FiUser />
        </div>

        {/* 관리자 텍스트 */}
        <p style={{ fontWeight: 800, color: c.text, fontSize: 16 }}>관리자</p>
      </div>
    </header>
  );
}

export default AdminHeader;
