// src/pages/AdminPage.js
import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

function AdminPage() {
  const { user, logout } = useAuth(); // ⭐ logout 가져오기
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isDark = theme === "dark";

  useEffect(() => {
    if (!user?.admin) {
      alert("관리자만 접근할 수 있는 페이지입니다.");
      navigate("/");
    }
  }, [user, navigate]);

  const c = {
    bg: isDark ? "#1A1A18" : "#F4F4F4",
    card: isDark ? "#2A2926" : "#FFFFFF",
    text: isDark ? "#EAE6DE" : "#3F3A35",
    sub: isDark ? "#A9A39A" : "#7A746D",
    line: isDark ? "#3F3C38" : "#DDD",
    accent: "#A47A6B",
  };

  // ⭐ 로그아웃 함수
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: c.bg }}>
      {/* ◾ LEFT SIDEBAR */}
      <aside
        style={{
          width: 240,
          background: c.card,
          borderRight: `1px solid ${c.line}`,
          padding: 24,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", // ⭐ 아래에 로그아웃 배치
        }}
      >
        <div>
          <h2 style={{ color: c.text, margin: 0, marginBottom: 30 }}>
            Admin Panel
          </h2>

          <nav style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <button style={navItemStyle(c)} onClick={() => navigate("/admin")}>
              📊 대시보드
            </button>
            <button
              style={navItemStyle(c)}
              onClick={() => navigate("/admin/reservations")}
            >
              📝 예약 관리
            </button>
            <button
              style={navItemStyle(c)}
              onClick={() => navigate("/admin/listings")}
            >
              🏡 숙소 관리
            </button>
            <button
              style={navItemStyle(c)}
              onClick={() => navigate("/admin/users")}
            >
              👤 유저 관리
            </button>
          </nav>
        </div>

        {/* ◾ 로그아웃 버튼 (사이드바 맨 아래) */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: 30,
            padding: "12px 16px",
            background: "#D9534F",
            color: "#fff",
            borderRadius: 8,
            border: "none",
            fontWeight: 700,
            cursor: "pointer",
            width: "100%",
          }}
        >
          🚪 로그아웃
        </button>
      </aside>

      {/* ◾ MAIN CONTENT */}
      <main style={{ flex: 1, padding: "30px 40px", color: c.text }}>
        <h1 style={{ marginBottom: 30, fontWeight: 700 }}>관리자 대시보드</h1>

        {/* DASHBOARD CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 20,
            marginBottom: 40,
          }}
        >
          <div style={dashboardCard(c)}>
            <h3 style={{ margin: 0, color: c.sub }}>총 유저</h3>
            <p style={valueText(c)}>—</p>
          </div>

          <div style={dashboardCard(c)}>
            <h3 style={{ margin: 0, color: c.sub }}>총 예약</h3>
            <p style={valueText(c)}>—</p>
          </div>

          <div style={dashboardCard(c)}>
            <h3 style={{ margin: 0, color: c.sub }}>총 매출</h3>
            <p style={valueText(c)}>—</p>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 style={{ marginBottom: 16 }}>빠른 메뉴</h2>
        <div
          style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <button
            style={quickBtn(c)}
            onClick={() => navigate("/admin/listings")}
          >
            숙소 등록
          </button>
          <button
            style={quickBtn(c)}
            onClick={() => navigate("/admin/reservations")}
          >
            예약 현황
          </button>
          <button style={quickBtn(c)} onClick={() => navigate("/admin/users")}>
            유저 리스트
          </button>
        </div>
      </main>
    </div>
  );
}

/* --------------------------
   STYLES
--------------------------- */

const navItemStyle = (c) => ({
  padding: "12px 16px",
  background: c.bg,
  color: c.text,
  border: `1px solid ${c.line}`,
  borderRadius: 8,
  cursor: "pointer",
  textAlign: "left",
  fontWeight: 600,
});

const dashboardCard = (c) => ({
  background: c.card,
  padding: "26px 22px",
  borderRadius: 16,
  border: `1px solid ${c.line}`,
  boxShadow: "0 10px 20px rgba(0,0,0,0.06)",
});

const valueText = (c) => ({
  marginTop: 12,
  fontSize: 30,
  fontWeight: 800,
  color: c.accent,
});

const quickBtn = (c) => ({
  padding: "14px 20px",
  background: c.accent,
  border: "none",
  borderRadius: 12,
  fontSize: 16,
  fontWeight: 700,
  color: "#fff",
  cursor: "pointer",
});

export default AdminPage;
