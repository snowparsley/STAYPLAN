// 상세페이지 (B안 전체 톤 적용)
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Footer from "../components/Footer";
import { useTheme } from "../contexts/ThemeContext";

function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({
    user_name: "",
    check_in: "",
    check_out: "",
    guests: 1,
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // 반응형 감지
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 상세 데이터 가져오기
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/listings/${id}`)
      .then((res) => setListing(res.data))
      .catch((err) => console.error(err));

    // 실제 API로 변경 가능
    setReviews([
      {
        id: 1,
        name: "김00",
        rating: 5,
        comment: "정말 감성적인 숙소였습니다. 사진보다 훨씬 예뻐요!",
      },
      {
        id: 2,
        name: "박00",
        rating: 4,
        comment: "청결하고 깔끔했어요. 다만 주변 편의점이 조금 멀어요.",
      },
      {
        id: 3,
        name: "이00",
        rating: 5,
        comment: "친구들과의 여행에 딱이었습니다. 분위기가 너무 좋아요!",
      },
      {
        id: 4,
        name: "최00",
        rating: 5,
        comment: "조용하고 뷰가 너무 아름다웠어요. 힐링 그 자체!",
      },
      {
        id: 5,
        name: "강00",
        rating: 4,
        comment: "응대가 친절했고 침구도 깨끗했습니다. 추천합니다!",
      },
    ]);
  }, [id]);

  // 입력 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 결제 이동
  const goPayment = () => {
    if (!form.user_name || !form.check_in || !form.check_out) {
      alert("모든 정보를 입력해주세요!");
      return;
    }

    const nights = Math.max(
      1,
      Math.ceil(
        (new Date(form.check_out) - new Date(form.check_in)) /
          (1000 * 60 * 60 * 24)
      )
    );

    navigate("/payment", { state: { listing, form, nights } });
  };

  // -------------------------------
  // 🌙 B안: 크리미 베이지 / 미드나잇 베이지 톤
  // -------------------------------
  const pageBg = isDark ? "#1F1E1C" : "#FAF7F0";
  const mainText = isDark ? "#E3DFD7" : "#46423C";
  const subText = isDark ? "#A9A39A" : "#7A746D";
  const cardBg = isDark ? "#2A2926" : "#FFFFFF";
  const lineColor = isDark ? "#4A4743" : "#E6E1D8";

  const inputBg = isDark ? "#1A1917" : "#FFFFFF";
  const inputBorder = isDark ? "#4A4743" : "#DAD6CF";

  const buttonBg = isDark ? "#CFCAC0" : "#5A554D";
  const buttonText = isDark ? "#1F1E1C" : "#FFFFFF";

  if (!listing)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "100px 0",
          color: subText,
          fontSize: 18,
          background: pageBg,
          minHeight: "100vh",
        }}
      >
        로딩 중...
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundColor: pageBg,
        color: mainText,
        minHeight: "100vh",
        transition: "0.3s ease",
      }}
    >
      {/* 썸네일 */}
      <motion.img
        src={listing.thumbnail}
        alt={listing.title}
        initial={{ scale: 1.03, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          width: "100%",
          height: isMobile ? "40vh" : "480px",
          objectFit: "cover",
          borderBottom: `1px solid ${lineColor}`,
        }}
      />

      {/* 예약 폼 */}
      <div
        style={{
          background: cardBg,
          border: `1px solid ${lineColor}`,
          boxShadow: isDark
            ? "0 8px 20px rgba(0,0,0,0.35)"
            : "0 6px 18px rgba(0,0,0,0.06)",
          borderRadius: 12,
          margin: isMobile ? "20px auto" : "40px auto 0",
          padding: isMobile ? "16px" : "22px 28px",
          maxWidth: 1100,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: isMobile ? 10 : 16,
        }}
      >
        {/* 입력창 */}
        <input
          type="text"
          name="user_name"
          placeholder="예약자 이름"
          onChange={handleChange}
          style={inputStyle(isDark, inputBg, inputBorder, isMobile)}
        />

        <input
          type="date"
          name="check_in"
          onChange={handleChange}
          style={inputStyle(isDark, inputBg, inputBorder, isMobile)}
        />

        <input
          type="date"
          name="check_out"
          onChange={handleChange}
          style={inputStyle(isDark, inputBg, inputBorder, isMobile)}
        />

        <select
          name="guests"
          value={form.guests}
          onChange={handleChange}
          style={inputStyle(isDark, inputBg, inputBorder, isMobile)}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n} style={{ color: "#000" }}>
              게스트 {n}명{n === 5 ? "+" : ""}
            </option>
          ))}
        </select>

        {/* 버튼 */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          onClick={goPayment}
          style={{
            flex: isMobile ? "none" : 0.8,
            width: isMobile ? "100%" : "auto",
            backgroundColor: buttonBg,
            color: buttonText,
            border: "none",
            padding: isMobile ? "10px 14px" : "12px 20px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 700,
            fontSize: isMobile ? 14 : 15,
          }}
        >
          결제하기
        </motion.button>
      </div>

      {/* 상세 정보 */}
      <div style={{ maxWidth: 1100, margin: "40px auto", padding: "0 20px" }}>
        <h1
          style={{
            fontSize: isMobile ? 24 : 32,
            fontWeight: 700,
            marginBottom: 8,
            color: mainText,
          }}
        >
          {listing.title}
        </h1>

        <h3
          style={{
            fontSize: isMobile ? 18 : 22,
            fontWeight: 700,
            color: "#A47A6B",
            marginBottom: 16,
          }}
        >
          {listing.price.toLocaleString()}원 / 1박
        </h3>

        <p
          style={{
            fontSize: isMobile ? 15 : 16,
            color: subText,
            lineHeight: 1.7,
            marginBottom: 40,
          }}
        >
          {listing.description}
        </p>

        {/* 후기 */}
        <div style={{ borderTop: `1px solid ${lineColor}`, paddingTop: 25 }}>
          <h3
            style={{
              fontSize: isMobile ? 18 : 20,
              fontWeight: 700,
              marginBottom: 15,
            }}
          >
            후기 ({reviews.length})
          </h3>

          {reviews.map((r) => (
            <div
              key={r.id}
              style={{
                borderBottom: `1px solid ${lineColor}`,
                padding: "15px 0",
              }}
            >
              <strong style={{ fontSize: 16, color: mainText }}>
                {r.name}
              </strong>
              <span style={{ marginLeft: 8, color: "#ffb400" }}>
                {"★".repeat(r.rating)}
              </span>
              <p style={{ margin: "6px 0", color: subText, lineHeight: 1.5 }}>
                {r.comment}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </motion.div>
  );
}

// 입력창 스타일 통일
const inputStyle = (isDark, bg, border, isMobile) => ({
  flex: 1,
  padding: isMobile ? "10px 12px" : "12px 14px",
  border: `1px solid ${border}`,
  borderRadius: 8,
  background: bg,
  color: isDark ? "#E3DFD7" : "#3F3A35",
  fontSize: isMobile ? 14 : 15,
  width: isMobile ? "100%" : "auto",
});

export default ListingDetailPage;
