// src/pages/ReservationComplete.js
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function ReservationComplete() {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate("/reservations"), 1600);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: 14,
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          padding: "28px 36px",
          textAlign: "center",
          maxWidth: 520,
          width: "100%",
        }}
      >
        <div style={{ fontSize: 24, marginBottom: 8 }}>
          ✅ 예약이 완료되었습니다
        </div>
        <div style={{ color: "#666", marginBottom: 16 }}>
          곧 <strong>예약 내역</strong> 페이지로 이동합니다.
        </div>

        {state?.summary && (
          <div
            style={{
              marginTop: 10,
              background: "#fafafa",
              border: "1px dashed #e5e5e5",
              borderRadius: 10,
              padding: "12px 14px",
              fontSize: 14,
              color: "#444",
              textAlign: "left",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 8 }}>결제 요약</div>
            <div>
              총 금액: <b>{state.summary.total.toLocaleString()}원</b>
            </div>
            <div>숙박: {state.summary.nights}박</div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default ReservationComplete;
