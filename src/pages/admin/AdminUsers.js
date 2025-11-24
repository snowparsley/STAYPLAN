// src/pages/admin/AdminUsers.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2, FiShield } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import AdminLayout from "../../components/admin/AdminLayout";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  const navigate = useNavigate();
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

  /* 화면 크기 감지 */
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* 유저 목록 불러오기 */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "https://stayplanserver.onrender.com/api/admin/users",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "유저 목록을 불러오지 못했습니다.");
        setUsers([]);
      } else {
        setUsers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError("서버 연결 오류");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* 유저 삭제 */
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

  return (
    <AdminLayout>
      <main style={{ padding: "20px", color: c.text }}>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 800,
            marginBottom: 30,
            color: c.text,
          }}
        >
          유저 관리
        </h2>

        {loading && <p style={{ color: c.sub }}>불러오는 중...</p>}
        {error && (
          <p style={{ fontSize: 16, color: "red", marginBottom: 20 }}>
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            {/* 📱 모바일: 카드형 UI */}
            {isMobile ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {users.length === 0 ? (
                  <p style={{ color: c.sub }}>등록된 유저가 없습니다.</p>
                ) : (
                  users.map((u) => (
                    <div
                      key={u.id}
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
                          marginBottom: 6,
                          fontWeight: 700,
                        }}
                      >
                        <span>유저 #{u.id}</span>
                        {u.admin ? (
                          <span style={adminBadge}>
                            <FiShield /> 관리자
                          </span>
                        ) : (
                          <span style={userBadge}>일반</span>
                        )}
                      </div>

                      <div style={{ color: c.sub }}>
                        ID : <span style={{ color: c.text }}>{u.user_id}</span>
                      </div>
                      <div style={{ color: c.sub }}>
                        이름 : <span style={{ color: c.text }}>{u.name}</span>
                      </div>
                      <div style={{ color: c.sub }}>
                        이메일 :{" "}
                        <span style={{ color: c.text }}>{u.email}</span>
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
                          marginTop: 10,
                          gap: 10,
                        }}
                      >
                        <button
                          style={editBtn}
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
              /* 💻 데스크탑: 테이블 UI */
              <div
                style={{
                  background: c.card,
                  borderRadius: 14,
                  padding: "20px 24px",
                  border: `1px solid ${c.line}`,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                }}
              >
                {users.length === 0 ? (
                  <p style={{ color: c.sub }}>등록된 유저가 없습니다.</p>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${c.line}` }}>
                        <th style={thStyle(c)}>ID</th>
                        <th style={thStyle(c)}>유저 ID</th>
                        <th style={thStyle(c)}>이름</th>
                        <th style={thStyle(c)}>이메일</th>
                        <th style={thStyle(c)}>가입일</th>
                        <th style={thStyle(c)}>권한</th>
                        <th style={thStyle(c)}>관리</th>
                      </tr>
                    </thead>

                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} style={trStyle(c)}>
                          <td>{u.id}</td>
                          <td>{u.user_id}</td>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td>{u.created_at?.slice(0, 10)}</td>
                          <td>
                            {u.admin ? (
                              <span style={adminBadge}>
                                <FiShield /> 관리자
                              </span>
                            ) : (
                              <span style={userBadge}>일반</span>
                            )}
                          </td>

                          <td>
                            <div style={{ display: "flex", gap: 12 }}>
                              <button
                                style={editBtn}
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
      </main>
    </AdminLayout>
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

const adminBadge = {
  background: "#d5e8ff",
  color: "#003b7a",
  padding: "4px 10px",
  borderRadius: 10,
  fontWeight: 700,
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
};

const userBadge = {
  background: "#EFE8D8",
  color: "#6A645B",
  padding: "4px 10px",
  borderRadius: 10,
  fontWeight: 700,
};

const editBtn = {
  background: "#fff",
  border: "1px solid #c7c2ba",
  borderRadius: 6,
  padding: "6px 10px",
  cursor: "pointer",
  color: "#6f5f55",
};

const deleteBtn = {
  background: "#B33A3A",
  border: "none",
  borderRadius: 6,
  padding: "6px 10px",
  cursor: "pointer",
  color: "#fff",
};

export default AdminUsers;
