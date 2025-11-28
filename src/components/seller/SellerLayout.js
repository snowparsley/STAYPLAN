// src/components/seller/SellerLayout.js
import React from "react";
import SellerSidebar from "./SellerSidebar";
import SellerHeader from "./SellerHeader";
import { useTheme } from "../../contexts/ThemeContext";

function SellerLayout({ children }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const bgColor = isDark ? "#1A1A18" : "#FAF7F0";
  const textColor = isDark ? "#EFEDE8" : "#4A3F35";

  return (
    <div style={{ display: "flex", background: bgColor, minHeight: "100vh" }}>
      {/* 왼쪽 사이드바 */}
      <SellerSidebar />

      {/* 우측 전체 영역 */}
      <div style={{ flex: 1, marginLeft: 240 }}>
        {/* 상단 헤더 */}
        <SellerHeader />

        {/* 메인 콘텐츠 */}
        <div
          style={{
            padding: "40px 32px",
            color: textColor,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default SellerLayout;
