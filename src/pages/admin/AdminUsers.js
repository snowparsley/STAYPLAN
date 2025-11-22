import React from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { FiEdit2, FiTrash2, FiShield } from "react-icons/fi";

function AdminUsers() {
  const users = [
    {
      id: 1,
      name: "김민수",
      email: "minsu@example.com",
      joined: "2025-02-10",
      admin: true,
    },
    {
      id: 2,
      name: "이지은",
      email: "jieun@example.com",
      joined: "2025-03-01",
      admin: false,
    },
    {
      id: 3,
      name: "박성준",
      email: "sungjun@example.com",
      joined: "2025-04-15",
      admin: false,
    },
  ];

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
                  <th style={thStyle}>이름</th>
                  <th style={thStyle}>이메일</th>
                  <th style={thStyle}>가입일</th>
                  <th style={thStyle}>권한</th>
                  <th style={thStyle}>관리</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={trStyle}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.joined}</td>
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
                      <div
                        style={{
                          display: "flex",
                          gap: 12,
                          justifyContent: "center",
                        }}
                      >
                        <button style={editBtn}>
                          <FiEdit2 />
                        </button>
                        <button style={deleteBtn}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

/* 테이블 헤더 스타일 */
const thStyle = {
  padding: "14px 0",
  fontSize: 15,
  color: "#7a746d",
  fontWeight: 700,
};

/* 행 스타일 */
const trStyle = {
  textAlign: "center",
  borderBottom: "1px solid #f1eee9",
  height: 60,
};

/* 권한 배지 */
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

/* 수정 버튼 */
const editBtn = {
  background: "#fff",
  border: "1px solid #c7c2ba",
  borderRadius: 6,
  padding: "6px 10px",
  cursor: "pointer",
  color: "#6f5f55",
};

/* 삭제 버튼 */
const deleteBtn = {
  background: "#d9534f",
  border: "none",
  borderRadius: 6,
  padding: "6px 10px",
  cursor: "pointer",
  color: "#fff",
};

export default AdminUsers;
