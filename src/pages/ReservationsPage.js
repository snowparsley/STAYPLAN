// 예약내역 페이지 (B안 전체 톤 적용)
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function ReservationsPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API = "https://stayplanserver.onrender.com";

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
  }, [token]);

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
          marginTop: 100,
          color: isDark ? "#A9A39A" : "#7A746D",
          fontSize: 18,
        }}
      >
        {loading ? "불러오는 중..." : "업데이트 중..."}
      </div>
    );
  }

  /* ---------------------------------------------
        🎨 B안 전체 색 구성
  --------------------------------------------- */
  const pageBg = isDark ? "#1F1E1C" : "#FAF7F0";
  const titleColor = isDark ? "#E3DFD7" : "#46423C";
  const emptyColor = isDark ? "#A9A39A" : "#7A746D";

  const cardBg = isDark ? "#2A2926" : "#FFFFFF";
  const cardShadow = isDark
    ? "0 10px 26px rgba(0,0,0,0.55)"
    : "0 10px 26px rgba(0,0,0,0.08)";
  const lineColor = isDark ? "#4A4743" : "#E6E1D8";

  const mainText = isDark ? "#E3DFD7" : "#3F3A35";
  const subText = isDark ? "#A9A39A" : "#7A746D";
  const priceColor = "#A47A6B";

  const buttonBg = isDark ? "#CFCAC0" : "#5A554D";
  const buttonText = isDark ? "#1F1E1C" : "#FFF";

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: pageBg,
        padding: "50px 0",
        transition: "0.25s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <h2
          style={{
            fontSize: 32,
            fontWeight: 800,
            marginBottom: 35,
            color: titleColor,
            textAlign: "center",
          }}
        >
          나의 예약 내역
        </h2>

        {/* ------------------------------------------ */}
        {/* 빈 상태 */}
        {/* ------------------------------------------ */}
        {reservations.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              marginTop: 140,
              fontSize: 22,
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
              gap: 30,
              paddingBottom: 80,
            }}
          >
            {reservations.map((r) => (
              <motion.div
                key={r.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                onClick={() => navigate(`/listing/${r.listing_id}`)}
                style={{
                  background: cardBg,
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: cardShadow,
                  border: `1px solid ${lineColor}`,
                  transition: "0.25s ease",
                  cursor: "pointer",
                }}
              >
                <img
                  src={r.thumbnail}
                  alt={r.title}
                  style={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                  }}
                />

                <div style={{ padding: 18 }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: 700,
                      color: mainText,
                    }}
                  >
                    {r.title}
                  </h3>

                  <p
                    style={{
                      margin: "8px 0",
                      color: subText,
                      fontSize: 14,
                    }}
                  >
                    {r.check_in.slice(0, 10)} ~ {r.check_out.slice(0, 10)}
                  </p>

                  <p
                    style={{
                      color: priceColor,
                      fontWeight: 700,
                      fontSize: 16,
                      marginBottom: 6,
                    }}
                  >
                    {Number(r.total_price).toLocaleString()}원
                  </p>

                  <p
                    style={{
                      color: r.status === "canceled" ? "#C66A6A" : "#8ECF9E",
                      fontWeight: 700,
                      fontSize: 14,
                      marginBottom: 18,
                    }}
                  >
                    {r.status === "canceled" ? "취소됨 ❌" : "결제 완료 ✅"}
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteReservation(r.id);
                    }}
                    style={{
                      width: "100%",
                      background: buttonBg,
                      border: "none",
                      padding: "12px 0",
                      color: buttonText,
                      borderRadius: 10,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: 15,
                    }}
                  >
                    {r.status === "canceled"
                      ? "예약 내역 삭제하기"
                      : "예약 취소하기"}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 반응형 */}
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
