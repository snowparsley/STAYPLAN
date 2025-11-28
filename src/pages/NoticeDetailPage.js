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
    shadow: isDark
      ? "0 6px 18px rgba(0,0,0,0.35)"
      : "0 6px 18px rgba(0,0,0,0.06)",
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
          color: colors.sub,
          background: colors.bg,
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
        maxWidth: 800,
        margin: "0 auto",
        padding: "40px 20px",
        background: colors.bg,
        minHeight: "100vh",
      }}
    >
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => navigate("/notices")}
        style={{
          marginBottom: 26,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: colors.text,
          fontSize: 15,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        ← 공지사항 목록
      </button>

      {/* 상세 카드 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          background: colors.card,
          borderRadius: 16,
          padding: "32px 26px",
          border: `1px solid ${colors.border}`,
          boxShadow: colors.shadow,
        }}
      >
        {/* 제목 / 날짜 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 16,
          }}
        >
          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              flex: 1,
              color: colors.text,
              lineHeight: 1.4,
            }}
          >
            {notice.title}
          </h2>

          <span
            style={{
              fontSize: 14,
              color: colors.sub,
              whiteSpace: "nowrap",
              paddingTop: 6,
            }}
          >
            {notice.created_at?.slice(0, 10)}
          </span>
        </div>

        {/* 본문 */}
        <div
          style={{
            fontSize: 18,
            lineHeight: 1.9,
            whiteSpace: "pre-line",
            color: colors.text,
            marginTop: 8,
          }}
        >
          {notice.content}
        </div>
      </motion.div>
    </div>
  );
}

export default NoticeDetailPage;
