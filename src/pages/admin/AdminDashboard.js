import React from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminCard from "../../components/admin/AdminCard";

import { FiUsers, FiClipboard, FiDollarSign } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", height: "100vh", background: "#F4F4F4" }}>
      {/* 사이드바 */}
      <AdminSidebar />

      {/* 메인 영역 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* 상단 헤더 */}
        <AdminHeader />

        {/* 페이지 내용 */}
        <main style={{ padding: "40px 50px" }}>
          {/* 대시보드 카드 3개 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
              marginBottom: 50,
            }}
          >
            <AdminCard title="총 유저" value="—" icon={<FiUsers />} />
            <AdminCard title="총 예약" value="—" icon={<FiClipboard />} />
            <AdminCard title="총 매출" value="—" icon={<FiDollarSign />} />
          </div>

          {/* 빠른 메뉴 */}
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              marginBottom: 20,
              color: "#4a3f35",
            }}
          >
            빠른 메뉴
          </h2>

          <div
            style={{
              display: "flex",
              gap: 18,
              flexWrap: "wrap",
            }}
          >
            <button
              style={quickBtn}
              onClick={() => navigate("/admin/listings")}
            >
              숙소 등록
            </button>

            <button
              style={quickBtn}
              onClick={() => navigate("/admin/reservations")}
            >
              예약 현황
            </button>

            <button style={quickBtn} onClick={() => navigate("/admin/users")}>
              유저 리스트
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

const quickBtn = {
  padding: "14px 26px",
  background: "#A47A6B",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
  transition: "0.25s ease",
};

export default AdminDashboard;
