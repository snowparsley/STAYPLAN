import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";

function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const limit = 10;

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
    shadow: isDark
      ? "0 4px 14px rgba(0,0,0,0.35)"
      : "0 4px 14px rgba(0,0,0,0.06)",
  };

  // 📌 공지사항 가져오기 (페이징)
  const fetchNotices = async () => {
    const res = await fetch(
      `https://stayplanserver.onrender.com/api/notices?page=${page}&limit=${limit}`
    );

    const data = await res.json();

    setNotices(data.data || []);
    setTotal(data.total || 0);
  };

  useEffect(() => {
    fetchNotices();
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.bg,
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

        {/* 📌 페이지네이션 */}
        <div
          style={{
            marginTop: 26,
            display: "flex",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              background: page === 1 ? colors.border : colors.card,
              border: `1px solid ${colors.border}`,
              cursor: page === 1 ? "not-allowed" : "pointer",
              color: page === 1 ? colors.sub : colors.text,
              fontWeight: 700,
            }}
          >
            ← 이전
          </button>

          <span
            style={{
              padding: "10px 20px",
              color: colors.sub,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {page} / {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              background: page >= totalPages ? colors.border : colors.card,
              border: `1px solid ${colors.border}`,
              cursor: page >= totalPages ? "not-allowed" : "pointer",
              color: page >= totalPages ? colors.sub : colors.text,
              fontWeight: 700,
            }}
          >
            다음 →
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoticesPage;
