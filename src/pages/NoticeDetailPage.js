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

  // 🔥 NoticesPage와 완전히 동일한 컬러셋
  const colors = {
    pageBg: isDark ? "#1F1E1C" : "#FAF7F0",
    sideBg: isDark ? "#2A2926" : "#F6F4E7",
    card: isDark ? "#34322D" : "#FFFFFF",
    border: isDark ? "#4A4743" : "rgba(0,0,0,0.06)",
    text: isDark ? "#F4F3EF" : "#2A2926",
    sub: isDark ? "#CFCAC0" : "#7A746D",
    shadow: isDark
      ? "0 4px 14px rgba(0,0,0,0.4)"
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
          color: colors.sub,
          background: colors.pageBg,
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
        background: colors.pageBg,
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* 🔥 사이드 배경 (좌우 라이트톤 유지) */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: colors.sideBg,
          zIndex: -1,
        }}
      />

      {/* 메인 컨테이너 */}
      <div style={{ maxWidth: 820, width: "100%", padding: "50px 24px" }}>
        {/* 🔙 뒤로가기 버튼 */}
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
            opacity: 0.85,
          }}
        >
          ← 공지사항 목록
        </button>

        {/* 🔥 상세 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          style={{
            background: colors.card,
            borderRadius: 16,
            padding: "34px 28px",
            border: `1px solid ${colors.border}`,
            boxShadow: colors.shadow,
          }}
        >
          {/* 제목 + 날짜 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 14,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 800,
                color: colors.text,
                lineHeight: 1.45,
                flex: 1,
              }}
            >
              {notice.title}
            </h2>

            <span
              style={{
                background: colors.dateTag,
                padding: "6px 12px",
                fontSize: 13,
                borderRadius: 8,
                color: colors.sub,
                whiteSpace: "nowrap",
                marginLeft: 12,
                marginTop: 4,
              }}
            >
              {notice.created_at?.slice(0, 10)}
            </span>
          </div>

          {/* 내용 */}
          <div
            style={{
              fontSize: 18,
              lineHeight: 1.9,
              color: colors.text,
              whiteSpace: "pre-line",
              marginTop: 12,
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
