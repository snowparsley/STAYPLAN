import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";

function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [page, setPage] = useState(1);
  const limit = 15;

  const { theme } = useTheme();
  const { token } = useAuth();
  const navigate = useNavigate();

  const isDark = theme === "dark";

  const c = {
    bg: isDark ? "#1F1E1C" : "#FAF7F0",
    card: isDark ? "#2A2926" : "#FFFFFF",
    line: isDark ? "#3F3C38" : "#E5E1D8",
    text: isDark ? "#EFEDE8" : "#4A3F35",
    sub: isDark ? "#CFCAC0" : "#7A746D",
    shadow: isDark
      ? "0 6px 18px rgba(0,0,0,0.4)"
      : "0 6px 18px rgba(0,0,0,0.06)",
  };

  // 반응형 감지
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // 공지 가져오기
  const fetchNotices = async () => {
    try {
      const res = await fetch(
        `https://stayplanserver.onrender.com/api/admin/notices?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "공지사항을 불러오지 못했습니다.");
        return;
      }

      setNotices(data.data || []);
      setTotal(data.total || 0);
      setLoading(false);
    } catch (err) {
      alert("서버 연결 실패");
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [page]);

  // 삭제
  const deleteNotice = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(
        `https://stayplanserver.onrender.com/api/admin/notices/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) return alert(data.message || "삭제 실패");

      alert("삭제 완료");
      fetchNotices();
    } catch {
      alert("서버 오류: 삭제 실패");
    }
  };

  // 총 페이지 수 계산
  const totalPages = Math.ceil(total / limit);

  return (
    <main
      style={{
        padding: "20px",
        background: c.bg,
        color: c.text,
        minHeight: "100vh",
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: 26, fontWeight: 800 }}>공지사항 관리</h2>

        <button
          onClick={() => navigate("/admin/notices/new")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 18px",
            background: "#A47A6B",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: c.shadow,
          }}
        >
          <FiPlus /> 새 공지
        </button>
      </div>

      {/* 📱 모바일 UI */}
      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {loading ? (
            <p style={{ color: c.sub }}>불러오는 중...</p>
          ) : notices.length === 0 ? (
            <p style={{ color: c.sub }}>등록된 공지가 없습니다.</p>
          ) : (
            notices.map((n) => (
              <div
                key={n.id}
                style={{
                  background: c.card,
                  borderRadius: 14,
                  padding: "16px 18px",
                  border: `1px solid ${c.line}`,
                  boxShadow: c.shadow,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div style={{ fontSize: 17, fontWeight: 700 }}>{n.title}</div>

                <div style={{ color: c.sub, fontSize: 13 }}>
                  작성일: {n.created_at?.slice(0, 10)}
                </div>

                <div style={{ color: c.sub, fontSize: 13 }}>
                  상태:{" "}
                  <span style={{ color: c.text }}>
                    {n.visible ? "공개" : "비공개"}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 10,
                  }}
                >
                  <button
                    onClick={() => navigate(`/admin/notices/edit/${n.id}`)}
                    style={editBtn(c)}
                  >
                    <FiEdit2 />
                  </button>

                  <button onClick={() => deleteNotice(n.id)} style={deleteBtn}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        // 🖥 데스크탑 UI
        <div
          style={{
            background: c.card,
            borderRadius: 16,
            padding: "22px",
            border: `1px solid ${c.line}`,
            boxShadow: c.shadow,
          }}
        >
          {loading ? (
            <p style={{ color: c.sub }}>불러오는 중...</p>
          ) : notices.length === 0 ? (
            <p style={{ color: c.sub }}>등록된 공지가 없습니다.</p>
          ) : (
            <table
              style={{
                width: "100%",
                minWidth: 700,
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ borderBottom: `1px solid ${c.line}` }}>
                  <th style={th(c)}>ID</th>
                  <th style={th(c)}>제목</th>
                  <th style={th(c)}>작성일</th>
                  <th style={th(c)}>공개 여부</th>
                  <th style={th(c)}>관리</th>
                </tr>
              </thead>

              <tbody>
                {notices.map((n) => (
                  <tr key={n.id} style={tr(c)}>
                    <td>{n.id}</td>
                    <td>{n.title}</td>
                    <td>{n.created_at?.slice(0, 10)}</td>
                    <td>{n.visible ? "공개" : "비공개"}</td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 12,
                        }}
                      >
                        <button
                          onClick={() =>
                            navigate(`/admin/notices/edit/${n.id}`)
                          }
                          style={editBtn(c)}
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          onClick={() => deleteNotice(n.id)}
                          style={deleteBtn}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* 📌 페이지네이션 */}
      <div
        style={{
          marginTop: 25,
          display: "flex",
          justifyContent: "center",
          gap: 16,
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
    </main>
  );
}

const th = (c) => ({
  padding: "12px 0",
  fontSize: 15,
  color: c.sub,
  fontWeight: 700,
});

const tr = (c) => ({
  textAlign: "center",
  borderBottom: `1px solid ${c.line}`,
  height: 56,
  color: c.text,
});

const editBtn = (c) => ({
  background: c.card,
  border: `1px solid ${c.line}`,
  borderRadius: 8,
  padding: "7px 11px",
  cursor: "pointer",
  color: c.text,
  fontSize: 16,
  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
});

const deleteBtn = {
  background: "#B33A3A",
  border: "none",
  borderRadius: 8,
  padding: "7px 11px",
  cursor: "pointer",
  color: "#fff",
  fontSize: 16,
};

const pageBtn = (disabled, c) => ({
  padding: "10px 20px",
  borderRadius: 10,
  background: disabled ? c.line : c.card,
  border: `1px solid ${c.line}`,
  cursor: disabled ? "not-allowed" : "pointer",
  color: disabled ? c.sub : c.text,
  fontWeight: 700,
});

export default AdminNotices;
