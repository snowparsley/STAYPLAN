import React, { useEffect, useState } from "react";
import SellerLayout from "../../components/seller/SellerLayout";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

/* =============================
    간단한 SVG 라인 차트 생성 함수
============================= */
function LineChart({ data, color }) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.amount), 1);
  const points = data
    .map(
      (d, i) =>
        `${(i / (data.length - 1)) * 100},${100 - (d.amount / max) * 100}`
    )
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ width: "100%", height: 120 }}
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
}

function SellerSales() {
  const { token } = useAuth();
  const { theme } = useTheme();

  const [stats, setStats] = useState({
    totalSales: 0,
    totalReservations: 0,
    recentSales: [],
  });

  const isDark = theme === "dark";

  const c = {
    bg: isDark ? "#1A1A18" : "#FAF7F0",
    card: isDark ? "#262522" : "#FFFFFF",
    text: isDark ? "#EFEDE8" : "#4A3F35",
    sub: isDark ? "#A9A39A" : "#7A746D",
    line: isDark ? "#3F3C38" : "#E5E1D8",
    highlight: "#A47A6B",
    shadow: isDark
      ? "0 10px 24px rgba(0,0,0,0.55)"
      : "0 10px 24px rgba(0,0,0,0.06)",
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* --------------------------------------------------------
      판매자 매출 통계 불러오기
  -------------------------------------------------------- */
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
        console.error("통계 불러오기 오류:", err);
      }
    };

    loadStats();
  }, [token]);

  /* 카드 공통 스타일 */
  const card = {
    background: c.card,
    border: `1px solid ${c.line}`,
    borderRadius: 20,
    padding: "26px 28px",
    boxShadow: c.shadow,
    flex: 1,
    minHeight: 130,
  };

  return (
    <SellerLayout>
      <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 32 }}>
        매출 통계
      </h1>

      {/* ----- 요약 카드 3종 ----- */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 20,
          marginBottom: 40,
        }}
      >
        <div style={card}>
          <h3 style={{ color: c.sub, margin: 0, fontSize: 15 }}>총 매출</h3>
          <p style={{ margin: "12px 0 0", fontSize: 30, fontWeight: 800 }}>
            {stats.totalSales.toLocaleString()}원
          </p>
        </div>

        <div style={card}>
          <h3 style={{ color: c.sub, margin: 0, fontSize: 15 }}>총 예약 수</h3>
          <p style={{ margin: "12px 0 0", fontSize: 30, fontWeight: 800 }}>
            {stats.totalReservations}건
          </p>
        </div>

        <div style={card}>
          <h3 style={{ color: c.sub, margin: 0, fontSize: 15 }}>
            최근 7일 매출 합계
          </h3>
          <p style={{ margin: "12px 0 0", fontSize: 28, fontWeight: 800 }}>
            {stats.recentSales
              .reduce((s, d) => s + d.amount, 0)
              .toLocaleString()}
            원
          </p>
        </div>
      </div>

      {/* ----- 최근 7일 매출 그래프 ----- */}
      <div style={{ ...card, padding: "32px" }}>
        <h3 style={{ marginBottom: 16, color: c.sub }}>최근 7일 매출 그래프</h3>

        {stats.recentSales.length === 0 ? (
          <p style={{ color: c.sub }}>최근 매출 데이터가 없습니다.</p>
        ) : (
          <>
            <LineChart data={stats.recentSales} color={c.highlight} />

            <div style={{ marginTop: 16 }}>
              {stats.recentSales.map((d, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${c.line}`,
                    padding: "8px 0",
                    fontSize: 15,
                    color: c.text,
                  }}
                >
                  <span>{d.date}</span>
                  <span>{Number(d.amount).toLocaleString()}원</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </SellerLayout>
  );
}

export default SellerSales;
