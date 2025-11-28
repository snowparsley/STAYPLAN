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
    bg: isDark ? "#1F1E1C" : "#FAF7F0",
    card: isDark ? "#2A2926" : "#FFFFFF",
    border: isDark ? "#4A4743" : "#E6E1D8",
    text: isDark ? "#EFEDE8" : "#4A3F35",
    sub: isDark ? "#CFCAC0" : "#7A746D",
    hover: isDark ? "#353431" : "#F1EBE2",
  };

  useEffect(() => {
    fetch("https://stayplanserver.onrender.com/api/notices")
      .then((res) => res.json())
      .then((data) => setNotices(data));
  }, []);

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
      <h2
        style={{
          fontSize: 30,
          fontWeight: 800,
          marginBottom: 26,
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
              cursor: "pointer",
              transition: "0.2s",
            }}
          >
            <h3
              style={{
                fontSize: 19,
                fontWeight: 700,
                marginBottom: 6,
                color: colors.text,
              }}
            >
              {n.title}
            </h3>

            <p style={{ color: colors.sub, fontSize: 14 }}>
              {n.created_at?.slice(0, 10)}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default NoticesPage;
