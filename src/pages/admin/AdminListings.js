import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";

function AdminListings() {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const c = {
    bg: isDark ? "#2A2926" : "#F7F5EF",
    card: isDark ? "#34322D" : "#FFFFFF",
    text: isDark ? "#EFEDE8" : "#4A3F35",
    sub: isDark ? "#CFCAC0" : "#7A746D",
    line: isDark ? "#3F3C38" : "#E8E4D9",
    rowLine: isDark ? "#47433E" : "#F3EFE4",
  };

  const fetchListings = async () => {
    try {
      const res = await fetch(
        "https://stayplanserver.onrender.com/api/admin/listings",
        { credentials: "include" }
      );

      const data = await res.json();
      setListings(data);
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
    <div style={{ display: "flex", height: "100vh", background: c.bg }}>
      <AdminSidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <AdminHeader />

        <main style={{ padding: "40px 50px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 30,
            }}
          >
            <h2 style={{ fontSize: 24, color: c.text, fontWeight: 800 }}>
              숙소 관리
            </h2>
          </div>

          <div
            style={{
              background: c.card,
              borderRadius: 14,
              padding: "20px 24px",
              border: `1px solid ${c.line}`,
              boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
              overflowX: "auto", // ⭐ 모바일에서 가로 스크롤
              WebkitOverflowScrolling: "touch",
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth: 700, // ⭐ 테이블 깨짐 방지
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
        </main>
      </div>
    </div>
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
