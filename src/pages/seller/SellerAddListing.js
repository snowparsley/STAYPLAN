import React, { useState } from "react";
import SellerLayout from "./components/SellerLayout";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

function SellerAddListing() {
  const { token } = useAuth();
  const { theme } = useTheme();

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

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    images: [""],
  });

  const [loading, setLoading] = useState(false);

  // 입력 핸들러
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 이미지 추가
  const addImageField = () => {
    setForm({ ...form, images: [...form.images, ""] });
  };

  // 이미지 변경
  const updateImage = (idx, value) => {
    const newImages = [...form.images];
    newImages[idx] = value;
    setForm({ ...form, images: newImages });
  };

  // 제출
  const submitListing = async () => {
    if (!form.title || !form.price || !form.location) {
      return alert("필수 항목을 모두 입력해주세요.");
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://stayplanserver.onrender.com/api/seller/add-listing",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "등록 실패");
        return;
      }

      alert("숙소 등록 완료!");
      window.location.href = "/seller/listings";
    } catch (err) {
      console.error("등록 실패:", err);
      alert("서버 오류");
    } finally {
      setLoading(false);
    }
  };

  // ----------- 스타일 공통 -----------
  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: `1px solid ${c.line}`,
    background: isDark ? "#1F1F1C" : "#FFFFFF",
    color: c.text,
    fontSize: 15,
    outline: "none",
    marginBottom: 16,
  };

  const labelStyle = {
    marginBottom: 6,
    fontWeight: 700,
    fontSize: 15,
    color: c.sub,
    display: "block",
  };

  const btnPrimary = {
    marginTop: 20,
    padding: "14px 20px",
    borderRadius: 10,
    border: "none",
    width: "100%",
    background: "#8B6F5A",
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
  };

  return (
    <SellerLayout>
      <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 26 }}>
        숙소 등록
      </h1>

      <div
        style={{
          background: c.card,
          padding: 28,
          borderRadius: 18,
          border: `1px solid ${c.line}`,
          boxShadow: c.shadow,
          maxWidth: 650,
        }}
      >
        {/* 제목 */}
        <label style={labelStyle}>숙소 제목</label>
        <input
          name="title"
          value={form.title}
          onChange={onChange}
          style={inputStyle}
          placeholder="예) 감성 가득한 제주 바닷가 숙소"
        />

        {/* 가격 */}
        <label style={labelStyle}>가격 (원)</label>
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={onChange}
          style={inputStyle}
          placeholder="예) 120000"
        />

        {/* 지역 */}
        <label style={labelStyle}>지역</label>
        <input
          name="location"
          value={form.location}
          onChange={onChange}
          style={inputStyle}
          placeholder="예) 제주도 서귀포시"
        />

        {/* 설명 */}
        <label style={labelStyle}>설명</label>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          style={{ ...inputStyle, height: 120 }}
          placeholder="숙소에 대한 설명을 입력해주세요."
        />

        {/* 이미지 URL 입력 */}
        <label style={labelStyle}>이미지 URL</label>

        {form.images.map((img, idx) => (
          <input
            key={idx}
            value={img}
            onChange={(e) => updateImage(idx, e.target.value)}
            style={inputStyle}
            placeholder="https://example.com/img.jpg"
          />
        ))}

        <button
          onClick={addImageField}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: `1px solid ${c.line}`,
            background: c.card,
            color: c.text,
            cursor: "pointer",
            width: "100%",
            marginBottom: 16,
          }}
        >
          + 이미지 추가
        </button>

        {/* 제출 */}
        <button onClick={submitListing} style={btnPrimary} disabled={loading}>
          {loading ? "등록 중..." : "숙소 등록하기"}
        </button>
      </div>
    </SellerLayout>
  );
}

export default SellerAddListing;
