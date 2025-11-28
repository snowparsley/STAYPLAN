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
    text: isDark ? "#EFEDE8" : "#2A2926",
    sub: isDark ? "#CFCAC0" : "#7A746D",
    shadow: isDark
      ? "0 4px 14px rgba(0,0,0,0.35)"
      : "0 4px 14px rgba(0,0,0,0.08)",
    dateTag: isDark ? "#3B3A37" : "#EEE9E0",
  };

  useEffect(() => {
    fetch(`https://stayplanserver.onrender.com/api/notices/${id}`)
      .then((res) => res.json())
      .then((data) => setNotice(data));
  }, [id]);

  if (!notice) {
    return (
      <p
        style={{
          textAlign: "center",
          padding: 30,
          background: colors.bg,
          color: colors.sub,
          minHeight: "100vh",
        }}
      >
        불러오는 중...
      </p>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.bg,
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <button
          onClick={() => navigate("/notices")}
          style={{
            marginBottom: 24,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: colors.text,
            fontWeight: 600,
            fontSize: 15,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          ← 공지사항 목록
        </button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            background: colors.card,
            padding: "32px 26px",
            borderRadius: 16,
            border: `1px solid ${colors.border}`,
            boxShadow: colors.shadow,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 800,
                color: colors.text,
              }}
            >
              {notice.title}
            </h2>

            <span
              style={{
                background: colors.dateTag,
                padding: "6px 12px",
                borderRadius: 8,
                color: colors.sub,
              }}
            >
              {notice.created_at?.slice(0, 10)}
            </span>
          </div>

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
    </div>
  );
}

export default NoticeDetailPage;
