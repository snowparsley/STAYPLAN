import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";

function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  // 🔥 새롭게 조정된 컬러셋 (밸런스 완벽)
  const colors = {
    pageBg: isDark ? "#1F1E1C" : "#FAF7F0", // 전체 배경
    sideBg: isDark ? "#2A2926" : "#F6F4E7", // 좌우 여백
    card: isDark ? "#34322D" : "#FFFFFF",
    border: isDark ? "#4A4743" : "rgba(0,0,0,0.06)",
    text: isDark ? "#F4F3EF" : "#2A2926",
    sub: isDark ? "#CFCAC0" : "#7A746D",
    dateTag: isDark ? "#3B3A37" : "#EEE9E0",
  };

  useEffect(() => {
    fetch("https://stayplanserver.onrender.com/api/notices")
      .then((res) => res.json())
      .then((data) => setNotices(data));
  }, []);

  return (
    <div
      style={{
        background: colors.pageBg,
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* 🔥 좌우 사이드 여백 색 맞추기 */}
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

      {/* 🔥 메인 컨텐츠 */}
      <div style={{ maxWidth: 820, width: "100%", padding: "50px 24px" }}>
        <h2
          style={{
            fontSize: 32,
            fontWeight: 800,
            marginBottom: 30,
            color: colors.text,
          }}
        >
          공지사항
        </h2>

        {notices.length === 0 && (
          <p style={{ color: colors.sub }}>등록된 공지사항이 없습니다.</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {notices.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.15 }}
                onClick={() => navigate(`/notices/${n.id}`)}
                style={{
                  background: colors.card,
                  padding: "24px 26px",
                  borderRadius: 14,
                  border: `1px solid ${colors.border}`,
                  boxShadow: isDark
                    ? "0 2px 8px rgba(0,0,0,0.35)"
                    : "0 3px 10px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 20,
                      fontWeight: 700,
                      color: colors.text,
                    }}
                  >
                    {n.title}
                  </h3>

                  <span
                    style={{
                      background: colors.dateTag,
                      color: colors.sub,
                      padding: "4px 10px",
                      borderRadius: 8,
                      fontSize: 13,
                    }}
                  >
                    {n.created_at?.slice(0, 10)}
                  </span>
                </div>

                <p
                  style={{
                    marginTop: 12,
                    fontSize: 15,
                    color: colors.sub,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {n.content}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NoticesPage;
