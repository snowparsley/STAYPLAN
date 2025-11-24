// src/components/admin/AdminLayout.js
import React, { useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      if (!mobile) setOpen(true); // PC는 항상 open = true
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleSidebar = () => setOpen((prev) => !prev);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* 항상 상단 고정 */}
      <AdminHeader onMenuToggle={toggleSidebar} />

      {isMobile ? (
        // --------- 모바일 ---------
        <div
          style={{
            width: "100%",
            height: "calc(100vh - 60px)",
            overflowY: "auto",
          }}
        >
          <AdminSidebar open={open} setOpen={setOpen} isMobile={true} />

          <div style={{ padding: "20px" }}>{children}</div>
        </div>
      ) : (
        // --------- PC ---------
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "calc(100vh - 60px)",
          }}
        >
          {/* 좌측 사이드바 (고정) */}
          <AdminSidebar open={open} setOpen={setOpen} isMobile={false} />

          {/* 우측 콘텐츠 영역 (여백 없음) */}
          <div style={{ flex: 1, overflowY: "auto", padding: "30px" }}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLayout;
