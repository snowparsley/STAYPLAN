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

  const addImageField = () => {
    setImages([...images, ""]);
  };

  const updateImage = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
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
      images: images.filter((i) => i.trim() !== ""),
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
        alert("등록 실패");
        return;
      }

      alert("숙소가 등록되었습니다!");
      window.location.href = "/seller/listings";
    } catch (err) {
      alert("서버 오류");
    }
  };

  return (
    <SellerLayout>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 28 }}>
        숙소 등록
      </h2>

      <div
        style={{
          background: c.card,
          borderRadius: 16,
          padding: "32px 28px",
          border: `1px solid ${c.border}`,
          maxWidth: 700,
        }}
      >
        {/* 제목 */}
        <label style={{ color: c.sub, fontWeight: 600 }}>숙소 제목</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예) 감성 가득한 제주 바닷가 숙소"
          style={inputStyle(c)}
        />

        {/* 가격 */}
        <label style={{ color: c.sub, fontWeight: 600 }}>가격 (원)</label>
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="예) 120000"
          style={inputStyle(c)}
        />

        {/* 지역 */}
        <label style={{ color: c.sub, fontWeight: 600 }}>지역</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="예) 제주도 서귀포시"
          style={inputStyle(c)}
        />

        {/* 설명 */}
        <label style={{ color: c.sub, fontWeight: 600 }}>설명</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="숙소에 대한 설명을 입력해주세요."
          style={{
            ...inputStyle(c),
            height: 130,
            resize: "none",
          }}
        />

        {/* 이미지 URL */}
        <label style={{ color: c.sub, fontWeight: 600, marginTop: 10 }}>
          이미지 URL
        </label>

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
          onClick={addImageField}
          style={{
            width: "100%",
            padding: "10px 0",
            background: c.input,
            color: c.text,
            border: `1px dashed ${c.border}`,
            borderRadius: 10,
            cursor: "pointer",
            marginTop: 6,
            marginBottom: 18,
          }}
        >
          + 이미지 추가
        </button>

        {/* 제출 버튼 */}
        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            background: c.btn,
            color: "#fff",
            padding: "14px 0",
            fontWeight: 600,
            borderRadius: 12,
            fontSize: 16,
            border: "none",
            cursor: "pointer",
          }}
        >
          숙소 등록하기
        </button>
      </div>
    </SellerLayout>
  );
}

const inputStyle = (c) => ({
  width: "100%",
  padding: "14px 16px",
  background: c.input,
  borderRadius: 12,
  border: `1px solid ${c.border}`,
  marginTop: 6,
  marginBottom: 22,
  color: c.text,
  fontSize: 15,
});

export default SellerAddListing;
