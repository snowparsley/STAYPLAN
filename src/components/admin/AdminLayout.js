// src/components/admin/AdminLayout.js
import React, { useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { useTheme } from "../../contexts/ThemeContext";

function AdminLayout({ children }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const c = {
    bg: isDark ? "#1F1E1C" : "#F7F5EF", // ⭐ 전체 배경 색
  };

  const isBrowser = typeof window !== "undefined";
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    isBrowser ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const onResize = () => {
      if (!isBrowser) return;

      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      if (!mobile) setOpen(true);
    };

    window.addEventListener("resize", onResize);
    onResize();

    return () => window.removeEventListener("resize", onResize);
  }, [isBrowser]);

  const toggleSidebar = () => setOpen((prev) => !prev);

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        overflow: "hidden",
        background: c.bg, // ⭐ 다크모드 배경 적용
      }}
    >
      <AdminHeader onMenuToggle={toggleSidebar} />

      {isMobile ? (
        <div
          style={{
            width: "100%",
            height: "calc(100vh - 60px)",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            background: c.bg, // ⭐ 모바일도 배경 적용
          }}
        >
          <AdminSidebar open={open} setOpen={setOpen} isMobile={true} />
          <div style={{ padding: "12px 14px", boxSizing: "border-box" }}>
            {children}
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "calc(100vh - 60px)",
            overflow: "hidden",
            background: c.bg, // ⭐ 데스크탑도 배경 적용
          }}
        >
          <AdminSidebar open={open} setOpen={setOpen} isMobile={false} />

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              boxSizing: "border-box",
            }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLayout;
