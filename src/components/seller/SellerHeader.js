// src/components/seller/SellerHeader.js
import React, { useState } from "react";
import { FiSun, FiMoon, FiUser } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";

function SellerHeader() {
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
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0 24px",
        boxSizing: "border-box",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* 테마 버튼 */}
      <button
        onClick={toggleTheme}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 20,
          marginRight: 20,
          color: c.text,
        }}
      >
        {isDark ? <FiSun /> : <FiMoon />}
      </button>

      {/* 프로필 영역 */}
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

        {/* 드롭다운 */}
        {open && (
          <div
            style={{
              position: "absolute",
              top: 40,
              right: 0,
              background: c.bg,
              border: `1px solid ${c.border}`,
              borderRadius: 10,
              padding: 10,
              minWidth: 150,
              boxShadow: isDark
                ? "0 4px 12px rgba(0,0,0,0.4)"
                : "0 4px 12px rgba(0,0,0,0.08)",
              zIndex: 100,
            }}
          >
            <p style={{ margin: 0, padding: "6px 4px", color: c.text }}>
              {user?.email}
            </p>
          </div>
        )}
      </div>
    </header>
  );
}

export default SellerHeader;
