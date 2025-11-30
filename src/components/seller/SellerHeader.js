// src/components/seller/SellerHeader.js
import React, { useState } from "react";
import { FiSun, FiMoon, FiUser, FiMenu } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";

function SellerHeader({ onOpenSidebar }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === "dark";
  const [open, setOpen] = useState(false);

  const c = {
    bg: isDark ? "#262522" : "#FFFFFF",
    text: isDark ? "#EDE9E2" : "#4A3F35",
    sub: isDark ? "#CFCAC0" : "#8A817A",
    border: isDark ? "#3F3C38" : "#E5E1D8",
  };

  return (
    <header
      style={{
        width: "100%",
        height: 64,
        background: c.bg,
        borderBottom: `1px solid ${c.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
        boxSizing: "border-box",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* 🟦 모바일 햄버거 버튼 */}
      <button
        className="seller-header-menu-btn"
        onClick={onOpenSidebar}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 22,
          display: "none",
          color: c.text,
        }}
      >
        <FiMenu />
      </button>

      {/* 제목 자리 여유 */}
      <div style={{ fontWeight: 700, color: c.text, fontSize: 17 }}>
        판매자 센터
      </div>

      {/* 오른쪽: 테마 + 프로필 */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <button
          onClick={toggleTheme}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 20,
            color: c.text,
          }}
        >
          {isDark ? <FiSun /> : <FiMoon />}
        </button>

        <div style={{ position: "relative" }}>
          <div
            onClick={() => setOpen(!open)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              color: c.text,
              fontWeight: 600,
            }}
          >
            <FiUser />
            {user?.name || "판매자"}
          </div>

          {open && (
            <div
              style={{
                position: "absolute",
                top: 40,
                right: 0,
                background: c.bg,
                border: `1px solid ${c.border}`,
                borderRadius: 10,
                padding: 12,
                minWidth: 160,
                boxShadow: isDark
                  ? "0 4px 12px rgba(0,0,0,0.4)"
                  : "0 4px 12px rgba(0,0,0,0.08)",
                zIndex: 100,
                color: c.text,
              }}
            >
              <p style={{ margin: 0 }}>{user?.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* 반응형 스타일 */}
      <style>{`
        @media (max-width: 768px) {
          .seller-header-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}

export default SellerHeader;
