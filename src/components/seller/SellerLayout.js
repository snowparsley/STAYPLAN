import React from "react";
import SellerSidebar from "./SellerSidebar";
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

      {/* 우측 메인 콘텐츠 */}
      <div
        style={{
          flex: 1,
          marginLeft: 220,
          padding: "40px 32px",
          color: textColor,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default SellerLayout;
