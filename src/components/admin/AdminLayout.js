// src/components/admin/AdminLayout.js
import React, { useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

function AdminLayout({ children }) {
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

      // PC에서는 항상 사이드바 열어두기
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
      }}
    >
      {/* 상단 헤더 (고정) */}
      <AdminHeader onMenuToggle={toggleSidebar} />

      {/* ------------ 모바일 레이아웃 ------------ */}
      {isMobile ? (
        <div
          style={{
            width: "100%",
            height: "calc(100vh - 60px)", // 헤더 높이 만큼
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* 접히는 사이드바 */}
          <AdminSidebar open={open} setOpen={setOpen} isMobile={true} />

          {/* 본문: 살짝만 여백 */}
          <div style={{ padding: "12px 14px", boxSizing: "border-box" }}>
            {children}
          </div>
        </div>
      ) : (
        /* ------------ PC 레이아웃 ------------ */
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "calc(100vh - 60px)", // 헤더 제외 영역
            overflow: "hidden",
          }}
        >
          {/* 좌측 고정 사이드바 */}
          <AdminSidebar open={open} setOpen={setOpen} isMobile={false} />

          {/* 우측 콘텐츠: 여백 없이 시작 */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              boxSizing: "border-box",
              // 여기서 padding 제거해서 사이드바 바로 옆에서 시작
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
