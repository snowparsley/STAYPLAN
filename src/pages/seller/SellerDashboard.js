import React, { useEffect, useState } from "react";
import SellerLayout from "../../components/seller/SellerLayout";
import { useTheme } from "../../contexts/ThemeContext";
import {
  FiHome,
  FiPlusCircle,
  FiClipboard,
  FiStar,
  FiCalendar,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function SellerDashboard() {
  const { theme } = useTheme();
  const { token } = useAuth();
  const navigate = useNavigate();

  const isDark = theme === "dark";

  const c = {
    bg: isDark ? "#1A1A18" : "#FAF7F0",
    card: isDark ? "#2E2D2B" : "#FFFFFF",
    line: isDark ? "#3F3C38" : "#E6E1D8",
    text: isDark ? "#EFEDE8" : "#4A3F35",
    sub: isDark ? "#A9A39A" : "#7A746D",
    shadow: isDark
      ? "0 12px 28px rgba(0,0,0,0.55)"
      : "0 12px 28px rgba(0,0,0,0.08)",
    highlight: "#A47A6B",
  };

  const [stats, setStats] = useState({
    totalSales: 0,
    totalReservations: 0,
    listingCount: 0,
    todayReservations: 0,
  });

  // 통계 데이터 불러오기
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

  return (
    <SellerLayout>
      <h1
        style={{
          fontSize: 32,
          fontWeight: 800,
          marginBottom: 32,
          color: c.text,
        }}
      >
        판매자 대시보드
      </h1>

      {/* 요약 카드 4개 (숙소, 오늘예약, 총예약, 총매출) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: 20,
          marginBottom: 30,
        }}
      >
        <div style={card}>
          <FiHome size={32} color={c.highlight} />
          <h3 style={{ marginTop: 14, color: c.sub }}>등록된 숙소 수</h3>
          <p style={{ margin: "8px 0 0", fontSize: 28, fontWeight: 800 }}>
            {stats.listingCount}개
          </p>
        </div>

        <div style={card}>
          <FiCalendar size={32} color={c.highlight} />
          <h3 style={{ marginTop: 14, color: c.sub }}>오늘 예약 수</h3>
          <p style={{ margin: "8px 0 0", fontSize: 28, fontWeight: 800 }}>
            {stats.todayReservations}건
          </p>
        </div>

        <div style={card}>
          <FiClipboard size={32} color={c.highlight} />
          <h3 style={{ marginTop: 14, color: c.sub }}>전체 예약 수</h3>
          <p style={{ margin: "8px 0 0", fontSize: 28, fontWeight: 800 }}>
            {stats.totalReservations}건
          </p>
        </div>

        <div style={card}>
          <FiStar size={32} color={c.highlight} />
          <h3 style={{ marginTop: 14, color: c.sub }}>총 매출</h3>
          <p style={{ margin: "8px 0 0", fontSize: 28, fontWeight: 800 }}>
            {stats.totalSales.toLocaleString()}원
          </p>
        </div>
      </div>

      {/* 안내 카드 + 빠른 액션 */}
      <div
        style={{
          background: c.card,
          padding: "34px",
          borderRadius: 20,
          border: `1px solid ${c.line}`,
          boxShadow: c.shadow,
          maxWidth: 800,
        }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: c.text,
            marginBottom: 14,
          }}
        >
          👋 판매자님, 환영합니다!
        </h2>

        <p
          style={{
            fontSize: 15,
            lineHeight: "1.7",
            color: c.sub,
            marginBottom: 24,
          }}
        >
          숙소를 추가하거나 관리하고 예약 현황을 빠르게 확인할 수 있습니다.
        </p>

        {/* 액션 카드 */}
        <div
          style={{
            display: "flex",
            gap: 18,
            flexWrap: "wrap",
          }}
        >
          <div
            onClick={() => navigate("/seller/listings")}
            style={{
              flex: "1 1 160px",
              background: c.bg,
              border: `1px solid ${c.line}`,
              borderRadius: 16,
              padding: 20,
              cursor: "pointer",
            }}
          >
            <FiHome size={30} color={c.highlight} />
            <h4 style={{ marginTop: 10, marginBottom: 6, color: c.text }}>
              내 숙소 목록
            </h4>
            <p style={{ fontSize: 13, color: c.sub }}>
              등록된 숙소를 확인하고 수정할 수 있습니다.
            </p>
          </div>

          <div
            onClick={() => navigate("/seller/add-listing")}
            style={{
              flex: "1 1 160px",
              background: c.bg,
              border: `1px solid ${c.line}`,
              borderRadius: 16,
              padding: 20,
              cursor: "pointer",
            }}
          >
            <FiPlusCircle size={30} color={c.highlight} />
            <h4 style={{ marginTop: 10, marginBottom: 6, color: c.text }}>
              숙소 등록
            </h4>
            <p style={{ fontSize: 13, color: c.sub }}>
              새로운 숙소를 간편하게 등록해보세요.
            </p>
          </div>

          <div
            onClick={() => navigate("/seller/reservations")}
            style={{
              flex: "1 1 160px",
              background: c.bg,
              border: `1px solid ${c.line}`,
              borderRadius: 16,
              padding: 20,
              cursor: "pointer",
            }}
          >
            <FiClipboard size={30} color={c.highlight} />
            <h4 style={{ marginTop: 10, marginBottom: 6, color: c.text }}>
              예약 관리
            </h4>
            <p style={{ fontSize: 13, color: c.sub }}>
              예약 내역을 확인하고 관리할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}

export default SellerDashboard;
