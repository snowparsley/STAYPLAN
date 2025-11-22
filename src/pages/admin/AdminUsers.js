import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { FiEdit2, FiTrash2, FiShield } from "react-icons/fi";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // DB에서 유저 목록 불러오기
  useEffect(() => {
    fetch("https://stayplanserver.onrender.com/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.users);
        } else {
          setError("유저 정보를 불러오지 못했습니다.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("서버 연결 오류");
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#F4F4F4" }}>
      <AdminSidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <AdminHeader />

        <main style={{ padding: "40px 50px" }}>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#4a3f35",
              marginBottom: 30,
            }}
          >
            유저 관리
          </h2>

          {/* 로딩 상태 */}
          {loading && (
            <p style={{ fontSize: 18, color: "#7a746d" }}>불러오는 중...</p>
          )}

          {/* 에러 메시지 */}
          {error && (
            <p style={{ fontSize: 18, color: "red", marginBottom: 20 }}>
              {error}
            </p>
          )}

          {/*  유저 테이블 */}
          {!loading && !error && (
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: "20px 24px",
                border: "1px solid #e5e1d8",
                boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e5e1d8" }}>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>유저 ID</th>
                    <th style={thStyle}>이름</th>
                    <th style={thStyle}>이메일</th>
                    <th style={thStyle}>가입일</th>
                    <th style={thStyle}>권한</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={trStyle}>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* 스타일 */
const thStyle = {
  padding: "14px 0",
  fontSize: 15,
  color: "#7a746d",
  fontWeight: 700,
};

const trStyle = {
  textAlign: "center",
  borderBottom: "1px solid #f1eee9",
  height: 60,
};

const adminBadge = {
  background: "#cce5ff",
  color: "#004085",
  padding: "4px 10px",
  borderRadius: 10,
  fontWeight: 700,
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
};

const userBadge = {
  background: "#f7f5ef",
  color: "#6a645b",
  padding: "4px 10px",
  borderRadius: 10,
  fontWeight: 700,
};

export default AdminUsers;
