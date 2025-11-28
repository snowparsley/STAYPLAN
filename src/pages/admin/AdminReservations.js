import React, { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";

function AdminReservations() {
  // 데이터
  const [reservations, setReservations] = useState([]);
  const [total, setTotal] = useState(0);

  // 로딩/에러
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 페이징
  const [page, setPage] = useState(1);
  const limit = 10;

  // 반응형
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  const { theme } = useTheme();
  const { token } = useAuth();

  // 다크모드 색상
  const isDark = theme === "dark";

  const c = {
    bg: isDark ? "#1F1E1C" : "#FAF7F0",
    card: isDark ? "#2A2926" : "#FFFFFF",
    text: isDark ? "#EFEDE8" : "#4A3F35",
    sub: isDark ? "#CFCAC0" : "#7A746D",
    line: isDark ? "#3F3C38" : "#E5E1D8",
    shadow: isDark
      ? "0 6px 18px rgba(0,0,0,0.4)"
      : "0 6px 18px rgba(0,0,0,0.06)",
  };

  // 모바일 감지
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // 데이터 fetch
  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `https://stayplanserver.onrender.com/api/admin/reservations?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "예약 목록을 불러오지 못했습니다.");
        setReservations([]);
      } else {
        setReservations(Array.isArray(data.data) ? data.data : []);
        setTotal(data.total ?? 0);
      }
    } catch (err) {
      setError("서버 연결 오류");
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [page]);

  // 예약 삭제
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

      if (!res.ok) return alert(data.message || "삭제 실패");

      alert("예약 삭제 완료");
      fetchReservations();
    } catch {
      alert("삭제 실패 (서버 오류)");
    }
  };

  // 상태 뱃지
  const StatusBadge = ({ status }) => {
    const style = {
      padding: "4px 10px",
      borderRadius: 12,
      fontSize: 12,
      fontWeight: 700,
      textTransform: "uppercase",
    };

    if (status === "paid")
      return (
        <span style={{ ...style, background: "#d1ffe7", color: "#046b3c" }}>
          완료
        </span>
      );

    if (status === "pending")
      return (
        <span style={{ ...style, background: "#fff5c7", color: "#9a7b00" }}>
          대기
        </span>
      );

    return (
      <span style={{ ...style, background: "#ffe0e0", color: "#b52b2b" }}>
        {status}
      </span>
    );
  };

  // 페이지 개수
  const totalPages = Math.ceil(total / limit);

  return (
    <main
      style={{
        padding: "20px",
        color: c.text,
        background: c.bg,
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          fontSize: 26,
          fontWeight: 800,
          marginBottom: 30,
          color: c.text,
        }}
      >
        예약 관리
      </h2>

      {loading && <p style={{ color: c.sub }}>불러오는 중...</p>}
      {error && <p style={{ color: "red", marginBottom: 16 }}>{error}</p>}

      {!loading && !error && (
        <>
          {/* 📱 모바일 UI */}
          {isMobile ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {reservations.length === 0 ? (
                <p style={{ color: c.sub }}>예약 내역이 없습니다.</p>
              ) : (
                reservations.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      background: c.card,
                      borderRadius: 14,
                      padding: "16px 18px",
                      border: `1px solid ${c.line}`,
                      boxShadow: c.shadow,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      fontSize: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontWeight: 700,
                        marginBottom: 4,
                      }}
                    >
                      <span>예약 #{r.id}</span>
                      <StatusBadge status={r.status} />
                    </div>

                    <div style={{ color: c.sub }}>
                      유저명 : <span style={{ color: c.text }}>{r.user}</span>
                    </div>

                    <div style={{ color: c.sub }}>
                      숙소 : <span style={{ color: c.text }}>{r.listing}</span>
                    </div>

                    <div style={{ color: c.sub }}>
                      체크인 :{" "}
                      <span style={{ color: c.text }}>
                        {r.check_in?.slice(0, 10)}
                      </span>
                    </div>

                    <div style={{ color: c.sub }}>
                      금액 :{" "}
                      <span style={{ color: c.text }}>
                        {r.total_price?.toLocaleString()}원
                      </span>
                    </div>

                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
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
            /* 🖥 데스크탑 테이블 UI */
            <div
              style={{
                background: c.card,
                borderRadius: 16,
                padding: "20px 24px",
                border: `1px solid ${c.line}`,
                boxShadow: c.shadow,
                overflowX: "auto",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 700,
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
                      <td>
                        <StatusBadge status={r.status} />
                      </td>

                      <td>
                        <button
                          style={deleteBtn}
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

          {/* 📌 페이지네이션 */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              marginTop: 24,
            }}
          >
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              style={pageBtn(page === 1, c)}
            >
              ← 이전
            </button>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              style={pageBtn(page >= totalPages, c)}
            >
              다음 →
            </button>
          </div>
        </>
      )}
    </main>
  );
}

const thStyle = (c) => ({
  padding: "12px 0",
  fontSize: 15,
  color: c.sub,
  fontWeight: 700,
});

const trStyle = (c) => ({
  textAlign: "center",
  borderBottom: `1px solid ${c.line}`,
  height: 58,
  color: c.text,
});

const deleteBtn = {
  background: "#B33A3A",
  border: "none",
  borderRadius: 6,
  padding: "6px 10px",
  cursor: "pointer",
  color: "#fff",
  fontSize: 16,
};

const pageBtn = (disabled, c) => ({
  padding: "10px 18px",
  borderRadius: 8,
  border: `1px solid ${c.line}`,
  background: disabled ? c.line : c.card,
  cursor: disabled ? "not-allowed" : "pointer",
  color: disabled ? c.sub : c.text,
  fontWeight: 700,
});

export default AdminReservations;
