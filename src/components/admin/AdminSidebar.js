// src/components/admin/AdminSidebar.js
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

function AdminSidebar({ open, setOpen, isMobile }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const c = {
    bg: isDark ? "#1F1E1C" : "#F6F3EB",
    card: isDark ? "#2A2926" : "#FFFFFF",
    text: isDark ? "#EDEAE3" : "#4A3F35",
    border: isDark ? "#3D3A36" : "#E5E0D7",
    hover: isDark ? "#34322D" : "#F3EFE8",
  };

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
        width: isMobile ? "100%" : 240,
        background: c.bg,
        borderRight: isMobile ? "none" : `1px solid ${c.border}`,
        borderBottom: isMobile ? `1px solid ${c.border}` : "none",
        position: isMobile ? "relative" : "sticky",
        top: 0,
        zIndex: 8,
        overflow: "hidden",
        height: isMobile ? "auto" : "100%",
        maxHeight: isMobile ? (open ? "1000px" : "0px") : "100%",
        transition: isMobile ? "max-height 0.35s ease" : "none",
      }}
    >
      {/* 제목 (PC에서만 표시) */}
      {!isMobile && (
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            padding: "24px 20px",
            color: c.text,
            margin: 0,
          }}
        >
          관리자 메뉴
        </h2>
      )}

      {/* 메뉴 목록 */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          padding: isMobile ? "10px 14px 16px" : "0 16px",
          gap: 10,
        }}
      >
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setOpen(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: c.card,
              color: c.text,
              padding: "12px 14px",
              borderRadius: 12,
              border: `1px solid ${c.border}`,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = c.hover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = c.card)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {/* 로그아웃 */}
      <div style={{ padding: isMobile ? "0 14px 14px" : "6px 16px 24px" }}>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "12px 14px",
            background: "#C94141",
            borderRadius: 12,
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
          }}
        >
          <FiLogOut style={{ marginRight: 6 }} />
          로그아웃
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;
