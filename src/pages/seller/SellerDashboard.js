import React from "react";
import SellerLayout from "../../components/seller/SellerLayout";
import { useTheme } from "../../contexts/ThemeContext";

function SellerDashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const c = {
    text: isDark ? "#EFEDE8" : "#4A3F35",
    sub: isDark ? "#A9A39A" : "#7A746D",
  };

  return (
    <SellerLayout>
      <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 22 }}>
        판매자 대시보드
      </h1>

      <div
        style={{
          background: isDark ? "#262522" : "#FFFFFF",
          borderRadius: 20,
          padding: "30px",
          border: `1px solid ${isDark ? "#3F3C38" : "#E6E1D8"}`,
          maxWidth: 600,
          boxShadow: isDark
            ? "0 12px 30px rgba(0,0,0,0.55)"
            : "0 12px 30px rgba(0,0,0,0.08)",
        }}
      >
        <p style={{ fontSize: 18, marginBottom: 10, color: c.text }}>
          🎉 판매자님 환영합니다!
        </p>

        <p style={{ fontSize: 15, lineHeight: "1.6", color: c.sub }}>
          왼쪽 메뉴에서 숙소를 등록하거나 수정할 수 있습니다.
          <br />
          또한 예약 현황을 확인하고 관리할 수 있습니다.
        </p>
      </div>
    </SellerLayout>
  );
}

export default SellerDashboard;
