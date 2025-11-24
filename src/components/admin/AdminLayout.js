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

      // PC는 항상 열림
      if (!mobile) setOpen(true);
    };

    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleSidebar = () => setOpen((prev) => !prev);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* 상단 고정 헤더 */}
      <AdminHeader onMenuToggle={toggleSidebar} />

      {/* ------------ 모바일 레이아웃 ------------ */}
      {isMobile ? (
        <div
          style={{
            width: "100%",
            height: "calc(100vh - 60px)",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* 펼쳐지는 메뉴 */}
          <AdminSidebar open={open} setOpen={setOpen} isMobile={true} />

          {/* 본문: 여백 최소화 */}
          <div style={{ padding: "12px 14px" }}>{children}</div>
        </div>
      ) : (
        /* ------------ PC 레이아웃 ------------ */
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "calc(100vh - 60px)",
            overflow: "hidden",
          }}
        >
          {/* PC 사이드바 */}
          <AdminSidebar open={open} setOpen={setOpen} isMobile={false} />

          {/* 콘텐츠 */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "30px 40px",
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
