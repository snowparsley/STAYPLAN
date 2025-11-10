import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import ListingCard from "./ListingCard";

function CollectionSection({ title, subtitle, listings }) {
  const sliderRef = useRef(null);
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

  const scroll = (direction) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const scrollAmount = 350;
    slider.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
    handleScroll();
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    handleScroll();
    slider.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      slider.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <motion.section
      style={{
        marginBottom: "80px",
        position: "relative",
        background: "linear-gradient(to bottom right, #ffffff, #faf9f7)",
        borderRadius: "18px",
        padding: "32px 10px 20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div style={{ margin: "0 0 25px 16px" }}>
        <motion.h2
          style={{
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "8px",
            color: "#111",
            fontFamily: "'Pretendard Variable', sans-serif",
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
              color: "#777",
              margin: 0,
              letterSpacing: "-0.3px",
              lineHeight: "1.6",
            }}
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* ❮ 왼쪽 버튼 */}
      {!isAtStart && (
        <motion.button
          onClick={() => scroll("left")}
          style={{
            ...navButton("left"),
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
          msOverflowStyle: "none",
        }}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>

        {listings.map((listing) => (
          <motion.div
            key={listing.id}
            style={{
              flex: "0 0 300px",
              scrollSnapAlign: "start",
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <ListingCard listing={listing} />
          </motion.div>
        ))}
      </div>

      {/* ❯ 오른쪽 버튼 */}
      {!isAtEnd && (
        <motion.button
          onClick={() => scroll("right")}
          style={{
            ...navButton("right"),
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          ❯
        </motion.button>
      )}
    </motion.section>
  );
}

const navButton = (side) => ({
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
  background: "rgba(255,255,255,0.9)",
  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  transition: "opacity 0.3s ease",
});

export default CollectionSection;
