// src/pages/admin/AdminListings.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";

function AdminListings() {
  const [listings, setListings] = useState([]);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  const navigate = useNavigate();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const c = {
    card: isDark ? "#34322D" : "#FFFFFF",
    text: isDark ? "#EFEDE8" : "#4A3F35",
    sub: isDark ? "#CFCAC0" : "#7A746D",
    line: isDark ? "#3F3C38" : "#E8E4D9",
    rowLine: isDark ? "#47433E" : "#F3EFE4",
  };

  // 반응형: 모바일 여부 감지
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchListings = async () => {
    try {
      const res = await fetch(
        "https://stayplanserver.onrender.com/api/admin/listings",
        { credentials: "include" }
      );

      const data = await res.json();
      setListings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("숙소 불러오기 오류:", err);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const deleteListing = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await fetch(
        `https://stayplanserver.onrender.com/api/admin/listings/${id}`,
        { method: "DELETE" }
      );

      alert("숙소 삭제 완료");
      fetchListings();
    } catch (err) {
      alert("삭제 실패");
      console.error(err);
    }
  };

  return (
    <main
      style={{
        width: "100%",
        padding: "20px",
        color: c.text,
        boxSizing: "border-box",
      }}
    >
      {/* 상단 타이틀 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            fontSize: 22,
            color: c.text,
            fontWeight: 800,
            margin: 0,
          }}
        >
          숙소 관리
        </h2>
      </div>

      {/* 데이터 없을 때 처리 */}
      {listings.length === 0 ? (
        <p style={{ color: c.sub, fontSize: 14 }}>등록된 숙소가 없습니다.</p>
      ) : isMobile ? (
        // 📱 모바일: 카드형 리스트
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {listings.map((item) => (
            <div
              key={item.id}
              style={{
                background: c.card,
                borderRadius: 12,
                padding: "14px 16px",
                border: `1px solid ${c.line}`,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                fontSize: 14,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                  fontWeight: 700,
                }}
              >
                <span>
                  #{item.id} {item.title}
                </span>
              </div>

              <div style={{ color: c.sub }}>
                지역&nbsp;:&nbsp;
                <span style={{ color: c.text }}>{item.location}</span>
              </div>
              <div style={{ color: c.sub }}>
                가격(1박)&nbsp;:&nbsp;
                <span style={{ color: c.text }}>
                  {item.price?.toLocaleString()}원
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                <button
                  style={editBtn(c)}
                  onClick={() => navigate(`/admin/listings/edit/${item.id}`)}
                >
                  <FiEdit2 />
                </button>
                <button
                  style={deleteBtn}
                  onClick={() => deleteListing(item.id)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // 💻 데스크탑: 테이블 형식
        <div
          style={{
            background: c.card,
            borderRadius: 14,
            padding: "20px 24px",
            border: `1px solid ${c.line}`,
            boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <table
            style={{
              width: "100%",
              minWidth: 700,
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ borderBottom: `1px solid ${c.line}` }}>
                <th style={thStyle(c)}>ID</th>
                <th style={thStyle(c)}>숙소명</th>
                <th style={thStyle(c)}>지역</th>
                <th style={thStyle(c)}>가격(1박)</th>
                <th style={thStyle(c)}>관리</th>
              </tr>
            </thead>

            <tbody>
              {listings.map((item) => (
                <tr
                  key={item.id}
                  style={{
                    textAlign: "center",
                    borderBottom: `1px solid ${c.rowLine}`,
                    height: 60,
                    color: c.text,
                  }}
                >
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{item.location}</td>
                  <td>{item.price?.toLocaleString()}원</td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        justifyContent: "center",
                      }}
                    >
                      <button
                        style={editBtn(c)}
                        onClick={() =>
                          navigate(`/admin/listings/edit/${item.id}`)
                        }
                      >
                        <FiEdit2 />
                      </button>

                      <button
                        style={deleteBtn}
                        onClick={() => deleteListing(item.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

const thStyle = (c) => ({
  padding: "14px 0",
  fontSize: 15,
  color: c.sub,
  fontWeight: 700,
});

const editBtn = (c) => ({
  background: c.card,
  border: `1px solid ${c.line}`,
  borderRadius: 6,
  padding: "6px 10px",
  cursor: "pointer",
  color: c.text,
});

const deleteBtn = {
  background: "#B33A3A",
  border: "none",
  borderRadius: 6,
  padding: "6px 10px",
  cursor: "pointer",
  color: "#fff",
};

export default AdminListings;
