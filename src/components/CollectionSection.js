//카드 컬렉션
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import ListingCard from "./ListingCard";
import { useTheme } from "../contexts/ThemeContext"; // ⭐ 다크모드 추가

function CollectionSection({ title, subtitle, listings }) {
  const sliderRef = useRef(null);
  const { theme } = useTheme(); // ⭐ 현재 테마
  const isDark = theme === "dark";

  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const EPSILON = 4;

  const handleScroll = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const { scrollLeft, scrollWidth, clientWidth } = slider;
    setIsAtStart(scrollLeft <= EPSILON);
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - EPSILON);
  };

  const scroll = (dir) => {
    const slider = sliderRef.current;
    if (!slider) return;
    slider.scrollBy({
      left: dir === "left" ? -350 : 350,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    handleScroll();
    slider.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      slider.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // ----------------------------
  // ⭐ 다크모드 전용 스타일 정의
  // ----------------------------
  const bgGradient = isDark
    ? "linear-gradient(to bottom right, #1a1a1a, #111)"
    : "linear-gradient(to bottom right, #ffffff, #faf9f7)";

  const cardShadow = isDark
    ? "0 4px 12px rgba(255,255,255,0.04)"
    : "0 4px 12px rgba(0,0,0,0.05)";

  const titleColor = isDark ? "#f1f1f1" : "#111";
  const subtitleColor = isDark ? "#bdbdbd" : "#777";

  const arrowBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.9)";

  const arrowShadow = isDark
    ? "0 4px 12px rgba(255,255,255,0.05)"
    : "0 4px 12px rgba(0,0,0,0.15)";

  return (
    <motion.section
      className="collection-section"
      style={{
        marginBottom: "80px",
        position: "relative",
        background: bgGradient,
        borderRadius: "18px",
        padding: "32px 10px 20px",
        boxShadow: cardShadow,
        transition: "0.3s ease",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* 섹션 제목 */}
      <div style={{ margin: "0 0 25px 16px" }}>
        <motion.h2
          style={{
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "8px",
            color: titleColor,
          }}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {title}
        </motion.h2>

        {subtitle && (
          <motion.p
            style={{
              fontSize: "15px",
              color: subtitleColor,
              margin: 0,
              lineHeight: "1.6",
              letterSpacing: "-0.3px",
            }}
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* 왼쪽 버튼 */}
      {!isAtStart && (
        <motion.button
          onClick={() => scroll("left")}
          style={navButton("left", arrowBg, arrowShadow)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          ❮
        </motion.button>
      )}

      {/* 카드 슬라이드 */}
      <div
        ref={sliderRef}
        style={{
          display: "flex",
          gap: "20px",
          overflowX: "auto",
          padding: "4px 14px 10px",
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
        }}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>

        {listings.map((listing) => (
          <motion.div
            key={listing.id}
            style={{ flex: "0 0 300px", scrollSnapAlign: "start" }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <ListingCard listing={listing} />
          </motion.div>
        ))}
      </div>

      {/* 오른쪽 버튼 */}
      {!isAtEnd && (
        <motion.button
          onClick={() => scroll("right")}
          style={navButton("right", arrowBg, arrowShadow)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          ❯
        </motion.button>
      )}
    </motion.section>
  );
}

// ---------------------------------
// ⭐ 화살표 버튼 스타일 함수
// ---------------------------------
const navButton = (side, bg, shadow) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  [side]: "0px",
  zIndex: 20,
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  border: "none",
  fontSize: "22px",
  cursor: "pointer",
  background: bg,
  boxShadow: shadow,
  color: "#fff",
  transition: "opacity 0.3s ease, background 0.3s ease",
});

export default CollectionSection;
