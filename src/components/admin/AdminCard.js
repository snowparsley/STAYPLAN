import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

function AdminCard({ title, value, icon }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // 테마별 컬러셋
  const c = {
    bg: isDark ? "#34322D" : "#FFFFFF",
    text: isDark ? "#EFEDE8" : "#4a3f35",
    sub: isDark ? "#CFCAC0" : "#7a746d",
    border: isDark ? "#4A4743" : "#e5e1d8",
    icon: isDark ? "#D6C0B8" : "#A47A6B",
    shadow: isDark
      ? "0 8px 20px rgba(0,0,0,0.35)"
      : "0 8px 20px rgba(0,0,0,0.08)",
    hoverShadow: isDark
      ? "0 12px 26px rgba(0,0,0,0.45)"
      : "0 12px 26px rgba(0,0,0,0.16)",
  };

  return (
    <div
      style={{
        background: c.bg,
        borderRadius: 16,
        padding: "24px 22px",
        border: `1px solid ${c.border}`,
        boxShadow: c.shadow,
        transition: "0.25s ease",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = c.hoverShadow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = c.shadow;
      }}
    >
      {/* 아이콘 */}
      {icon && (
        <div
          style={{
            fontSize: 28,
            color: c.icon,
            marginBottom: 6,
          }}
        >
          {icon}
        </div>
      )}

      {/* 제목 */}
      <h3
        style={{
          margin: 0,
          fontSize: 16,
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
          fontSize: 32,
          fontWeight: 800,
          color: c.text,
        }}
      >
        {value}
      </p>
    </div>
  );
}

export default AdminCard;
