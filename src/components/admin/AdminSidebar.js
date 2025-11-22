import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiClipboard,
  FiUsers,
  FiLayers,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

function AdminSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { label: "대시보드", icon: <FiHome />, path: "/admin" },
    { label: "예약 관리", icon: <FiClipboard />, path: "/admin/reservations" },
    { label: "숙소 관리", icon: <FiLayers />, path: "/admin/listings" },
    { label: "유저 관리", icon: <FiUsers />, path: "/admin/users" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      style={{
        width: 240,
        height: "100vh",
        background: "#ffffff",
        borderRight: "1px solid #e5e1d8",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Top Section */}
      <div>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#4a3f35",
            marginBottom: 40,
            letterSpacing: "-0.5px",
          }}
        >
          Admin Panel
        </h2>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                background: "none",
                border: "1px solid #ece7df",
                borderRadius: 10,
                cursor: "pointer",
                color: "#5c564f",
                fontWeight: 600,
                transition: "0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f7f5ef")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          marginTop: 30,
          padding: "12px 16px",
          background: "#d9534f",
          border: "none",
          borderRadius: 10,
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <FiLogOut size={18} /> 로그아웃
      </button>
    </div>
  );
}

export default AdminSidebar;
