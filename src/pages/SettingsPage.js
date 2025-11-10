import React, { useState } from "react";

function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "80px auto",
        padding: "40px 20px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "25px" }}>
        설정
      </h2>

      <div style={{ lineHeight: "2", fontSize: "16px" }}>
        <label style={{ display: "block", marginBottom: "12px" }}>
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
            style={{ marginRight: "8px" }}
          />
          알림 받기
        </label>

        <label style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            style={{ marginRight: "8px" }}
          />
          다크 모드
        </label>

        <button
          onClick={() => alert("설정이 저장되었습니다 ✅")}
          style={{
            marginTop: "30px",
            background: "#ff5a5f",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "12px 24px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: 600,
          }}
        >
          저장하기
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
