import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Footer from "../components/Footer";

function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({
    user_name: "",
    check_in: "",
    check_out: "",
    guests: 1,
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/listings/${id}`)
      .then((res) => setListing(res.data))
      .catch((err) => console.error(err));

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
        comment: "조용하고 뷰가 정말 아름다웠습니다. 힐링 그 자체였어요.",
      },
      {
        id: 5,
        name: "강00",
        rating: 4,
        comment: "응대가 친절했고 침구도 깨끗했습니다. 추천합니다!",
      },
    ]);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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
    navigate("/payment", {
      state: { listing, form, nights },
    });
  };

  if (!listing)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "100px 0",
          color: "#777",
          fontSize: 18,
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
      style={{ backgroundColor: "#fff", minHeight: "100vh" }}
    >
      {/* 상단 이미지 */}
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
          borderBottom: "1px solid #eee",
        }}
      />

      {/* 예약 폼 */}
      <div
        style={{
          background: "#fff",
          boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
          borderRadius: 12,
          margin: isMobile ? "20px auto" : "40px auto 0",
          padding: isMobile ? "18px" : "20px 28px",
          maxWidth: 1100,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: isMobile ? 10 : 15,
        }}
      >
        <input
          type="text"
          name="user_name"
          placeholder="예약자 이름"
          onChange={handleChange}
          style={inputStyle(isMobile)}
        />
        <input
          type="date"
          name="check_in"
          onChange={handleChange}
          style={inputStyle(isMobile)}
        />
        <input
          type="date"
          name="check_out"
          onChange={handleChange}
          style={inputStyle(isMobile)}
        />
        <select
          name="guests"
          value={form.guests}
          onChange={handleChange}
          style={inputStyle(isMobile)}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              게스트 {n}명{n === 5 ? "+" : ""}
            </option>
          ))}
        </select>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          onClick={goPayment}
          style={buttonStyle(isMobile)}
        >
          결제하기
        </motion.button>
      </div>

      {/* 숙소 정보 */}
      <div style={{ maxWidth: 1100, margin: "40px auto", padding: "0 20px" }}>
        <h1
          style={{
            fontSize: isMobile ? 24 : 32,
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          {listing.title}
        </h1>
        <h3
          style={{
            fontSize: isMobile ? 18 : 22,
            fontWeight: 700,
            color: "#ff5a5f",
            marginBottom: 16,
          }}
        >
          {listing.price.toLocaleString()}원 / 1박
        </h3>
        <p
          style={{
            fontSize: isMobile ? 15 : 16,
            color: "#444",
            lineHeight: 1.7,
            marginBottom: 40,
          }}
        >
          {listing.description}
        </p>

        {/* 후기 */}
        <div style={{ borderTop: "1px solid #eee", paddingTop: 25 }}>
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
                borderBottom: "1px solid #f0f0f0",
                padding: "15px 0",
              }}
            >
              <strong style={{ fontSize: 16 }}>{r.name}</strong>
              <span style={{ marginLeft: 8, color: "#ffb400" }}>
                {"★".repeat(r.rating)}
              </span>
              <p style={{ margin: "6px 0", color: "#555", lineHeight: 1.5 }}>
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

// ✅ 스타일 함수
const inputStyle = (isMobile) => ({
  flex: 1,
  padding: isMobile ? "10px 12px" : "12px 14px",
  border: "1px solid #ccc",
  borderRadius: 8,
  fontSize: isMobile ? 14 : 15,
  width: isMobile ? "100%" : "auto",
});

const buttonStyle = (isMobile) => ({
  flex: isMobile ? "none" : 0.8,
  width: isMobile ? "100%" : "auto",
  backgroundColor: "#ff5a5f",
  color: "#fff",
  border: "none",
  padding: isMobile ? "10px 14px" : "12px 18px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: isMobile ? 14 : 15,
});

export default ListingDetailPage;
