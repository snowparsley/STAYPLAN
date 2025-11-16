// src/pages/ReservationsPage.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";

function ReservationsPage() {
  const { token } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 🔥 공통 API 주소
  const API = import.meta.env.VITE_API_URL;

  const fetchReservations = async () => {
    try {
      const res = await fetch(`${API}/api/my-reservations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ 예약 목록 불러오기 오류:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [token, API]);

  const deleteReservation = async (id) => {
    if (!window.confirm("정말 예약 내역을 삭제하시겠습니까?")) return;
    setRefreshing(true);
    try {
      const res = await fetch(`${API}/api/reservations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        setReservations((prev) => prev.filter((r) => r.id !== id));
      } else {
        alert("삭제 실패 ❌");
      }
    } catch (err) {
      alert("예약 삭제 중 오류 발생 ❌");
    } finally {
      setRefreshing(false);
    }
  };

  if (loading || refreshing) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "100px",
          color: isDark ? "#bbb" : "#777",
        }}
      >
        {loading ? "불러오는 중..." : "내역 갱신 중..."}
      </div>
    );
  }

  const pageBg = isDark ? "#000" : "beige";
  const titleColor = isDark ? "#f5f5f5" : "#000";
  const emptyColor = isDark ? "#888" : "#777";
  const cardBg = isDark ? "#111" : "#fff";
  const cardShadow = isDark
    ? "0 4px 18px rgba(255,255,255,0.05)"
    : "0 4px 18px rgba(0,0,0,0.08)";
  const textPrimary = isDark ? "#ddd" : "#000";
  const textSecondary = isDark ? "#bbb" : "#444";
  const priceColor = "#ff5a5f";

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: pageBg,
        padding: "40px 0",
        transition: "0.25s ease",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1300px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <h2
          style={{
            fontSize: "32px",
            fontWeight: 800,
            marginBottom: "30px",
            color: titleColor,
            textAlign: "center",
          }}
        >
          나의 예약 내역
        </h2>

        {reservations.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              marginTop: "120px",
              fontSize: "22px",
              fontWeight: 700,
              color: emptyColor,
            }}
          >
            예약 내역이 없습니다 😢
          </div>
        ) : (
          <div
            className="reservation-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "25px",
              paddingBottom: "60px",
            }}
          >
            {reservations.map((r) => (
              <motion.div
                key={r.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                style={{
                  background: cardBg,
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: cardShadow,
                  transition: "0.25s ease",
                }}
              >
                <img
                  src={r.thumbnail}
                  alt={r.title}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />

                <div style={{ padding: "18px" }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "18px",
                      fontWeight: 700,
                      color: textPrimary,
                    }}
                  >
                    {r.title}
                  </h3>

                  <p
                    style={{
                      margin: "6px 0",
                      color: textSecondary,
                      fontSize: "14px",
                    }}
                  >
                    {r.check_in.slice(0, 10)} ~ {r.check_out.slice(0, 10)}
                  </p>

                  <p
                    style={{
                      color: priceColor,
                      fontWeight: 700,
                      fontSize: "15px",
                      marginBottom: "6px",
                    }}
                  >
                    {Number(r.total_price).toLocaleString()}원
                  </p>

                  <p
                    style={{
                      color: r.status === "canceled" ? "#d9534f" : "#2ecc71",
                      fontWeight: 600,
                      fontSize: "14px",
                      marginBottom: "12px",
                    }}
                  >
                    {r.status === "canceled" ? "취소됨 ❌" : "결제 완료 ✅"}
                  </p>

                  <button
                    onClick={() => deleteReservation(r.id)}
                    style={{
                      width: "100%",
                      background: "#ff5a5f",
                      border: "none",
                      padding: "10px 0",
                      color: "#fff",
                      borderRadius: "8px",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: "15px",
                    }}
                  >
                    {r.status === "canceled"
                      ? "예약 내역 삭제하기"
                      : "예약 취소하기"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <style>
          {`
            @media (max-width: 768px) {
              .reservation-grid {
                grid-template-columns: 1fr !important;
                gap: 20px !important;
              }
            }
          `}
        </style>
      </div>
    </div>
  );
}

export default ReservationsPage;
