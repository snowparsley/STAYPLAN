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
      if (!mobile) setOpen(true); // 데스크탑에서는 항상 열림
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleSidebar = () => setOpen((prev) => !prev);

  return (
    <div style={{ display: "flex", width: "100%" }}>
      {/* 사이드바 */}
      <AdminSidebar open={open} setOpen={setOpen} />

      {/* 메인 영역 */}
      <div style={{ flex: 1, minHeight: "100vh" }}>
        <AdminHeader onMenuToggle={toggleSidebar} />
        <div style={{ padding: "24px" }}>{children}</div>
      </div>
    </div>
  );
}

export default AdminLayout;
