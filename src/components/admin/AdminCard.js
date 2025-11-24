import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

function AdminCard({ title, value, icon }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const c = {
    bg: isDark ? "#2F2E2A" : "#FFFFFF",
    border: isDark ? "#44413C" : "#E4DED4",
    text: isDark ? "#EFEDE8" : "#4A3F35",
    sub: isDark ? "#CFCAC0" : "#7A746D",
    icon: isDark ? "#D6C0B8" : "#B89C8A",
    shadow: isDark
      ? "0 4px 12px rgba(0,0,0,0.38)"
      : "0 4px 14px rgba(0,0,0,0.09)",
    hoverShadow: isDark
      ? "0 8px 20px rgba(0,0,0,0.55)"
      : "0 10px 22px rgba(0,0,0,0.16)",
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <div
      style={{
        background: c.bg,
        borderRadius: 16,
        padding: isMobile ? "18px 18px" : "24px 22px",
        border: `1px solid ${c.border}`,
        boxShadow: c.shadow,
        transition: "0.25s ease",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        if (!isMobile) {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = c.hoverShadow;
        }
      }}
      onMouseLeave={(e) => {
        if (!isMobile) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = c.shadow;
        }
      }}
    >
      {/* 아이콘 */}
      {icon && (
        <div
          style={{
            fontSize: isMobile ? 24 : 28,
            color: c.icon,
            marginBottom: isMobile ? 2 : 6,
          }}
        >
          {icon}
        </div>
      )}

      {/* 제목 */}
      <h3
        style={{
          margin: 0,
          fontSize: isMobile ? 14 : 16,
          color: c.sub,
          fontWeight: 600,
        }}
      >
        {title}
      </h3>

      {/* 값 */}
      <p
        style={{
          margin: 0,
          fontSize: isMobile ? 26 : 32,
          fontWeight: 800,
          color: c.text,
          lineHeight: 1.2,
        }}
      >
        {value}
      </p>
    </div>
  );
}

export default AdminCard;
