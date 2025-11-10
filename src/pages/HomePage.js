// src/pages/HomePage.js
import React, { useEffect, useState } from "react";
import HeroSlider from "../components/HeroSlider";
import CollectionSection from "../components/CollectionSection";
import Footer from "../components/Footer";

function HomePage() {
  const [listings, setListings] = useState([]);
  const [type, setType] = useState("domestic"); // ✅ 기본값: 국내
  const [loading, setLoading] = useState(true);

  // ✅ 숙소 불러오기
  const fetchListings = async (selectedType) => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/listings?type=${selectedType}`
      );
      const data = await res.json();
      if (Array.isArray(data)) setListings(data);
      else setListings([]);
    } catch (err) {
      console.error("❌ 숙소 불러오기 오류:", err);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 첫 렌더 및 type 변경 시 실행
  useEffect(() => {
    fetchListings(type);
  }, [type]);

  // ✅ 섹션 제목 & 감성 문구
  const sectionTitles =
    type === "domestic"
      ? [
          "오늘의 감성 스테이",
          "지금 인기 있는 숙소",
          "자연 속 힐링 스테이",
          "도심 속 힐링 공간",
          "감각적인 디자인 하우스",
        ]
      : [
          "세계 속 감성 스테이",
          "지금 인기 있는 해외 숙소",
          "이국적인 자연 뷰",
          "감각적인 유럽 하우스",
          "휴양지 감성 숙소",
          "로맨틱 해외 스테이",
        ];

  const sectionSubtitles =
    type === "domestic"
      ? [
          "하루의 피로를 녹여줄, 나만의 쉼표 같은 공간",
          "많은 이들이 머무르고 반한 특별한 순간들",
          "도시의 소음을 벗어나 숲의 숨결을 느껴보세요",
          "바쁜 일상 속, 잠시 머무는 따뜻한 여유",
          "빛과 공간이 조화를 이루는 프라이빗 하우스",
        ]
      : [
          "세계 곳곳의 감성을 담은 스테이를 만나보세요",
          "가장 사랑받는 해외 숙소를 지금 확인하세요",
          "이국적인 자연이 선사하는 여유로운 하루",
          "감각적인 유럽 감성의 디자인 하우스",
          "휴양지의 여유와 따뜻한 햇살을 머금은 공간",
          "로맨틱한 순간이 머무는 여행의 끝자락",
        ];

  // ✅ 섹션 나누기
  const sections = [];
  const chunkSize = type === "domestic" ? 8 : 5;
  for (let i = 0; i < listings.length; i += chunkSize) {
    const index = Math.floor(i / chunkSize) % sectionTitles.length;
    sections.push({
      title: sectionTitles[index],
      subtitle: sectionSubtitles[index], // ✅ 추가된 부분
      data: listings.slice(i, i + chunkSize),
    });
  }

  return (
    <div>
      <HeroSlider />

      {/* ✅ 국내/해외 전환 버튼 */}
      <div style={{ textAlign: "center", margin: "40px 0 30px" }}>
        <div
          style={{
            display: "inline-flex",
            background: "#fff",
            borderRadius: "50px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          {["domestic", "abroad"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              style={{
                padding: "10px 26px",
                border: "none",
                outline: "none",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: 600,
                backgroundColor: type === t ? "#000" : "#fff",
                color: type === t ? "#fff" : "#000",
                transition: "all 0.25s ease",
              }}
            >
              {t === "domestic" ? "국내" : "해외"}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ 숙소 목록 */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto 80px",
          padding: "0 24px",
        }}
      >
        {loading ? (
          <p
            style={{
              textAlign: "center",
              color: "#777",
              marginTop: "80px",
              fontSize: "17px",
            }}
          >
            숙소 정보를 불러오는 중입니다...
          </p>
        ) : listings.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "#999",
              marginTop: "60px",
              fontSize: "16px",
            }}
          >
            표시할 숙소가 없습니다.
          </p>
        ) : (
          sections.map((section, idx) => (
            <CollectionSection
              key={idx}
              title={section.title}
              subtitle={section.subtitle} // ✅ 감성 문구 전달
              listings={section.data}
            />
          ))
        )}
      </div>

      <Footer />
    </div>
  );
}

export default HomePage;
