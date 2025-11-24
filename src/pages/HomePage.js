import React, { useEffect, useState } from "react";
import HeroSlider from "../components/HeroSlider";
import CollectionSection from "../components/CollectionSection";
import Footer from "../components/Footer";
import { useTheme } from "../contexts/ThemeContext";

function HomePage() {
  const { theme } = useTheme();

  const [listings, setListings] = useState([]);
  const [type, setType] = useState("domestic");
  const [loading, setLoading] = useState(true);

  const fetchListings = async (selectedType) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://stayplanserver.onrender.com/api/listings?type=${selectedType}`
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

  useEffect(() => {
    fetchListings(type);
  }, [type]);

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
          "하루의 피로를 념려줄, 나만의 쉼표 같은 공간",
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

  const sections = [];
  const chunkSize = type === "domestic" ? 8 : 5;
  for (let i = 0; i < listings.length; i += chunkSize) {
    const index = Math.floor(i / chunkSize) % sectionTitles.length;
    sections.push({
      title: sectionTitles[index],
      subtitle: sectionSubtitles[index],
      data: listings.slice(i, i + chunkSize),
    });
  }

  const isDark = theme === "dark";

  const outerBackground = isDark ? "#2A2926" : "#FAF7F0";
  const innerBackground = isDark ? "#34322D" : "#FFFFFF";
  const textColor = isDark ? "#EFEDE8" : "#2A2926";

  const cardShadow = isDark
    ? "0 5px 20px rgba(0,0,0,0.4)"
    : "0 5px 20px rgba(0,0,0,0.06)";

  const borderColor = isDark ? "#4A4743" : "#E6E1D8";

  return (
    <div
      style={{
        background: outerBackground,
        minHeight: "100vh",
        paddingBottom: "50px",
        transition: "0.3s ease",
        color: textColor,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          background: innerBackground,
          borderRadius: "18px",
          boxShadow: cardShadow,
          overflow: "hidden",
          transition: "0.3s ease",
        }}
      >
        <HeroSlider />

        {/* 국내/해외 버튼 */}
        <div style={{ textAlign: "center", margin: "40px 0 30px" }}>
          <div
            style={{
              display: "inline-flex",
              background: innerBackground,
              borderRadius: "50px",
              border: `1px solid ${borderColor}`,
              overflow: "hidden",
              transition: "0.3s ease",
            }}
          >
            {["domestic", "abroad"].map((t) => {
              const isActive = type === t;

              const lightActiveBg = "#2A2926";
              const lightInactiveBg = "#EFECE7";

              const darkActiveBg = "#EFEDE8";
              const darkInactiveBg = "#43413D";

              return (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  style={{
                    padding: "10px 26px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: 600,
                    backgroundColor: isDark
                      ? isActive
                        ? darkActiveBg
                        : darkInactiveBg
                      : isActive
                      ? lightActiveBg
                      : lightInactiveBg,
                    color: isDark
                      ? isActive
                        ? "#2A2926"
                        : "#CFCAC0"
                      : isActive
                      ? "#FFFFFF"
                      : "#6F6A62",
                    transition: "all 0.25s ease",
                  }}
                >
                  {t === "domestic" ? "국내" : "해외"}
                </button>
              );
            })}
          </div>
        </div>

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px 40px",
            transition: "0.3s ease",
          }}
        >
          {loading ? (
            <p style={{ textAlign: "center", marginTop: "80px" }}>
              숙소 정보를 불러오는 중입니다...
            </p>
          ) : listings.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: "60px" }}>
              표시할 숙소가 없습니다.
            </p>
          ) : (
            sections.map((section, idx) => (
              <CollectionSection
                key={idx}
                title={section.title}
                subtitle={section.subtitle}
                listings={section.data}
              />
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default HomePage;
