// src/pages/admin/AdminNotices.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";

function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const { token } = useAuth();
  const navigate = useNavigate();

  const isDark = theme === "dark";

  const c = {
    card: isDark ? "#34322D" : "#FFFFFF",
    text: isDark ? "#EFEDE8" : "#4A3F35",
    sub: isDark ? "#CFCAC0" : "#7A746D",
    line: isDark ? "#3F3C38" : "#E5E1D8",
  };

  const fetchNotices = async () => {
    try {
      const res = await fetch(
        "https://stayplanserver.onrender.com/api/admin/notices",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "공지사항을 불러오지 못했습니다.");
        return;
      }

      setNotices(data);
      setLoading(false);
    } catch (err) {
      alert("서버 연결 실패");
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

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

  return (
    <AdminLayout>
      <main style={{ padding: "20px", color: c.text }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>공지사항 관리</h2>

          <button
            onClick={() => navigate("/admin/notices/new")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 20px",
              background: "#A47A6B",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            <FiPlus /> 공지 작성
          </button>
        </div>

        <div
          style={{
            background: c.card,
            borderRadius: 14,
            padding: "20px 24px",
            border: `1px solid ${c.line}`,
            boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
            overflowX: "auto",
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
                minWidth: 650,
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
                          gap: 12,
                          justifyContent: "center",
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
      </main>
    </AdminLayout>
  );
}

const th = (c) => ({
  padding: "14px 0",
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

export default AdminNotices;
