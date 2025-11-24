// src/pages/admin/AdminDashboard.js
import React, { useEffect, useState } from "react";
import AdminCard from "../../components/admin/AdminCard";

import { FiUsers, FiClipboard, FiDollarSign } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";

function AdminDashboard() {
  const { theme } = useTheme();
  const { token } = useAuth();
  const isDark = theme === "dark";

  const c = {
    text: isDark ? "#EFEDE8" : "#4A3F35",
    card: isDark ? "#34322D" : "#FFFFFF",
    line: isDark ? "#3F3C38" : "#E5E1D8",
    sub: isDark ? "#CFCAC0" : "#7A746D",
  };

  const [stats, setStats] = useState({
    totalUsers: "—",
    totalReservations: "—",
    totalRevenue: "—",
    recentReservations: [],
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch(
        "https://stayplanserver.onrender.com/api/admin/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      setStats({
        totalUsers: data.totalUsers ?? 0,
        totalReservations: data.totalReservations ?? 0,
        totalRevenue: data.totalRevenue
          ? data.totalRevenue.toLocaleString() + "원"
          : "0원",
        recentReservations: data.recentReservations ?? [],
      });

      setLoading(false);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <main
      style={{
        width: "100%",
        padding: "20px",
        color: c.text,
        boxSizing: "border-box",
      }}
    >
      {/* 카드 그리드 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20,
          marginBottom: 40,
        }}
      >
        <AdminCard
          title="총 유저"
          value={stats.totalUsers}
          icon={<FiUsers />}
        />
        <AdminCard
          title="총 예약"
          value={stats.totalReservations}
          icon={<FiClipboard />}
        />
        <AdminCard
          title="총 매출"
          value={stats.totalRevenue}
          icon={<FiDollarSign />}
        />
      </div>

      {/* 최근 예약 */}
      <h2
        style={{
          fontSize: 22,
          fontWeight: 800,
          marginBottom: 16,
          color: c.text,
        }}
      >
        최근 예약
      </h2>

      <div
        style={{
          background: c.card,
          borderRadius: 14,
          padding: "16px 20px",
          border: `1px solid ${c.line}`,
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
          overflowX: "auto",
        }}
      >
        {loading ? (
          <p style={{ color: c.sub }}>불러오는 중...</p>
        ) : stats.recentReservations.length === 0 ? (
          <p style={{ color: c.sub }}>최근 예약이 없습니다.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 600,
            }}
          >
            <thead>
              <tr style={{ borderBottom: `1px solid ${c.line}` }}>
                <th style={thStyle(c)}>ID</th>
                <th style={thStyle(c)}>유저명</th>
                <th style={thStyle(c)}>숙소</th>
                <th style={thStyle(c)}>체크인</th>
                <th style={thStyle(c)}>금액</th>
              </tr>
            </thead>

            <tbody>
              {stats.recentReservations.map((r) => (
                <tr
                  key={r.id}
                  style={{
                    textAlign: "center",
                    borderBottom: `1px solid ${c.line}`,
                    height: 56,
                    color: c.text,
                  }}
                >
                  <td>{r.id}</td>
                  <td>{r.user}</td>
                  <td>{r.listing}</td>
                  <td>{r.check_in?.slice(0, 10)}</td>
                  <td>{r.total_price?.toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}

const thStyle = (c) => ({
  padding: "12px 0",
  color: c.sub,
  fontSize: 15,
  fontWeight: 700,
});

export default AdminDashboard;
