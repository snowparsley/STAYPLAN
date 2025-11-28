import React, { useEffect, useState } from "react";
import SellerLayout from "../components/SellerLayout";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { FiTrash2 } from "react-icons/fi";

function SellerReservations() {
  const { token } = useAuth();
  const { theme } = useTheme();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const isDark = theme === "dark";

  const c = {
    bg: isDark ? "#1A1A18" : "#FAF7F0",
    card: isDark ? "#262522" : "#FFFFFF",
    text: isDark ? "#EFEDE8" : "#4A3F35",
    sub: isDark ? "#A9A39A" : "#7A746D",
    line: isDark ? "#3F3C38" : "#E5E1D8",
    shadow: isDark
      ? "0 10px 22px rgba(0,0,0,0.45)"
      : "0 10px 22px rgba(0,0,0,0.06)",
  };

  /* ---------------------------------------------------------
      반응형 체크
  --------------------------------------------------------- */
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ---------------------------------------------------------
      판매자 예약 목록 불러오기
  --------------------------------------------------------- */
  const loadReservations = async () => {
    try {
      const res = await fetch(
        "https://stayplanserver.onrender.com/api/seller/reservations",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("예약 불러오기 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  /* ---------------------------------------------------------
      예약 삭제
  --------------------------------------------------------- */
  const deleteReservation = async (id) => {
    if (!window.confirm("해당 예약을 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(
        `https://stayplanserver.onrender.com/api/seller/delete-reservation/${id}`,
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
      loadReservations();
    } catch (err) {
      alert("서버 오류: 삭제 실패");
    }
  };

  /* ---------------------------------------------------------
      테이블 스타일 공통
  --------------------------------------------------------- */
  const th = {
    padding: "14px 0",
    fontSize: 15,
    fontWeight: 700,
    color: c.sub,
    borderBottom: `1px solid ${c.line}`,
  };

  const td = {
    padding: "14px 6px",
    fontSize: 15,
    color: c.text,
    textAlign: "center",
    borderBottom: `1px solid ${c.line}`,
  };

  const btnDelete = {
    background: "#B33A3A",
    border: "none",
    padding: "6px 10px",
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer",
  };

  /* ---------------------------------------------------------
      JSX
  --------------------------------------------------------- */
  return (
    <SellerLayout>
      <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 26 }}>
        예약 관리
      </h1>

      {loading ? (
        <p style={{ color: c.sub }}>불러오는 중...</p>
      ) : reservations.length === 0 ? (
        <p style={{ color: c.sub }}>예약 내역이 없습니다.</p>
      ) : isMobile ? (
        /* -------------------------------------------------------
            📱 모바일 카드 UI
        ------------------------------------------------------- */
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {reservations.map((r) => (
            <div
              key={r.id}
              style={{
                background: c.card,
                borderRadius: 14,
                border: `1px solid ${c.line}`,
                padding: 16,
                boxShadow: c.shadow,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                <span>예약 #{r.id}</span>
              </div>

              <p style={{ color: c.sub, marginBottom: 4 }}>
                사용자 : <b style={{ color: c.text }}>{r.user_name}</b>
              </p>

              <p style={{ color: c.sub, marginBottom: 4 }}>
                숙소 : <b style={{ color: c.text }}>{r.listing_title}</b>
              </p>

              <p style={{ color: c.sub, marginBottom: 4 }}>
                기간 :{" "}
                <b style={{ color: c.text }}>
                  {r.check_in?.slice(0, 10)} ~ {r.check_out?.slice(0, 10)}
                </b>
              </p>

              <p style={{ color: c.sub, marginBottom: 12 }}>
                금액 :{" "}
                <b style={{ color: c.text }}>
                  {Number(r.total_price).toLocaleString()}원
                </b>
              </p>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  style={btnDelete}
                  onClick={() => deleteReservation(r.id)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* -------------------------------------------------------
            🖥 데스크탑 테이블 UI
        ------------------------------------------------------- */
        <div
          style={{
            background: c.card,
            borderRadius: 16,
            border: `1px solid ${c.line}`,
            padding: 20,
            boxShadow: c.shadow,
            overflowX: "auto",
          }}
        >
          <table
            style={{ width: "100%", minWidth: 750, borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th style={th}>ID</th>
                <th style={th}>예약자</th>
                <th style={th}>숙소</th>
                <th style={th}>체크인</th>
                <th style={th}>체크아웃</th>
                <th style={th}>금액</th>
                <th style={th}>관리</th>
              </tr>
            </thead>

            <tbody>
              {reservations.map((r) => (
                <tr key={r.id}>
                  <td style={td}>{r.id}</td>
                  <td style={td}>{r.user_name}</td>
                  <td style={td}>{r.listing_title}</td>
                  <td style={td}>{r.check_in?.slice(0, 10)}</td>
                  <td style={td}>{r.check_out?.slice(0, 10)}</td>
                  <td style={td}>{Number(r.total_price).toLocaleString()}원</td>

                  <td style={td}>
                    <button
                      style={btnDelete}
                      onClick={() => deleteReservation(r.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SellerLayout>
  );
}

export default SellerReservations;
