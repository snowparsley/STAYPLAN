import React, { useEffect, useState } from "react";
import SellerLayout from "../../components/seller/SellerLayout";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

function SellerDashboard() {
  const { token } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const c = {
    bg: isDark ? "#1A1A18" : "#FAF7F0",
    card: isDark ? "#262522" : "#FFFFFF",
    line: isDark ? "#3F3C38" : "#E5E1D8",
    text: isDark ? "#EFEDE8" : "#4A3F35",
    sub: isDark ? "#A9A39A" : "#7A746D",
    shadow: isDark
      ? "0 12px 28px rgba(0,0,0,0.55)"
      : "0 12px 28px rgba(0,0,0,0.08)",
  };

  const [stats, setStats] = useState({
    listingCount: 0,
    todayReservations: 0,
    totalReservations: 0,
    totalSales: 0,
  });

  // 🔥 여기 URL이 문제였음 → 수정 완료
  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch(
          "https://stayplanserver.onrender.com/api/seller/stats",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (res.ok) setStats(data);
      } catch (err) {
        console.error("대시보드 에러:", err);
      }
    };

    loadStats();
  }, [token]);

  const card = {
    background: c.card,
    borderRadius: 18,
    border: `1px solid ${c.line}`,
    padding: "26px 26px",
    boxShadow: c.shadow,
    flex: 1,
    minWidth: 240,
  };

  const iconStyle = { fontSize: 24, color: c.sub, marginBottom: 12 };

  return (
    <SellerLayout>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 26 }}>
        판매자 대시보드
      </h1>

      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          marginBottom: 30,
        }}
      >
        <div style={card}>
          <div style={iconStyle}>🏠</div>
          <p style={{ color: c.sub, fontSize: 14 }}>등록된 숙소 수</p>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
            {stats.listingCount}개
          </h3>
        </div>

        <div style={card}>
          <div style={iconStyle}>📅</div>
          <p style={{ color: c.sub, fontSize: 14 }}>오늘 예약 수</p>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
            {stats.todayReservations}건
          </h3>
        </div>

        <div style={card}>
          <div style={iconStyle}>🧾</div>
          <p style={{ color: c.sub, fontSize: 14 }}>전체 예약 수</p>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
            {stats.totalReservations}건
          </h3>
        </div>

        <div style={card}>
          <div style={iconStyle}>⭐</div>
          <p style={{ color: c.sub, fontSize: 14 }}>총 매출</p>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
            {stats.totalSales.toLocaleString()}원
          </h3>
        </div>
      </div>
    </SellerLayout>
  );
}

export default SellerDashboard;
