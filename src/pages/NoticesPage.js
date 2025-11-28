import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";

function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const colors = {
    bg: isDark ? "#1F1E1C" : "#FAF7F0", // 전체 배경 단일색
    card: isDark ? "#2A2926" : "#FFFFFF",
    border: isDark ? "#4A4743" : "#E6E1D8",
    text: isDark ? "#EFEDE8" : "#4A3F35",
    sub: isDark ? "#CFCAC0" : "#7A746D",
    hover: isDark ? "#353431" : "#F1EBE2",
    shadow: isDark
      ? "0 4px 14px rgba(0,0,0,0.35)"
      : "0 4px 14px rgba(0,0,0,0.06)",
  };

  useEffect(() => {
    fetch("https://stayplanserver.onrender.com/api/notices")
      .then((res) => res.json())
      .then((data) => setNotices(data));
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.bg, // 전체 단일 배경
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 800,
            marginBottom: 20,
            color: colors.text,
          }}
        >
          공지사항
        </h2>

        {notices.length === 0 && (
          <p style={{ color: colors.sub }}>등록된 공지사항이 없습니다.</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {notices.map((n) => (
            <motion.div
              key={n.id}
              whileHover={{ scale: 1.01 }}
              onClick={() => navigate(`/notices/${n.id}`)}
              style={{
                padding: "22px 20px",
                borderRadius: 12,
                background: colors.card,
                border: `1px solid ${colors.border}`,
                boxShadow: colors.shadow,
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
                    fontSize: 18,
                    fontWeight: 700,
                    color: colors.text,
                    margin: 0,
                  }}
                >
                  {n.title}
                </h3>

                <span style={{ fontSize: 13, color: colors.sub }}>
                  {n.created_at?.slice(0, 10)}
                </span>
              </div>

              <p style={{ color: colors.sub, marginTop: 6, fontSize: 14 }}>
                {n.content.slice(0, 30)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NoticesPage;
