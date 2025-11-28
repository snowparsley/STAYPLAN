import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiList, FiEdit3, FiBarChart2, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

function SellerSidebar() {
  const { logout } = useAuth();
  const location = useLocation();

  const menu = [
    { name: "대시보드", icon: <FiHome />, path: "/seller/dashboard" },
    { name: "내 숙소 목록", icon: <FiList />, path: "/seller/listings" },
    { name: "숙소 등록", icon: <FiEdit3 />, path: "/seller/add-listing" },
    { name: "예약 관리", icon: <FiList />, path: "/seller/reservations" },
    { name: "매출 통계", icon: <FiBarChart2 />, path: "/seller/sales" },
  ];

  const activeStyle = {
    background: "#EFE9E0",
    fontWeight: 700,
  };

  return (
    <div
      style={{
        width: 220,
        background: "#F8F5EF",
        height: "100vh",
        borderRight: "1px solid #E5E1D8",
        padding: "24px 16px",
        boxSizing: "border-box",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <h2
        style={{
          fontSize: 22,
          fontWeight: 800,
          marginBottom: 30,
          paddingLeft: 6,
        }}
      >
        판매자 메뉴
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {menu.map((m) => (
          <Link
            key={m.path}
            to={m.path}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 14px",
              borderRadius: 10,
              textDecoration: "none",
              color: "#4A3F35",
              ...(location.pathname === m.path ? activeStyle : {}),
            }}
          >
            {m.icon}
            {m.name}
          </Link>
        ))}

        <button
          onClick={() => {
            logout();
            window.location.href = "/";
          }}
          style={{
            marginTop: 22,
            padding: "12px 14px",
            borderRadius: 10,
            border: "none",
            background: "#B33A3A",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <FiLogOut style={{ marginRight: 8 }} />
          로그아웃
        </button>
      </div>
    </div>
  );
}

export default SellerSidebar;
