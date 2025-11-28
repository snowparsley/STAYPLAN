import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2, FiShield } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const limit = 20;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const navigate = useNavigate();
  const { theme } = useTheme();
  const { token } = useAuth();

  const isDark = theme === "dark";

  const c = {
    bg: isDark ? "#1F1E1C" : "#FAF7F0",
    card: isDark ? "#2A2926" : "#FFFFFF",
    text: isDark ? "#EFEDE8" : "#4A3F35",
    sub: isDark ? "#CFCAC0" : "#7A746D",
    line: isDark ? "#3F3C38" : "#E5E1D8",
    shadow: isDark
      ? "0 6px 18px rgba(0,0,0,0.35)"
      : "0 6px 18px rgba(0,0,0,0.06)",
  };

  // 반응형 감지
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // 서버에서 유저 목록 가져오기 (페이징)
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `https://stayplanserver.onrender.com/api/admin/users?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "유저 목록을 불러오지 못했습니다.");
        setUsers([]);
      } else {
        setUsers(data.data || []);
        setTotal(data.total || 0);
      }
    } catch {
      setError("서버 연결 오류");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  // 유저 삭제
  const deleteUser = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(
        `https://stayplanserver.onrender.com/api/admin/users/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) return alert(data.message || "삭제 실패");

      alert("유저 삭제 완료");
      fetchUsers();
    } catch {
      alert("삭제 실패 (서버 오류)");
    }
  };

  // 권한 뱃지 UI
  const RoleBadge = ({ role }) => {
    const style = {
      padding: "4px 10px",
      borderRadius: 10,
      fontWeight: 700,
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      fontSize: 13,
    };

    if (role === "admin")
      return (
        <span style={{ ...style, background: "#d5e8ff", color: "#003b7a" }}>
          <FiShield /> 관리자
        </span>
      );

    if (role === "seller")
      return (
        <span style={{ ...style, background: "#ffe7c2", color: "#9a6200" }}>
          판매자
        </span>
      );

    return (
      <span style={{ ...style, background: "#ddf8d8", color: "#2d7a32" }}>
        일반
      </span>
    );
  };

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
      <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 28 }}>
        유저 관리
      </h2>

      {loading && <p style={{ color: c.sub }}>불러오는 중...</p>}
      {error && (
        <p style={{ fontSize: 15, color: "red", marginBottom: 16 }}>{error}</p>
      )}

      {!loading && !error && (
        <>
          {/* 📱 모바일 UI */}
          {isMobile ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {users.length === 0 ? (
                <p style={{ color: c.sub }}>등록된 유저가 없습니다.</p>
              ) : (
                users.map((u) => (
                  <div
                    key={u.id}
                    style={{
                      background: c.card,
                      borderRadius: 14,
                      padding: "16px 18px",
                      border: `1px solid ${c.line}`,
                      boxShadow: c.shadow,
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
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
                      <span>유저 #{u.id}</span>
                      <RoleBadge role={u.role} />
                    </div>

                    <div style={{ color: c.sub }}>
                      유저 ID :{" "}
                      <span style={{ color: c.text }}>{u.user_id}</span>
                    </div>
                    <div style={{ color: c.sub }}>
                      이름 : <span style={{ color: c.text }}>{u.name}</span>
                    </div>
                    <div style={{ color: c.sub }}>
                      이메일 : <span style={{ color: c.text }}>{u.email}</span>
                    </div>
                    <div style={{ color: c.sub }}>
                      가입일 :
                      <span style={{ color: c.text }}>
                        {u.created_at?.slice(0, 10)}
                      </span>
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
                        style={editBtn(c)}
                        onClick={() => navigate(`/admin/users/edit/${u.id}`)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        style={deleteBtn}
                        onClick={() => deleteUser(u.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* 🖥 데스크탑 UI */
            <div
              style={{
                background: c.card,
                borderRadius: 16,
                padding: "22px",
                border: `1px solid ${c.line}`,
                boxShadow: c.shadow,
              }}
            >
              {users.length === 0 ? (
                <p style={{ color: c.sub }}>등록된 유저가 없습니다.</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${c.line}` }}>
                      <th style={th(c)}>ID</th>
                      <th style={th(c)}>유저 ID</th>
                      <th style={th(c)}>이름</th>
                      <th style={th(c)}>이메일</th>
                      <th style={th(c)}>가입일</th>
                      <th style={th(c)}>권한</th>
                      <th style={th(c)}>관리</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} style={tr(c)}>
                        <td>{u.id}</td>
                        <td>{u.user_id}</td>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.created_at?.slice(0, 10)}</td>
                        <td>
                          <RoleBadge role={u.role} />
                        </td>
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
                                navigate(`/admin/users/edit/${u.id}`)
                              }
                            >
                              <FiEdit2 />
                            </button>

                            <button
                              style={deleteBtn}
                              onClick={() => deleteUser(u.id)}
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
        </>
      )}

      {/* 📌 페이지네이션 */}
      <div
        style={{
          marginTop: 26,
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

export default AdminUsers;
