import React, { useState, useEffect } from "react";
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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [open, setOpen] = useState(false);

  // 반응형 감지
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setOpen(true); // PC는 항상 열림
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const c = {
    bg: isDark ? "#2A2926" : "#faf8ef",
    text: isDark ? "#EFEDE8" : "#4a3f35",
    line: isDark ? "#44413c" : "#e8e4d9",
    hover: isDark ? "#3A3834" : "#f3efe4",
    logoutBg: "#d9534f",
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
    <>
      {/* 👉 모바일 배경 오버레이 */}
      {isMobile && open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.45)",
            zIndex: 9,
          }}
        />
      )}

      {/* 👉 사이드바 */}
      <div
        style={{
          width: open ? 240 : isMobile ? 0 : 240,
          height: "100vh",
          background: c.bg,
          borderRight: `1px solid ${c.line}`,
          padding: open ? "24px 16px" : "24px 0px",
          overflowX: "hidden",
          position: isMobile ? "fixed" : "relative",
          left: 0,
          top: 0,
          zIndex: 10,
          transition: "0.3s ease",
        }}
      >
        <div>
          {/* 모바일에서 제목 숨김 */}
          {open && (
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: c.text,
                marginBottom: 40,
                letterSpacing: "-0.5px",
              }}
            >
              Admin Panel
            </h2>
          )}

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
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setOpen(false); // 모바일에서는 자동 닫힘
                }}
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
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = c.hover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {item.icon}
                {open && item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* 로그아웃 버튼 */}
        {open && (
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
        )}
      </div>
    </>
  );
}

export default AdminSidebar;
