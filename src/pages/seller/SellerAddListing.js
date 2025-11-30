import React, { useState } from "react";
import SellerLayout from "../../components/seller/SellerLayout";
import { useTheme } from "../../contexts/ThemeContext";
import { FiX } from "react-icons/fi";

function SellerAddListing() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const c = {
    bg: isDark ? "#1A1A18" : "#FAF7F0",
    card: isDark ? "#262522" : "#FFFFFF",
    border: isDark ? "#3F3C38" : "#E5E1D8",
    text: isDark ? "#EFEDE8" : "#4A3F35",
    sub: isDark ? "#A9A39A" : "#7A746D",
    input: isDark ? "#34322E" : "#F6F2EB",
    btn: "#8C6A4A",
    highlight: "#A47A6B",
  };

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [desc, setDesc] = useState("");
  const [files, setFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [type, setType] = useState("domestic");

  /* 이미지 선택 */
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    setFiles(selectedFiles);

    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  /* 이미지 삭제 */
  const removeImage = (index) => {
    const updatedFiles = [...files];
    const updatedPreviews = [...previewImages];

    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setFiles(updatedFiles);
    setPreviewImages(updatedPreviews);
  };

  /* 등록 요청 */
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
    formData.append("type", type);

    files.forEach((file) => formData.append("images", file));

    try {
      const res = await fetch(
        "https://stayplanserver.onrender.com/api/seller/add-listing",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
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
      alert("서버 오류");
    }
  };

  return (
    <SellerLayout>
      <div style={{ maxWidth: 880, margin: "0 auto", paddingBottom: 50 }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 6 }}>
          숙소 등록
        </h2>
        <p style={{ color: c.sub, marginBottom: 20 }}>
          판매자님이 운영하시는 숙소 정보를 입력해주세요.
        </p>

        <div
          style={{
            background: c.card,
            padding: 32,
            borderRadius: 20,
            border: `1px solid ${c.border}`,
            boxShadow: isDark
              ? "0 10px 25px rgba(0,0,0,0.55)"
              : "0 10px 25px rgba(0,0,0,0.08)",
          }}
        >
          {/* 타입 선택 */}
          <Label c={c} text="숙소 유형" />

          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 26,
              background: c.input,
              padding: 6,
              borderRadius: 14,
            }}
          >
            {["domestic", "abroad"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 12,
                  border: "none",
                  background: type === t ? c.highlight : "transparent",
                  color: type === t ? "white" : c.text,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "0.25s",
                }}
              >
                {t === "domestic" ? "국내" : "해외"}
              </button>
            ))}
          </div>

          {/* --- 2열 Grid Form --- */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              marginBottom: 20,
            }}
          >
            <div>
              <Label c={c} text="숙소 제목" />
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle(c)}
              />
            </div>

            <div>
              <Label c={c} text="가격 (원)" />
              <input
                type="number"
                value={price}
                onChange={(e) => {
                  let v = e.target.value.replace(/\D/g, "");
                  if (v.length > 8) v = v.slice(0, 8);
                  setPrice(v);
                }}
                style={inputStyle(c)}
                placeholder="예: 120000"
              />
            </div>

            <div>
              <Label c={c} text="지역" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={inputStyle(c)}
              />
            </div>

            <div style={{ gridColumn: "1 / 3" }}>
              <Label c={c} text="숙소 설명" />
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                style={{ ...inputStyle(c), height: 160 }}
              />
            </div>
          </div>

          {/* 이미지 업로드 */}
          <Label c={c} text="이미지 업로드" />

          <label
            style={{
              padding: 40,
              borderRadius: 16,
              border: `2px dashed ${c.border}`,
              background: c.input,
              textAlign: "center",
              cursor: "pointer",
              marginBottom: 20,
              display: "block",
              fontWeight: 600,
            }}
          >
            이미지 선택하기
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>

          {/* 이미지 미리보기 */}
          {previewImages.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 14,
                marginBottom: 28,
              }}
            >
              {previewImages.map((src, i) => (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    width: 140,
                    height: 110,
                    borderRadius: 14,
                    overflow: "hidden",
                    border: `1px solid ${c.border}`,
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  {/* 삭제 버튼 */}
                  <button
                    onClick={() => removeImage(i)}
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      background: "rgba(0,0,0,0.55)",
                      border: "none",
                      borderRadius: "50%",
                      padding: 4,
                      cursor: "pointer",
                      color: "white",
                    }}
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 제출 버튼 */}
          <button
            onClick={handleSubmit}
            style={{
              width: "100%",
              background: c.btn,
              color: "white",
              padding: "16px 0",
              borderRadius: 14,
              fontSize: 17,
              cursor: "pointer",
              border: "none",
              fontWeight: 700,
              transition: "0.25s",
            }}
          >
            숙소 등록하기
          </button>
        </div>
      </div>
    </SellerLayout>
  );
}

function Label({ c, text }) {
  return (
    <p
      style={{
        fontSize: 14,
        fontWeight: 700,
        margin: "10px 0 6px",
        color: c.sub,
      }}
    >
      {text}
    </p>
  );
}

const inputStyle = (c) => ({
  width: "100%",
  padding: "14px 16px",
  background: c.input,
  borderRadius: 14,
  border: `1px solid ${c.border}`,
  marginBottom: 10,
  color: c.text,
  fontSize: 15,
});

export default SellerAddListing;
