//상단 큰 그림
import React, { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1500&q=80",
    title: "서울에서 차로 1시간 반,\n노을을 담은 서울스테이",
    subtitle: "자쿠지, 프라이빗 BBQ, 불멍 등 신규 오픈 기념 최대 15% 할인",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1500&q=80",
    title: "자연이 주는 여유,\n숲속의 부산 하우스",
    subtitle: "휴식과 영감을 동시에, 감성 숙소 TOP PICK",
  },
  {
    id: 12,
    image:
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1500&q=80",
    title: "바다를 품은 스테이,\n 남해 스테이",
    subtitle: "탁 트인 전망과 함께 여유로운 하루를 만나보세요",
  },
  {
    id: 57,
    image: "https://loremflickr.com/900/600/building,home,colorful?lock=57",
    title: "노을을 품은 스테이,\n 로마 하우스",
    subtitle: "고대 도시의 숨결과 함께 여유로운 하루를 만나보세요",
  },
  {
    id: 64,
    image: "https://loremflickr.com/900/600/building,home,colorful?lock=64",
    title: "운하를 품은 스테이,\n 암스테르담 하우스",
    subtitle: "부드러운 물결과 햇살이 스치는 감성의 하루",
  },
  {
    id: 48,
    image: "https://loremflickr.com/900/600/building,home,colorful?lock=48",
    title: "바람을 품은 스테이,\n 발리 트로피컬 빌라",
    subtitle: "야자수와 파도 소리가 어우러진 힐링의 순간",
  },
];

function HeroSlider() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, []);

  /* -------------------------------
      B안 색감 (크림/미드나잇 베이지)
  ------------------------------- */
  const shadow = isDark
    ? "0 6px 20px rgba(0,0,0,0.45)"
    : "0 6px 20px rgba(0,0,0,0.10)";

  const titleColor = isDark ? "#E3DFD7" : "#FFFFFF";
  const subtitleColor = isDark ? "#B9B3A8" : "#EFEDE8";

  const overlay = isDark
    ? "linear-gradient(to bottom, rgba(20,19,18,0.45), rgba(20,19,18,0.75))"
    : "linear-gradient(to bottom, rgba(30,27,24,0.05), rgba(30,27,24,0.30))";

  const indicatorBg = isDark ? "rgba(32,30,29,0.55)" : "rgba(30,27,24,0.25)";

  const arrowColor = isDark ? "#E3DFD7" : "#FFFFFF";

  return (
    <div
      className="hero-slider"
      onClick={() => navigate(`/listing/${slides[current].id}`)}
      style={{
        cursor: "pointer",
        maxWidth: "1200px",
        margin: "24px auto 20px",
        padding: isMobile ? "0 12px" : "0 24px",
      }}
    >
      <div
        style={{
          position: "relative",
          height: isMobile ? "280px" : "460px",
          width: "100%",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: shadow,
          transition: "height 0.3s ease",
        }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "absolute",
              width: "100%",
              height: "100%",
              opacity: i === current ? 1 : 0,
              transition: "opacity 0.7s ease-in-out",
            }}
          >
            {/* 오버레이 */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: overlay,
              }}
            />

            {/* 텍스트 */}
            <div
              style={{
                position: "absolute",
                bottom: isMobile ? "30px" : "70px",
                right: isMobile ? "20px" : "60px",
                color: titleColor,
                zIndex: 2,
                textAlign: "right",
                whiteSpace: "pre-line",
              }}
            >
              <h1
                style={{
                  fontSize: isMobile ? "20px" : "36px",
                  fontWeight: 700,
                  margin: 0,
                  lineHeight: "1.4",
                  color: titleColor,
                }}
              >
                {slide.title}
              </h1>
              <p
                style={{
                  fontSize: isMobile ? "12px" : "17px",
                  marginTop: isMobile ? "6px" : "10px",
                  color: subtitleColor,
                }}
              >
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}

        {/* 인디케이터 */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "25px",
            color: titleColor,
            fontSize: isMobile ? "12px" : "14px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: indicatorBg,
            borderRadius: "20px",
            padding: "4px 8px",
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            style={smallArrow(arrowColor)}
          >
            ❮
          </button>

          <span>
            {current + 1} / {slides.length}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            style={smallArrow(arrowColor)}
          >
            ❯
          </button>
        </div>
      </div>
    </div>
  );
}

const smallArrow = (color) => ({
  background: "transparent",
  color: color,
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
  opacity: 0.85,
  transition: "opacity 0.2s",
  padding: "2px 5px",
});

export default HeroSlider;
