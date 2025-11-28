import React, { useEffect, useState } from "react";
import SellerLayout from "../../components/seller/SellerLayout";
import SellerHeader from "../../components/seller/SellerHeader";
import SellerSidebar from "../../components/seller/SellerSidebar";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function SellerListings() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const c = {
    bg: isDark ? "#1A1A18" : "#FAF7F0",
    card: isDark ? "#262522" : "#FFFFFF",
    text: isDark ? "#EFEDE8" : "#4A3F35",
    sub: isDark ? "#A9A39A" : "#7A746D",
    line: isDark ? "#3F3C38" : "#E5E1D8",
    shadow: isDark
      ? "0 10px 22px rgba(0,0,0,0.45)"
      : "0 10px 22px rgba(0,0,0,0.06)",
  };

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // 반응형 체크
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ----------------------------------------------------
      숙소 목록 불러오기
  ---------------------------------------------------- */
  const loadListings = async () => {
    try {
      const res = await fetch(
        "https://stayplanserver.onrender.com/api/seller/my-listings",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setListings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("숙소 목록 불러오기 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  /* ----------------------------------------------------
      숙소 삭제
  ---------------------------------------------------- */
  const deleteListing = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(
        `https://stayplanserver.onrender.com/api/seller/listing/${id}`,
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

      alert("삭제 완료");
      loadListings();
    } catch (err) {
      alert("서버 오류: 삭제 실패");
    }
  };

  /* ----------------------------------------------------
      스타일 공통
  ---------------------------------------------------- */
  const tableStyle = {
    width: "100%",
    minWidth: 700,
    borderCollapse: "collapse",
  };

  const th = {
    padding: "14px 0",
    fontSize: 15,
    color: c.sub,
    fontWeight: 700,
    borderBottom: `1px solid ${c.line}`,
  };

  const td = {
    padding: "18px 10px",
    textAlign: "center",
    fontSize: 15,
    color: c.text,
    borderBottom: `1px solid ${c.line}`,
  };

  const btnEdit = {
    background: c.card,
    border: `1px solid ${c.line}`,
    padding: "6px 10px",
    borderRadius: 8,
    cursor: "pointer",
    color: c.text,
  };

  const btnDelete = {
    background: "#B33A3A",
    border: "none",
    padding: "6px 10px",
    borderRadius: 8,
    cursor: "pointer",
    color: "#fff",
  };

  /* ----------------------------------------------------
      JSX
  ---------------------------------------------------- */
  return (
    <SellerLayout>
      <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 26 }}>
        내 숙소 목록
      </h1>

      {loading ? (
        <p style={{ color: c.sub }}>불러오는 중...</p>
      ) : listings.length === 0 ? (
        <p style={{ color: c.sub }}>등록된 숙소가 없습니다.</p>
      ) : isMobile ? (
        /* ===========================
            📱 모바일 카드 UI
        =========================== */
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {listings.map((item) => (
            <div
              key={item.id}
              style={{
                background: c.card,
                borderRadius: 14,
                border: `1px solid ${c.line}`,
                padding: 16,
                boxShadow: c.shadow,
              }}
            >
              <img
                src={JSON.parse(item.images || "[]")[0] || ""}
                alt=""
                style={{
                  width: "100%",
                  height: 140,
                  borderRadius: 10,
                  objectFit: "cover",
                  marginBottom: 12,
                }}
              />

              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                {item.title}
              </h3>

              <p style={{ color: c.sub, marginTop: 6, fontSize: 14 }}>
                {item.location}
              </p>

              <p style={{ fontWeight: 700, marginTop: 6 }}>
                {item.price.toLocaleString()}원
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  marginTop: 14,
                }}
              >
                <button
                  style={btnEdit}
                  onClick={() => navigate(`/seller/edit/${item.id}`)}
                >
                  <FiEdit2 />
                </button>

                <button
                  style={btnDelete}
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
            🖥 데스크탑 테이블 UI
        =========================== */
        <div
          style={{
            background: c.card,
            borderRadius: 16,
            border: `1px solid ${c.line}`,
            padding: 20,
            boxShadow: c.shadow,
            overflowX: "auto",
          }}
        >
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={th}>ID</th>
                <th style={th}>이미지</th>
                <th style={th}>제목</th>
                <th style={th}>지역</th>
                <th style={th}>가격</th>
                <th style={th}>관리</th>
              </tr>
            </thead>

            <tbody>
              {listings.map((item) => (
                <tr key={item.id}>
                  <td style={td}>{item.id}</td>

                  <td style={td}>
                    <img
                      src={JSON.parse(item.images || "[]")[0] || ""}
                      alt=""
                      style={{
                        width: 75,
                        height: 55,
                        borderRadius: 10,
                        objectFit: "cover",
                      }}
                    />
                  </td>

                  <td style={td}>{item.title}</td>

                  <td style={td}>{item.location}</td>

                  <td style={td}>{Number(item.price).toLocaleString()}원</td>

                  <td style={td}>
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        justifyContent: "center",
                      }}
                    >
                      <button
                        style={btnEdit}
                        onClick={() => navigate(`/seller/edit/${item.id}`)}
                      >
                        <FiEdit2 />
                      </button>

                      <button
                        style={btnDelete}
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
    </SellerLayout>
  );
}

export default SellerListings;
