import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import SellerLayout from "../../components/seller/SellerLayout";

function SellerSales() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("https://stayplanserver.onrender.com/api/seller/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => alert("매출 통계 불러오기 실패"));
  }, [token]);

  if (!stats) return <div style={{ padding: 30 }}>불러오는 중...</div>;

  return (
    <div style={{ padding: 30 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>매출 통계</h1>

      <div style={box}>
        <h2>총 매출</h2>
        <p style={number}>₩{stats.totalSales.toLocaleString()}</p>
      </div>

      <div style={box}>
        <h2>총 예약 건수</h2>
        <p style={number}>{stats.totalReservations}건</p>
      </div>

      <h2 style={{ marginTop: 30 }}>최근 매출</h2>
      {stats.recentSales.map((s, idx) => (
        <div key={idx} style={card}>
          <p>날짜: {s.date}</p>
          <p>금액: ₩{s.amount.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

const box = {
  marginTop: "20px",
  padding: "20px",
  background: "#f3f4f6",
  borderRadius: "8px",
};

const number = {
  fontSize: "24px",
  fontWeight: 700,
  marginTop: "5px",
};

const card = {
  marginTop: "12px",
  padding: "14px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  background: "#fff",
};

export default SellerSales;
