import React, { useState } from "react";
import SellerLayout from "../../components/seller/SellerLayout";
import { useTheme } from "../../contexts/ThemeContext";

function SellerAddListing() {
  const { theme } = useTheme();
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

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState([""]);

  const addImageField = () => setImages((prev) => [...prev, ""]);

  const updateImage = (index, value) => {
    setImages((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const handleSubmit = async () => {
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

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        "https://stayplanserver.onrender.com/api/seller/add-listing",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "등록 실패");
        return;
      }

      alert("숙소가 등록되었습니다!");
      window.location.href = "/seller/listings";
    } catch (err) {
      console.error(err);
      alert("서버 오류");
    }
  };

  return (
    <SellerLayout>
      {/* 가운데 정렬 컨테이너 */}
      <div
        style={{
          maxWidth: 840,
          margin: "0 auto",
          paddingBottom: 40,
        }}
      >
        {/* 페이지 타이틀 영역 */}
        <div style={{ marginBottom: 26 }}>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              margin: 0,
              color: c.text,
            }}
          >
            숙소 등록
          </h2>
          <p
            style={{
              marginTop: 8,
              fontSize: 14,
              color: c.sub,
            }}
          >
            판매자님이 운영하시는 숙소 정보를 자세히 입력해주세요.
          </p>
        </div>

        {/* 카드 폼 */}
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
          {/* 숙소 기본 정보 섹션 */}
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

            {/* 제목 */}
            <FieldLabel color={c.sub} text="숙소 제목" />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예) 감성 가득한 제주 바닷가 숙소"
              style={inputStyle(c)}
            />

            {/* 가격 */}
            <FieldLabel color={c.sub} text="가격 (1박 기준, 원)" />
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="예) 120000"
              style={inputStyle(c)}
            />

            {/* 지역 */}
            <FieldLabel color={c.sub} text="지역" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예) 제주도 서귀포시"
              style={inputStyle(c)}
            />
          </section>

          {/* 설명 섹션 */}
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
              placeholder="숙소에 대한 설명을 입력해주세요."
              style={{
                ...inputStyle(c),
                height: 140,
                resize: "none",
                lineHeight: 1.5,
              }}
            />
          </section>

          {/* 이미지 URL 섹션 */}
          <section>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 12,
                color: c.text,
              }}
            >
              이미지
            </h3>

            <FieldLabel
              color={c.sub}
              text="대표 이미지 URL (여러 장을 등록할 수 있어요)"
            />

            {images.map((img, index) => (
              <input
                key={index}
                value={img}
                onChange={(e) => updateImage(index, e.target.value)}
                placeholder="https://example.com/img.jpg"
                style={inputStyle(c)}
              />
            ))}

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

          {/* 제출 버튼 */}
          <button
            type="button"
            onClick={handleSubmit}
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
            숙소 등록하기
          </button>
        </div>
      </div>
    </SellerLayout>
  );
}

/** 공통 필드 라벨 컴포넌트 */
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

export default SellerAddListing;
