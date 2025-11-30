import React, { useEffect, useState } from "react";
import SellerLayout from "../../components/seller/SellerLayout";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useParams, useNavigate } from "react-router-dom";

/* 공통 라벨 */
function FieldLabel({ color, text }) {
  return (
    <p
      style={{
        margin: "10px 0 4px",
        fontSize: 13,
        fontWeight: 600,
        color,
      }}
    >
      {text}
    </p>
  );
}

/* input 스타일 */
const inputStyle = (c) => ({
  width: "100%",
  padding: "12px 14px",
  background: c.input,
  borderRadius: 12,
  border: `1px solid ${c.border}`,
  marginTop: 2,
  marginBottom: 12,
  color: c.text,
  fontSize: 14,
  boxSizing: "border-box",
});

function SellerEditListing() {
  const { token } = useAuth();
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();

  const isDark = theme === "dark";

  const c = {
    bg: isDark ? "#1A1A18" : "#FAF7F0",
    card: isDark ? "#262522" : "#FFFFFF",
    border: isDark ? "#3F3C38" : "#E5E1D8",
    text: isDark ? "#EFEDE8" : "#4A3F35",
    sub: isDark ? "#A9A39A" : "#7A746D",
    input: isDark ? "#34322E" : "#F8F5EF",
    btn: "#8C6A4A",
  };

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState([""]);

  /** 이미지 추가 */
  const addImageField = () => setImages((prev) => [...prev, ""]);

  /** 이미지 업데이트 */
  const updateImage = (index, value) => {
    setImages((prev) => {
      const arr = [...prev];
      arr[index] = value;
      return arr;
    });
  };

  /* -------------------------------------------------------
      1) 기존 숙소 데이터 불러오기
  ------------------------------------------------------- */
  const loadDetail = async () => {
    try {
      const res = await fetch(
        `https://stayplanserver.onrender.com/api/seller/listing/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "숙소 정보를 불러올 수 없습니다.");
        return;
      }

      setTitle(data.title);
      setPrice(data.price);
      setLocation(data.location);
      setDesc(data.description);
      setImages(data.images && Array.isArray(data.images) ? data.images : [""]);
    } catch (err) {
      alert("서버 오류: 상세 정보 로딩 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [id]);

  /* -------------------------------------------------------
      2) 수정 요청
  ------------------------------------------------------- */
  const handleUpdate = async () => {
    if (!title || !price || !location || !desc) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const body = {
      title,
      description: desc,
      price,
      location,
      images: images.filter((v) => v.trim() !== ""),
    };

    try {
      const res = await fetch(
        `https://stayplanserver.onrender.com/api/seller/listing/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "수정 실패");
        return;
      }

      alert("숙소가 성공적으로 수정되었습니다!");
      navigate("/seller/listings");
    } catch (err) {
      console.error(err);
      alert("서버 오류 발생");
    }
  };

  if (loading) {
    return (
      <SellerLayout>
        <p style={{ color: c.sub }}>불러오는 중...</p>
      </SellerLayout>
    );
  }

  /* -------------------------------------------------------
      JSX
  ------------------------------------------------------- */
  return (
    <SellerLayout>
      <div style={{ maxWidth: 840, margin: "0 auto", paddingBottom: 40 }}>
        {/* 상단 타이틀 */}
        <div style={{ marginBottom: 26 }}>
          <h2
            style={{ fontSize: 28, fontWeight: 800, margin: 0, color: c.text }}
          >
            숙소 수정
          </h2>
          <p style={{ marginTop: 8, fontSize: 14, color: c.sub }}>
            등록된 숙소 정보를 수정할 수 있습니다.
          </p>
        </div>

        {/* 카드 */}
        <div
          style={{
            background: c.card,
            borderRadius: 18,
            padding: "30px 26px",
            border: `1px solid ${c.border}`,
            boxShadow: isDark
              ? "0 12px 28px rgba(0,0,0,0.55)"
              : "0 12px 28px rgba(0,0,0,0.06)",
          }}
        >
          {/* 기본 정보 */}
          <section style={{ marginBottom: 26 }}>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 12,
                color: c.text,
              }}
            >
              기본 정보
            </h3>

            <FieldLabel color={c.sub} text="숙소 제목" />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle(c)}
            />

            <FieldLabel color={c.sub} text="가격 (1박 기준, 원)" />
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={inputStyle(c)}
            />

            <FieldLabel color={c.sub} text="지역" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={inputStyle(c)}
            />
          </section>

          {/* 상세 설명 */}
          <section style={{ marginBottom: 26 }}>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 12,
                color: c.text,
              }}
            >
              상세 설명
            </h3>

            <FieldLabel color={c.sub} text="설명" />
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              style={{
                ...inputStyle(c),
                height: 140,
                resize: "none",
                lineHeight: 1.5,
              }}
            />
          </section>

          {/* 이미지 */}
          <section>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 12,
                color: c.text,
              }}
            >
              이미지 URL 수정
            </h3>

            <FieldLabel color={c.sub} text="숙소 이미지 URL 목록" />

            {images.map((img, index) => (
              <input
                key={index}
                value={img}
                onChange={(e) => updateImage(index, e.target.value)}
                placeholder="https://example.com/img.jpg"
                style={inputStyle(c)}
              />
            ))}

            {/* 이미지 필드 추가 */}
            <button
              type="button"
              onClick={addImageField}
              style={{
                width: "100%",
                padding: "10px 0",
                background: c.input,
                color: c.text,
                border: `1px dashed ${c.border}`,
                borderRadius: 10,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 8,
              }}
            >
              + 이미지 추가
            </button>
          </section>

          {/* 수정 버튼 */}
          <button
            type="button"
            onClick={handleUpdate}
            style={{
              width: "100%",
              background: c.btn,
              color: "#fff",
              padding: "14px 0",
              fontWeight: 600,
              borderRadius: 12,
              fontSize: 15,
              border: "none",
              cursor: "pointer",
              marginTop: 8,
            }}
          >
            숙소 수정하기
          </button>
        </div>
      </div>
    </SellerLayout>
  );
}

export default SellerEditListing;
