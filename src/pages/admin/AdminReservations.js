// src/pages/admin/AdminReservations.js
import React, { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";

function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  const { theme } = useTheme();
  const { token } = useAuth();

  const isDark = theme === "dark";
  const c = {
    bg: isDark ? "#2A2926" : "#F7F5EF",
    card: isDark ? "#34322D" : "#FFFFFF",
    text: isDark ? "#EFEDE8" : "#4A3F35",
    sub: isDark ? "#CFCAC0" : "#7A746D",
    line: isDark ? "#3F3C38" : "#E5E1D8",
  };

  // 화면 크기 감지 (모바일 여부)
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "https://stayplanserver.onrender.com/api/admin/reservations",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "예약 목록을 불러오지 못했습니다.");
        setReservations([]);
      } else {
        setReservations(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("예약 불러오기 오류:", err);
      setError("서버 연결 오류");
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const deleteReservation = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(
        `https://stayplanserver.onrender.com/api/admin/reservations/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "삭제 실패");
        return;
      }

      alert("예약 삭제 완료");
      fetchReservations();
    } catch (err) {
      alert("삭제 실패 (서버 오류)");
    }
  };

  return (
    <main style={{ padding: "20px", color: c.text, background: c.bg }}>
      <h2
        style={{
          fontSize: 24,
          fontWeight: 800,
          marginBottom: 30,
          color: c.text,
        }}
      >
        예약 관리
      </h2>

      {loading && <p style={{ color: c.sub }}>불러오는 중...</p>}
      {error && (
        <p style={{ color: "red", marginBottom: 16, fontSize: 15 }}>{error}</p>
      )}

      {!loading && !error && (
        <>
          {/* 📱 모바일: 카드형 리스트 */}
          {isMobile ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {reservations.length === 0 ? (
                <p style={{ color: c.sub }}>예약 내역이 없습니다.</p>
              ) : (
                reservations.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      background: c.card,
                      borderRadius: 12,
                      padding: "14px 16px",
                      border: `1px solid ${c.line}`,
                      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      fontSize: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                        fontWeight: 700,
                      }}
                    >
                      <span>예약 #{r.id}</span>
                      <span>{r.status}</span>
                    </div>

                    <div style={{ color: c.sub }}>
                      유저명&nbsp;:&nbsp;
                      <span style={{ color: c.text }}>{r.user}</span>
                    </div>
                    <div style={{ color: c.sub }}>
                      숙소&nbsp;:&nbsp;
                      <span style={{ color: c.text }}>{r.listing}</span>
                    </div>
                    <div style={{ color: c.sub }}>
                      체크인&nbsp;:&nbsp;
                      <span style={{ color: c.text }}>
                        {r.check_in?.slice(0, 10)}
                      </span>
                    </div>
                    <div style={{ color: c.sub }}>
                      금액&nbsp;:&nbsp;
                      <span style={{ color: c.text }}>
                        {r.total_price?.toLocaleString()}원
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: 8,
                      }}
                    >
                      <button
                        style={deleteBtn}
                        onClick={() => deleteReservation(r.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            // 💻 데스크탑: 테이블 형식
            <div
              style={{
                background: c.card,
                borderRadius: 14,
                padding: "20px 24px",
                border: `1px solid ${c.line}`,
                boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <table
                style={{
                  width: "100%",
                  minWidth: 650,
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr style={{ borderBottom: `1px solid ${c.line}` }}>
                    <th style={thStyle(c)}>ID</th>
                    <th style={thStyle(c)}>유저명</th>
                    <th style={thStyle(c)}>숙소</th>
                    <th style={thStyle(c)}>체크인</th>
                    <th style={thStyle(c)}>금액</th>
                    <th style={thStyle(c)}>상태</th>
                    <th style={thStyle(c)}>관리</th>
                  </tr>
                </thead>

                <tbody>
                  {reservations.map((r) => (
                    <tr key={r.id} style={trStyle(c)}>
                      <td>{r.id}</td>
                      <td>{r.user}</td>
                      <td>{r.listing}</td>
                      <td>{r.check_in?.slice(0, 10)}</td>
                      <td>{r.total_price?.toLocaleString()}원</td>
                      <td>{r.status}</td>

                      <td>
                        <div
                          style={{
                            display: "flex",
                            gap: 12,
                            justifyContent: "center",
                          }}
                        >
                          <button
                            style={deleteBtn}
                            onClick={() => deleteReservation(r.id)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </main>
  );
}

const thStyle = (c) => ({
  padding: "14px 0",
  fontSize: 15,
  color: c.sub,
  fontWeight: 700,
});

const trStyle = (c) => ({
  textAlign: "center",
  borderBottom: `1px solid ${c.line}`,
  height: 60,
  color: c.text,
});

const deleteBtn = {
  background: "#B33A3A",
  border: "none",
  borderRadius: 6,
  padding: "6px 10px",
  cursor: "pointer",
  color: "#fff",
};

export default AdminReservations;
