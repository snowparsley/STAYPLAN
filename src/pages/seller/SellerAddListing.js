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
  const [files, setFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  // 이미지 선택
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // 미리보기
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async () => {
    if (!title || !price || !location || !desc || files.length === 0) {
      alert("모든 필드를 입력하고 이미지를 선택해주세요.");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("title", title);
    formData.append("price", price);
    formData.append("location", location);
    formData.append("description", desc);

    // 여러 이미지 파일 첨부
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await fetch(
        "https://stayplanserver.onrender.com/api/seller/add-listing",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
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
      <div style={{ maxWidth: 840, margin: "0 auto", paddingBottom: 40 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          숙소 등록
        </h2>
        <p style={{ marginBottom: 20, color: c.sub }}>
          판매자님이 운영하시는 숙소 정보를 입력하세요.
        </p>

        <div
          style={{
            background: c.card,
            padding: 28,
            borderRadius: 18,
            border: `1px solid ${c.border}`,
          }}
        >
          {/* 제목 */}
          <p style={labelStyle(c)}>숙소 제목</p>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle(c)}
          />

          {/* 가격 */}
          <p style={labelStyle(c)}>가격 (원)</p>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={inputStyle(c)}
            type="number"
          />

          {/* 지역 */}
          <p style={labelStyle(c)}>지역</p>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={inputStyle(c)}
          />

          {/* 설명 */}
          <p style={labelStyle(c)}>설명</p>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            style={{ ...inputStyle(c), height: 140 }}
          />

          {/* 이미지 업로드 */}
          <p style={labelStyle(c)}>이미지 업로드</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            style={{
              padding: 10,
              border: `1px dashed ${c.border}`,
              borderRadius: 10,
              background: c.input,
              width: "100%",
            }}
          />

          {/* 미리보기 */}
          {previewImages.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 12,
                flexWrap: "wrap",
              }}
            >
              {previewImages.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt="preview"
                  style={{
                    width: 120,
                    height: 90,
                    borderRadius: 10,
                    objectFit: "cover",
                    border: `1px solid ${c.border}`,
                  }}
                />
              ))}
            </div>
          )}

          {/* 제출 */}
          <button
            onClick={handleSubmit}
            style={{
              width: "100%",
              background: c.btn,
              color: "white",
              border: "none",
              fontSize: 16,
              padding: "14px 0",
              marginTop: 20,
              borderRadius: 12,
              cursor: "pointer",
            }}
          >
            숙소 등록하기
          </button>
        </div>
      </div>
    </SellerLayout>
  );
}

const labelStyle = (c) => ({
  fontSize: 13,
  fontWeight: 600,
  margin: "10px 0 4px",
  color: c.sub,
});

const inputStyle = (c) => ({
  width: "100%",
  padding: "12px 14px",
  background: c.input,
  borderRadius: 12,
  border: `1px solid ${c.border}`,
  marginBottom: 12,
  color: c.text,
  fontSize: 14,
  boxSizing: "border-box",
});

export default SellerAddListing;
