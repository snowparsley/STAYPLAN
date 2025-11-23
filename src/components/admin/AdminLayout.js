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

      if (!mobile) setOpen(true); // PC는 항상 열림
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleSidebar = () => setOpen((prev) => !prev);

  return (
    <div style={{ width: "100%" }}>
      {/* 항상 상단 고정 헤더 */}
      <AdminHeader onMenuToggle={toggleSidebar} />

      {/* 모바일: 사이드바는 헤더 아래로 내려감 */}
      {isMobile ? (
        <>
          <AdminSidebar open={open} setOpen={setOpen} isMobile={true} />
          <div style={{ padding: "20px" }}>{children}</div>
        </>
      ) : (
        // PC: 좌측 고정 사이드바 + 우측 내용
        <div style={{ display: "flex" }}>
          <AdminSidebar open={open} setOpen={setOpen} isMobile={false} />
          <div style={{ flex: 1, padding: "40px" }}>{children}</div>
        </div>
      )}
    </div>
  );
}

export default AdminLayout;
