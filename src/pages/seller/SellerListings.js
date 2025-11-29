import React, { useEffect, useState } from "react";
import SellerLayout from "../../components/seller/SellerLayout";
import SellerHeader from "../../components/seller/SellerHeader";
import SellerSidebar from "../../components/seller/SellerSidebar";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

function SellerListings() {
  const { token } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isDark = theme === "dark";

  const c = {
    bg: isDark ? "#1A1A18" : "#FAF7F0",
    card: isDark ? "#262522" : "#FFFFFF",
    line: isDark ? "#3F3C38" : "#E5E1D8",
    text: isDark ? "#EFEDE8" : "#4A3F35",
    sub: isDark ? "#A9A39A" : "#7A746D",
    hover: isDark ? "#373632" : "#F1EBE2",
    shadow: isDark
      ? "0 10px 22px rgba(0,0,0,0.5)"
      : "0 10px 22px rgba(0,0,0,0.08)",
  };

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // 반응형
  useEffect(() => {
    const r = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);

  // 숙소 불러오기
  const loadListings = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://stayplanserver.onrender.com/api/seller/my-listings",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (Array.isArray(data.data)) setListings(data.data);
    } catch (err) {
      console.error("숙소 불러오기 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  // 삭제
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
      if (!res.ok) return alert(data.message || "삭제 실패");

      alert("삭제 완료");
      loadListings();
    } catch (err) {
      alert("서버 오류: 삭제 실패");
    }
  };

  // ------------ 스타일 -------------
  const th = {
    padding: "14px 0",
    fontSize: 15,
    color: c.sub,
    fontWeight: 700,
  };

  const tr = {
    textAlign: "center",
    borderBottom: `1px solid ${c.line}`,
    height: 70,
    color: c.text,
  };

  const editBtn = {
    background: c.card,
    border: `1px solid ${c.line}`,
    borderRadius: 6,
    padding: "6px 10px",
    cursor: "pointer",
    color: c.text,
  };

  const deleteBtn = {
    background: "#B33A3A",
    border: "none",
    borderRadius: 6,
    padding: "6px 10px",
    cursor: "pointer",
    color: "#fff",
  };

  // ------------ JSX -------------
  return (
    <SellerLayout>
      <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 26 }}>
        내 숙소 목록
      </h1>

      {loading && <p style={{ color: c.sub }}>불러오는 중...</p>}

      {!loading && listings.length === 0 && (
        <p style={{ color: c.sub }}>등록된 숙소가 없습니다.</p>
      )}

      {/* 모바일 UI */}
      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {listings.map((l) => (
            <div
              key={l.id}
              style={{
                background: c.card,
                border: `1px solid ${c.line}`,
                borderRadius: 12,
                padding: 16,
                boxShadow: c.shadow,
              }}
            >
              <img
                src={l.images?.[0] || l.thumbnail}
                alt=""
                style={{
                  width: "100%",
                  height: 160,
                  objectFit: "cover",
                  borderRadius: 10,
                  marginBottom: 14,
                }}
              />

              <h3 style={{ margin: "0 0 8px", color: c.text }}>{l.title}</h3>

              <p style={{ margin: 0, fontSize: 14, color: c.sub }}>
                {l.location}
              </p>

              <p
                style={{
                  marginTop: 10,
                  fontWeight: 700,
                  fontSize: 18,
                  color: c.text,
                }}
              >
                {Number(l.price).toLocaleString()}원
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  justifyContent: "flex-end",
                  marginTop: 14,
                }}
              >
                <button
                  style={editBtn}
                  onClick={() => navigate(`/seller/edit/${l.id}`)}
                >
                  <FiEdit2 />
                </button>

                <button style={deleteBtn} onClick={() => deleteListing(l.id)}>
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // 데스크탑 테이블 UI
        <div
          style={{
            background: c.card,
            borderRadius: 14,
            border: `1px solid ${c.line}`,
            padding: "20px 24px",
            boxShadow: c.shadow,
            marginTop: 10,
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${c.line}` }}>
                <th style={th}>ID</th>
                <th style={th}>이미지</th>
                <th style={th}>제목</th>
                <th style={th}>가격</th>
                <th style={th}>관리</th>
              </tr>
            </thead>

            <tbody>
              {listings.map((l) => (
                <tr key={l.id} style={tr}>
                  <td>{l.id}</td>

                  <td>
                    <img
                      src={l.images?.[0] || l.thumbnail}
                      alt=""
                      style={{
                        width: 80,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 10,
                      }}
                    />
                  </td>

                  <td>{l.title}</td>

                  <td>{Number(l.price).toLocaleString()}원</td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        justifyContent: "center",
                      }}
                    >
                      <button
                        style={editBtn}
                        onClick={() => navigate(`/seller/edit/${l.id}`)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        style={deleteBtn}
                        onClick={() => deleteListing(l.id)}
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
