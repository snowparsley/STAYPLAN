import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";

function ReservationsPage() {
  const { token } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReservations = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/my-reservations", {
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
      const res = await fetch(`http://localhost:5000/api/reservations/${id}`, {
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
      <div style={{ textAlign: "center", marginTop: "100px", color: "#777" }}>
        {loading ? "불러오는 중..." : "내역 갱신 중..."}
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1300px",
        margin: "40px auto",
        padding: "0 20px",
      }}
    >
      <h2
        style={{
          fontSize: "32px",
          fontWeight: 800,
          marginBottom: "30px",
          color: "#000",
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
            color: "#777",
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
                background: "#fff",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
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
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>
                  {r.title}
                </h3>

                <p style={{ margin: "6px 0", color: "#444", fontSize: "14px" }}>
                  {r.check_in.slice(0, 10)} ~ {r.check_out.slice(0, 10)}
                </p>

                <p
                  style={{
                    color: "#ff5a5f",
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
  );
}

export default ReservationsPage;
