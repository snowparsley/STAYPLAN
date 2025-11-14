//상단 큰 그림
import React, { useEffect, useState } from "react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1500&q=80",
    title: "서울에서 차로 1시간 반,\n노을을 담은 서울스테이",
    subtitle: "자쿠지, 프라이빗 BBQ, 불멍 등 신규 오픈 기념 최대 15% 할인",
  },
  {
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1500&q=80",
    title: "자연이 주는 여유,\n숲속의 부산 하우스",
    subtitle: "휴식과 영감을 동시에, 감성 숙소 TOP PICK",
  },
  {
    image:
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1500&q=80",
    title: "바다를 품은 스테이,\n 남해 스테이",
    subtitle: "탁 트인 전망과 함께 여유로운 하루를 만나보세요",
  },
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  // ✅ 화면 크기 변경 감지해서 모바일 여부 판단
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="hero-slider"
      style={{
        maxWidth: "1200px",
        margin: "24px auto 20px",
        padding: isMobile ? "0 12px" : "0 24px",
      }}
    >
      <div
        style={{
          position: "relative",
          height: isMobile ? "280px" : "460px", // ✅ 반응형 높이 적용
          width: "100%",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
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
            {/* 어두운 오버레이 */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.65))",
              }}
            />

            {/* 텍스트 */}
            <div
              style={{
                position: "absolute",
                bottom: isMobile ? "30px" : "70px",
                right: isMobile ? "20px" : "60px",
                color: "white",
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
                }}
              >
                {slide.title}
              </h1>
              <p
                style={{
                  fontSize: isMobile ? "12px" : "17px",
                  marginTop: isMobile ? "6px" : "10px",
                  color: "#ddd",
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
            color: "white",
            fontSize: isMobile ? "12px" : "14px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(0,0,0,0.3)",
            borderRadius: "20px",
            padding: "4px 8px",
          }}
        >
          <button onClick={prevSlide} style={smallArrow()}>
            ❮
          </button>
          <span>
            {current + 1} / {slides.length}
          </span>
          <button onClick={nextSlide} style={smallArrow()}>
            ❯
          </button>
        </div>
      </div>
    </div>
  );
}

const smallArrow = () => ({
  background: "transparent",
  color: "white",
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
  opacity: 0.8,
  transition: "opacity 0.2s",
  padding: "2px 5px",
});

export default HeroSlider;
