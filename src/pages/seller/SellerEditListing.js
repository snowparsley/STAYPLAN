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
    highlight: "#A47A6B",
  };

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState([]);

  // 신규 업로드 파일
  const [newFiles, setNewFiles] = useState([]);
  const [newPreview, setNewPreview] = useState([]);

  // ⭐ 추가된 type 상태
  const [type, setType] = useState("domestic");

  /* -------------------------------------------------------
      이미지 URL 수정 + 새로운 로컬 업로드까지 지원
  ------------------------------------------------------- */
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setNewPreview(previews);
  };

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

      setImages(data.images && Array.isArray(data.images) ? data.images : []);

      setType(data.type || "domestic");
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

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", desc);
    formData.append("price", price);
    formData.append("location", location);
    formData.append("type", type);

    // 기존 URL 이미지 전달 → 서버는 existingImages 로 받음
    images
      .filter((v) => v.trim() !== "")
      .forEach((url) => formData.append("existingImages", url));

    // 새 이미지 파일 전달 → 서버는 images 로 받음 (multer.array("images"))
    newFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await fetch(
        `https://stayplanserver.onrender.com/api/seller/listing/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
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
      <div style={{ maxWidth: 840, margin: "0 auto", paddingBottom: 50 }}>
        {/* 상단 타이틀 */}
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          숙소 수정
        </h2>
        <p style={{ color: c.sub, marginBottom: 20 }}>
          등록된 숙소 정보를 수정합니다.
        </p>

        <div
          style={{
            background: c.card,
            padding: 32,
            borderRadius: 18,
            border: `1px solid ${c.border}`,
          }}
        >
          {/* ====== 타입 선택 ====== */}
          <FieldLabel color={c.sub} text="숙소 유형" />

          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <button
              onClick={() => setType("domestic")}
              style={{
                flex: 1,
                padding: "12px 0",
                borderRadius: 10,
                border: `1px solid ${c.border}`,
                background: type === "domestic" ? c.highlight : c.input,
                color: type === "domestic" ? "white" : c.text,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              국내
            </button>

            <button
              onClick={() => setType("abroad")}
              style={{
                flex: 1,
                padding: "12px 0",
                borderRadius: 10,
                border: `1px solid ${c.border}`,
                background: type === "abroad" ? c.highlight : c.input,
                color: type === "abroad" ? "white" : c.text,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              해외
            </button>
          </div>

          {/* 기본 정보 */}
          <FieldLabel color={c.sub} text="숙소 제목" />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle(c)}
          />

          <FieldLabel color={c.sub} text="가격 (원)" />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={inputStyle(c)}
            placeholder="예: 120000"
          />

          <FieldLabel color={c.sub} text="지역" />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={inputStyle(c)}
          />

          {/* 설명 */}
          <FieldLabel color={c.sub} text="설명" />
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            style={{
              ...inputStyle(c),
              height: 140,
              resize: "none",
            }}
          />

          {/* 기존 이미지 수정 */}
          <FieldLabel color={c.sub} text="현재 등록된 이미지 URL" />

          {images.map((img, i) => (
            <input
              key={i}
              value={img}
              onChange={(e) => updateImage(i, e.target.value)}
              placeholder="https://example.com/image.jpg"
              style={inputStyle(c)}
            />
          ))}

          {/* 새 이미지 업로드 */}
          <FieldLabel color={c.sub} text="새로운 이미지 업로드" />

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
              marginBottom: 10,
            }}
          />

          {/* 새 미리보기 */}
          {newPreview.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginBottom: 20,
              }}
            >
              {newPreview.map((src, i) => (
                <img
                  key={i}
                  src={src}
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

          {/* 수정 버튼 */}
          <button
            onClick={handleUpdate}
            style={{
              width: "100%",
              background: c.btn,
              color: "white",
              padding: "14px 0",
              borderRadius: 12,
              fontSize: 16,
              cursor: "pointer",
              border: "none",
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
