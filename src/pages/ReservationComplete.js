// src/pages/ReservationComplete.js
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

function ReservationComplete() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const t = setTimeout(() => navigate("/reservations"), 1600);
    return () => clearTimeout(t);
  }, [navigate]);

  // 🎨 라이트/다크 색상 정의
  const pageBg = isDark ? "#000" : "#f7f7f7";
  const cardBg = isDark ? "#111" : "#fff";
  const cardBorder = isDark ? "#333" : "#eee";
  const cardShadow = isDark
    ? "0 12px 28px rgba(0,0,0,0.65)"
    : "0 12px 28px rgba(0,0,0,0.08)";
  const titleColor = isDark ? "#e8e8e8" : "#222";
  const textColor = isDark ? "#bbb" : "#666";
  const summaryBg = isDark ? "#1c1c1c" : "#fafafa";
  const summaryBorder = isDark ? "#444" : "#e5e5e5";

  return (
    <div
      style={{
        minHeight: "100vh", // 전체 화면을 덮어서 아래 베이지 안 보이게 수정
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: pageBg,
        transition: "background 0.3s ease, color 0.3s ease",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          background: cardBg,
          border: `1px solid ${cardBorder}`,
          borderRadius: 14,
          boxShadow: cardShadow,
          padding: "28px 36px",
          textAlign: "center",
          maxWidth: 520,
          width: "100%",
          color: titleColor,
          transition: "0.3s ease",
        }}
      >
        <div
          style={{
            fontSize: 24,
            marginBottom: 8,
            fontWeight: 700,
          }}
        >
          ✅ 예약이 완료되었습니다
        </div>

        <div style={{ color: textColor, marginBottom: 16 }}>
          곧{" "}
          <strong style={{ color: isDark ? "#fff" : "#222" }}>예약 내역</strong>{" "}
          페이지로 이동합니다.
        </div>

        {/* 요약 박스 */}
        {state?.summary && (
          <div
            style={{
              marginTop: 10,
              background: summaryBg,
              border: `1px dashed ${summaryBorder}`,
              borderRadius: 10,
              padding: "12px 14px",
              fontSize: 14,
              color: isDark ? "#ddd" : "#444",
              textAlign: "left",
              transition: "0.3s ease",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 8 }}>결제 요약</div>
            <div>
              총 금액:{" "}
              <b style={{ color: "#ff5a5f" }}>
                {state.summary.total.toLocaleString()}원
              </b>
            </div>
            <div>숙박: {state.summary.nights}박</div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default ReservationComplete;
