import React, { useEffect, useState } from "react";
import SellerLayout from "../../components/seller/SellerLayout";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

function SellerDashboard() {
  const { token, user } = useAuth();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const c = {
    bg: isDark ? "#1A1A18" : "#FAF7F0",
    card: isDark ? "#262522" : "#FFFFFF",
    line: isDark ? "#3F3C38" : "#E6E1D8",
    text: isDark ? "#EFEDE8" : "#4A3F35",
    sub: isDark ? "#A9A39A" : "#7A746D",
    shadow: isDark
      ? "0 12px 28px rgba(0,0,0,0.55)"
      : "0 12px 28px rgba(0,0,0,0.08)",
  };

  const [stats, setStats] = useState({
    totalSales: 0,
    totalReservations: 0,
    recentSales: [],
  });

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
        setStats(data);
      } catch (err) {
        console.error("판매자 대시보드 에러:", err);
      }
    };

    loadStats();
  }, [token]);

  const card = {
    background: c.card,
    border: `1px solid ${c.line}`,
    borderRadius: 20,
    padding: "28px",
    minHeight: 120,
    boxShadow: c.shadow,
    flex: 1,
  };

  const recentCard = {
    background: c.card,
    border: `1px solid ${c.line}`,
    borderRadius: 20,
    padding: "30px",
    boxShadow: c.shadow,
    marginTop: 30,
  };

  return (
    <SellerLayout>
      <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 22 }}>
        판매자 대시보드
      </h1>

      {/* 요약 카드 3개 */}
      <div
        style={{
          display: "flex",
          gap: 22,
          flexWrap: "wrap",
        }}
      >
        <div style={card}>
          <h3 style={{ margin: 0, color: c.sub, fontSize: 15 }}>총 매출</h3>
          <p style={{ margin: "12px 0 0", fontSize: 28, fontWeight: 700 }}>
            {stats.totalSales.toLocaleString()}원
          </p>
        </div>

        <div style={card}>
          <h3 style={{ margin: 0, color: c.sub, fontSize: 15 }}>총 예약 수</h3>
          <p style={{ margin: "12px 0 0", fontSize: 28, fontWeight: 700 }}>
            {stats.totalReservations}건
          </p>
        </div>

        <div style={card}>
          <h3 style={{ margin: 0, color: c.sub, fontSize: 15 }}>
            최근 7일 매출
          </h3>
          <p style={{ margin: "12px 0 0", fontSize: 26, fontWeight: 700 }}>
            {stats.recentSales
              .reduce((s, r) => s + r.amount, 0)
              .toLocaleString()}
            원
          </p>
        </div>
      </div>

      {/* 최근 7일 매출 상세 */}
      <div style={recentCard}>
        <h3 style={{ marginBottom: 18, color: c.sub, fontSize: 17 }}>
          최근 7일 매출 상세
        </h3>

        {stats.recentSales.length === 0 ? (
          <p style={{ color: c.sub }}>최근 매출이 없습니다.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {stats.recentSales.map((r, i) => (
              <div
                key={i}
                style={{
                  padding: "14px 18px",
                  borderRadius: 14,
                  background: isDark ? "#2F2E2B" : "#F4EFE7",
                  border: `1px solid ${c.line}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 15,
                  }}
                >
                  <span style={{ color: c.text }}>
                    📅 {r.date?.slice(5, 10)}
                  </span>
                  <span style={{ fontWeight: 700 }}>
                    {Number(r.amount).toLocaleString()}원
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SellerLayout>
  );
}

export default SellerDashboard;
