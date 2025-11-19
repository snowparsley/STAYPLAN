// src/components/CollectionSection.js
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import ListingCard from "./ListingCard";
import { useTheme } from "../contexts/ThemeContext";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function CollectionSection({ title, subtitle, listings, hideArrows = false }) {
  const sliderRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const CARD_WIDTH = 320;
  const STEP = 2;
  const SNAP_THRESHOLD = 90;

  const [index, setIndex] = useState(0);
  const maxIndex = Math.max(0, listings.length - 1);

  const pos = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
  });

  /* 드래그 */
  const startDrag = (e) => {
    const slider = sliderRef.current;
    pos.current.isDown = true;
    pos.current.startX = e.pageX || e.touches[0].pageX;
    pos.current.scrollLeft = slider.scrollLeft;
  };

  const moveDrag = (e) => {
    if (!pos.current.isDown) return;

    const slider = sliderRef.current;
    const x = e.pageX || e.touches[0].pageX;
    slider.scrollLeft = pos.current.scrollLeft + (pos.current.startX - x);
  };

  const endDrag = (e) => {
    if (!pos.current.isDown) return;
    pos.current.isDown = false;

    const moved = pos.current.startX - (e.pageX || e.changedTouches[0].pageX);

    if (Math.abs(moved) > SNAP_THRESHOLD) {
      moved > 0 ? goTo(index + STEP) : goTo(index - STEP);
    } else {
      goTo(index);
    }
  };

  /* 이동 */
  const goTo = (i) => {
    const slider = sliderRef.current;
    const safe = Math.max(0, Math.min(i, maxIndex));
    setIndex(safe);

    slider.scrollTo({
      left: safe * CARD_WIDTH,
      behavior: "smooth",
    });
  };

  /* 스크롤 상태 → index 업데이트 */
  const handleScroll = () => {
    const slider = sliderRef.current;
    setIndex(Math.round(slider.scrollLeft / CARD_WIDTH));
  };

  useEffect(() => {
    const slider = sliderRef.current;
    slider.addEventListener("scroll", handleScroll);
    return () => slider.removeEventListener("scroll", handleScroll);
  }, []);

  /* 테마 색 */
  const bg = isDark ? "#1F1E1C" : "#FAF7F0";
  const titleColor = isDark ? "#E8E5DF" : "#403C37";
  const subtitleColor = isDark ? "#A69F97" : "#7D756E";

  return (
    <motion.section
      style={{
        marginBottom: "70px",
        position: "relative",
        background: bg,
        borderRadius: "22px",
        padding: "30px 10px 42px",
        overflow: "hidden",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* 제목 */}
      <div style={{ margin: "0 0 24px 18px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 800,
            marginBottom: "7px",
            color: titleColor,
          }}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            style={{
              fontSize: "15px",
              color: subtitleColor,
              margin: 0,
              lineHeight: "1.6",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/*  화살표 숨김 적용 */}
      {!hideArrows && index > 0 && (
        <motion.button
          onClick={() => goTo(index - STEP)}
          style={navButton("left", isDark)}
        >
          <FiChevronLeft size={26} />
        </motion.button>
      )}

      {!hideArrows && index < maxIndex && (
        <motion.button
          onClick={() => goTo(index + STEP)}
          style={navButton("right", isDark)}
        >
          <FiChevronRight size={26} />
        </motion.button>
      )}

      {/* 슬라이더 */}
      <div
        ref={sliderRef}
        style={{
          display: "flex",
          gap: "20px",
          overflowX: "auto",
          padding: "4px 14px 10px",
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
        }}
        onMouseDown={startDrag}
        onMouseMove={moveDrag}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={startDrag}
        onTouchMove={moveDrag}
        onTouchEnd={endDrag}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>

        {listings.map((listing) => (
          <motion.div
            key={listing.id}
            style={{ flex: "0 0 300px" }}
            whileHover={{ scale: 1.02 }}
          >
            <ListingCard listing={listing} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

/* 화살표 버튼 */
const navButton = (side, isDark) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  [side]: "-10px",
  zIndex: 40,

  width: "40px",
  height: "40px",

  background: isDark ? "#2F2E2C" : "rgba(255,255,255,0.9)",
  border: "none",
  borderRadius: "50%",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  color: isDark ? "#F0ECE4" : "#333",
  cursor: "pointer",
  transition: "0.25s ease",
});

export default CollectionSection;
