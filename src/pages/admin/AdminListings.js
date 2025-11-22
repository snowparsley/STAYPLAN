import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

function AdminListings() {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  /* =============================
        1) 숙소 목록 불러오기
  ============================= */
  const fetchListings = async () => {
    try {
      const res = await fetch(
        "https://stayplanserver.onrender.com/api/admin/listings",
        {
          credentials: "include",
        }
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

  /* =============================
        2) 삭제 기능
  ============================= */
  const deleteListing = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await fetch(
        `https://stayplanserver.onrender.com/api/admin/listings/${id}`,
        {
          method: "DELETE",
        }
      );

      alert("숙소 삭제 완료");
      fetchListings();
    } catch (err) {
      alert("삭제 실패");
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#F4F4F4" }}>
      <AdminSidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <AdminHeader />

        <main style={{ padding: "40px 50px" }}>
          {/* 상단 제목 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 30,
            }}
          >
            <h2 style={{ fontSize: 24, color: "#4a3f35", fontWeight: 800 }}>
              숙소 관리
            </h2>
          </div>

          {/* 숙소 리스트 테이블 */}
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: "20px 24px",
              border: "1px solid #e5e1d8",
              boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e1d8" }}>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>숙소명</th>
                  <th style={thStyle}>지역</th>
                  <th style={thStyle}>가격(1박)</th>
                  <th style={thStyle}>관리</th>
                </tr>
              </thead>

              <tbody>
                {listings.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      textAlign: "center",
                      borderBottom: "1px solid #f1eee9",
                      height: 60,
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
                        {/* 수정 버튼 */}
                        <button
                          style={editBtn}
                          onClick={() =>
                            navigate(`/admin/listings/edit/${item.id}`)
                          }
                        >
                          <FiEdit2 />
                        </button>

                        {/* 삭제 버튼 */}
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

/* 스타일 */
const thStyle = {
  padding: "14px 0",
  fontSize: 15,
  color: "#7a746d",
  fontWeight: 700,
};

const editBtn = {
  background: "#fff",
  border: "1px solid #c7c2ba",
  borderRadius: 6,
  padding: "6px 10px",
  cursor: "pointer",
  color: "#6f5f55",
};

const deleteBtn = {
  background: "#B33A3A",
  border: "none",
  borderRadius: 6,
  padding: "6px 10px",
  cursor: "pointer",
  color: "#fff",
};

export default AdminListings;
