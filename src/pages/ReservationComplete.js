import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

function ReservationComplete() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const t = setTimeout(() => navigate("/reservations"), 1600);
    return () => clearTimeout(t);
  }, [navigate]);

  const pageBg = isDark ? "#1F1E1C" : "#FAF7F0"; // 전체 배경
  const cardBg = isDark ? "#2A2926" : "#FFFFFF"; // 카드 배경
  const lineColor = isDark ? "#4A4743" : "#E6E1D8"; // 카드 선
  const titleColor = isDark ? "#E3DFD7" : "#46423C"; // 메인 텍스트
  const textColor = isDark ? "#A9A39A" : "#7A746D"; // 서브 텍스트

  const shadow = isDark
    ? "0 12px 28px rgba(0,0,0,0.45)"
    : "0 12px 28px rgba(0,0,0,0.08)";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: pageBg,
        transition: "background 0.3s ease, color 0.3s ease",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: cardBg,
          border: `1px solid ${lineColor}`,
          borderRadius: 16,
          boxShadow: shadow,
          padding: "34px 42px",
          textAlign: "center",
          maxWidth: 520,
          width: "100%",
          color: titleColor,
        }}
      >
        <div
          style={{
            fontSize: 26,
            marginBottom: 10,
            fontWeight: 700,
            color: titleColor,
          }}
        >
          ✅ 예약이 완료되었습니다
        </div>

        <div style={{ color: textColor, marginTop: 6, fontSize: 15 }}>
          곧 <strong style={{ color: titleColor }}>예약 내역</strong> 페이지로
          이동합니다.
        </div>
      </motion.div>
    </div>
  );
}

export default ReservationComplete;
