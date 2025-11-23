import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiClipboard,
  FiUsers,
  FiFileText,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

function AdminSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const c = {
    bg: isDark ? "#2A2926" : "#faf8ef",
    text: isDark ? "#EFEDE8" : "#4a3f35",
    line: isDark ? "#44413c" : "#e8e4d9",
    hover: isDark ? "#3A3834" : "#f3efe4",
    logoutBg: "#d9534f",
  };

  // ⭐ 공지사항 관리 메뉴 추가됨
  const menuItems = [
    { label: "대시보드", icon: <FiHome />, path: "/admin" },
    { label: "예약 관리", icon: <FiClipboard />, path: "/admin/reservations" },
    { label: "공지사항 관리", icon: <FiFileText />, path: "/admin/notices" },
    { label: "유저 관리", icon: <FiUsers />, path: "/admin/users" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      style={{
        width: 240,
        height: "100vh",
        background: c.bg,
        borderRight: `1px solid ${c.line}`,
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "0.3s ease",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: c.text,
            marginBottom: 40,
            letterSpacing: "-0.5px",
            transition: "0.3s",
          }}
        >
          Admin Panel
        </h2>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                background: "none",
                border: `1px solid ${c.line}`,
                borderRadius: 10,
                cursor: "pointer",
                color: c.text,
                fontWeight: 600,
                transition: "0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = c.hover)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        style={{
          marginTop: 30,
          padding: "12px 16px",
          background: c.logoutBg,
          border: "none",
          borderRadius: 10,
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <FiLogOut size={18} /> 로그아웃
      </button>
    </div>
  );
}

export default AdminSidebar;
