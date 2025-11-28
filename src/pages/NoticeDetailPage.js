import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";

function NoticeDetailPage() {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const colors = {
    bg: isDark ? "#1F1E1C" : "#FAF7F0",
    card: isDark ? "#2A2926" : "#FFFFFF",
    border: isDark ? "#4A4743" : "#E6E1D8",
    text: isDark ? "#EFEDE8" : "#4A3F35",
    sub: isDark ? "#CFCAC0" : "#7A746D",
  };

  useEffect(() => {
    fetch(`https://stayplanserver.onrender.com/api/notices/${id}`)
      .then((res) => res.json())
      .then((data) => setNotice(data));
  }, [id]);

  if (!notice)
    return (
      <p
        style={{
          textAlign: "center",
          padding: 30,
          color: colors.sub,
          background: colors.bg,
          minHeight: "100vh",
        }}
      >
        불러오는 중...
      </p>
    );

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "40px 20px",
        background: colors.bg,
        minHeight: "100vh",
      }}
    >
      <button
        onClick={() => navigate("/notices")}
        style={{
          marginBottom: 26,
          background: "none",
          border: `1px solid ${colors.border}`,
          borderRadius: 8,
          padding: "8px 14px",
          cursor: "pointer",
          color: colors.text,
        }}
      >
        ← 목록으로 돌아가기
      </button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          background: colors.card,
          borderRadius: 14,
          padding: "28px 22px",
          border: `1px solid ${colors.border}`,
        }}
      >
        <h2
          style={{
            fontSize: 26,
            fontWeight: 800,
            marginBottom: 14,
            color: colors.text,
          }}
        >
          {notice.title}
        </h2>

        <p style={{ color: colors.sub, marginBottom: 26 }}>
          {notice.created_at?.slice(0, 10)}
        </p>

        <div
          style={{
            fontSize: 18,
            lineHeight: 1.8,
            whiteSpace: "pre-line",
            color: colors.text,
          }}
        >
          {notice.content}
        </div>
      </motion.div>
    </div>
  );
}

export default NoticeDetailPage;
