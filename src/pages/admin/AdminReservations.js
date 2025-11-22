import React from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

function AdminReservations() {
  const reservations = [
    // 추후 서버 연동 예정
    {
      id: 1,
      user: "김민수",
      listing: "서울 하우스",
      date: "2025-05-14",
      status: "완료",
    },
    {
      id: 2,
      user: "이지은",
      listing: "부산 하우스",
      date: "2025-05-20",
      status: "취소",
    },
    {
      id: 3,
      user: "박성준",
      listing: "여수 하우스",
      date: "2025-05-18",
      status: "진행중",
    },
  ];

  const statusStyle = (status) => {
    switch (status) {
      case "완료":
        return {
          background: "#c1e3c1",
          color: "#1e6b1e",
          padding: "4px 10px",
          borderRadius: 10,
          fontWeight: 700,
        };
      case "취소":
        return {
          background: "#f4c2c2",
          color: "#8b1e1e",
          padding: "4px 10px",
          borderRadius: 10,
          fontWeight: 700,
        };
      default:
        return {
          background: "#fce7c6",
          color: "#a06602",
          padding: "4px 10px",
          borderRadius: 10,
          fontWeight: 700,
        };
    }
  };

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
            예약 관리
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
                  <th style={thStyle}>유저명</th>
                  <th style={thStyle}>숙소</th>
                  <th style={thStyle}>날짜</th>
                  <th style={thStyle}>상태</th>
                  <th style={thStyle}>관리</th>
                </tr>
              </thead>

              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id} style={trStyle}>
                    <td>{r.id}</td>
                    <td>{r.user}</td>
                    <td>{r.listing}</td>
                    <td>{r.date}</td>
                    <td>
                      <span style={statusStyle(r.status)}>{r.status}</span>
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

const editBtn = {
  background: "#fff",
  border: "1px solid #c7c2ba",
  borderRadius: 6,
  padding: "6px 10px",
  cursor: "pointer",
  color: "#6f5f55",
};

const deleteBtn = {
  background: "#d9534f",
  border: "none",
  borderRadius: 6,
  padding: "6px 10px",
  cursor: "pointer",
  color: "#fff",
};

export default AdminReservations;
