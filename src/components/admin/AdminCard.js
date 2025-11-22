import React from "react";

function AdminCard({ title, value, icon }) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 16,
        padding: "24px 22px",
        border: "1px solid #e5e1d8",
        boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
        transition: "0.25s ease",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.04)";
      }}
    >
      {/* 아이콘 영역 */}
      {icon && (
        <div
          style={{
            fontSize: 28,
            color: "#A47A6B",
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
          color: "#7a746d",
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
          color: "#4a3f35",
        }}
      >
        {value}
      </p>
    </div>
  );
}

export default AdminCard;
