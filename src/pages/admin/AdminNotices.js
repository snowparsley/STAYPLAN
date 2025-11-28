// === AdminNotices.js ===
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";

function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const { theme } = useTheme();
  const { token } = useAuth();
  const navigate = useNavigate();

  const isDark = theme === "dark";

  const c = {
    card: isDark ? "#2A2926" : "#FFFFFF",
    text: isDark ? "#EFEDE8" : "#4A3F35",
    sub: isDark ? "#CFCAC0" : "#7A746D",
    line: isDark ? "#3F3C38" : "#E5E1D8",
    bg: isDark ? "#1F1E1C" : "#FAF7F0",
  };

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://stayplanserver.onrender.com/api/admin/notices?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "공지사항 불러오기 실패");
        return;
      }

      setNotices(data.data);
      setTotal(data.total);
    } catch {
      alert("서버 연결 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [page]);

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
    } catch (err) {
      alert("서버 오류: 삭제 실패");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <main style={{ padding: "20px", color: c.text, background: c.bg }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>공지사항 관리</h2>

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
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          <FiPlus /> 공지 작성
        </button>
      </div>

      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {loading ? (
            <p style={{ color: c.sub }}>불러오는 중...</p>
          ) : notices.length === 0 ? (
            <p style={{ color: c.sub }}>등록된 공지사항이 없습니다.</p>
          ) : (
            notices.map((n) => (
              <div
                key={n.id}
                style={{
                  background: c.card,
                  padding: "16px 18px",
                  borderRadius: 12,
                  border: `1px solid ${c.line}`,
                }}
              >
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    marginBottom: 4,
                    color: c.text,
                  }}
                >
                  {n.title}
                </div>

                <div style={{ fontSize: 13, color: c.sub }}>
                  작성일 : {n.created_at?.slice(0, 10)}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 10,
                    marginTop: 10,
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
        <div
          style={{
            background: c.card,
            padding: "20px 24px",
            borderRadius: 14,
            border: `1px solid ${c.line}`,
          }}
        >
          {loading ? (
            <p style={{ color: c.sub }}>불러오는 중...</p>
          ) : notices.length === 0 ? (
            <p style={{ color: c.sub }}>등록된 공지사항이 없습니다.</p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 650,
              }}
            >
              <thead>
                <tr style={{ borderBottom: `1px solid ${c.line}` }}>
                  <th style={thStyle(c)}>ID</th>
                  <th style={thStyle(c)}>제목</th>
                  <th style={thStyle(c)}>작성일</th>
                  <th style={thStyle(c)}>공개 여부</th>
                  <th style={thStyle(c)}>관리</th>
                </tr>
              </thead>

              <tbody>
                {notices.map((n) => (
                  <tr key={n.id} style={trStyle(c)}>
                    <td>{n.id}</td>
                    <td>{n.title}</td>
                    <td>{n.created_at?.slice(0, 10)}</td>
                    <td>{n.visible ? "공개" : "비공개"}</td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: 12,
                          justifyContent: "center",
                        }}
                      >
                        <button
                          style={editBtn(c)}
                          onClick={() =>
                            navigate(`/admin/notices/edit/${n.id}`)
                          }
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          style={deleteBtn}
                          onClick={() => deleteNotice(n.id)}
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

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 16,
          marginTop: 26,
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

const thStyle = (c) => ({
  padding: "12px 0",
  fontSize: 15,
  color: c.sub,
  fontWeight: 700,
});

const trStyle = (c) => ({
  textAlign: "center",
  borderBottom: `1px solid ${c.line}`,
  height: 56,
  color: c.text,
});

const editBtn = (c) => ({
  background: c.card,
  border: `1px solid ${c.line}`,
  borderRadius: 6,
  padding: "6px 10px",
  cursor: "pointer",
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

const pageBtn = (disabled, c) => ({
  padding: "10px 18px",
  borderRadius: 8,
  border: `1px solid ${c.line}`,
  background: disabled ? c.line : c.card,
  cursor: disabled ? "not-allowed" : "pointer",
  color: disabled ? c.sub : c.text,
  fontWeight: 700,
});

export default AdminNotices;
