// src/pages/admin/AdminListings.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import AdminLayout from "../../components/admin/AdminLayout";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";

function AdminListings() {
  const [listings, setListings] = useState([]);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  const navigate = useNavigate();
  const { theme } = useTheme();
  const { token } = useAuth();

  const isDark = theme === "dark";

  const c = {
    card: isDark ? "#34322D" : "#FFFFFF",
    text: isDark ? "#EFEDE8" : "#4A3F35",
    sub: isDark ? "#CFCAC0" : "#7A746D",
    line: isDark ? "#3F3C38" : "#E5E1D8",
    rowLine: isDark ? "#47433E" : "#F3EFE4",
  };

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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
      const res = await fetch(
        `https://stayplanserver.onrender.com/api/admin/listings/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "삭제 실패");
        return;
      }

      alert("숙소 삭제 완료");
      fetchListings();
    } catch (err) {
      alert("삭제 실패 (서버 오류)");
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <main style={{ padding: "20px", color: c.text }}>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 800,
            marginBottom: 30,
            color: c.text,
          }}
        >
          숙소 관리
        </h2>

        {listings.length === 0 ? (
          <p style={{ color: c.sub }}>등록된 숙소가 없습니다.</p>
        ) : isMobile ? (
          /* ===========================
             📱 모바일: 카드형 리스트
          ============================ */
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {listings.map((item) => (
              <div
                key={item.id}
                style={{
                  background: c.card,
                  borderRadius: 12,
                  padding: "14px 16px",
                  border: `1px solid ${c.line}`,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  fontSize: 14,
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
                  지역 : <span style={{ color: c.text }}>{item.location}</span>
                </div>

                <div style={{ color: c.sub }}>
                  가격(1박) :
                  <span style={{ color: c.text }}>
                    {item.price?.toLocaleString()}원
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 10,
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
          /* ===========================
             💻 데스크탑: 테이블 UI
          ============================ */
          <div
            style={{
              background: c.card,
              borderRadius: 14,
              padding: "20px 24px",
              border: `1px solid ${c.line}`,
              boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
              overflowX: "auto",
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
                  <th style={th(c)}>ID</th>
                  <th style={th(c)}>숙소명</th>
                  <th style={th(c)}>지역</th>
                  <th style={th(c)}>가격(1박)</th>
                  <th style={th(c)}>관리</th>
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
                          gap: 14,
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
    </AdminLayout>
  );
}

/* ====== 스타일 ====== */

const th = (c) => ({
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
