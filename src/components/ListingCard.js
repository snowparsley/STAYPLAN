//카드
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

function ListingCard({ listing }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [fadeOut, setFadeOut] = useState(false);

  const { id, title, location, price, thumbnail, rating } = listing || {};

  const numericPrice = Number(String(price ?? "").replace(/,/g, ""));
  const displayPrice =
    !isNaN(numericPrice) && numericPrice > 0
      ? `${numericPrice.toLocaleString()}원 / 1박`
      : "가격 정보 없음";

  const handleClick = () => {
    setFadeOut(true);
    setTimeout(() => navigate(`/listing/${id}`), 200);
  };

  /* -------------------------------
      B안: 크림 베이지 / 미드나잇 베이지
  ------------------------------- */
  const isDark = theme === "dark";

  const cardBg = isDark ? "#2A2926" : "#ffffffff";
  const cardShadow = isDark
    ? "0 4px 18px rgba(0,0,0,0.45)"
    : "0 4px 18px rgba(0,0,0,0.06)";

  const textColor = isDark ? "#E3DFD7" : "#3F3A35";
  const subText = isDark ? "#A9A39A" : "#7A746D";

  return (
    <div
      className="listing-card"
      onClick={handleClick}
      style={{
        width: "300px",
        borderRadius: "18px",
        cursor: "pointer",
        background: cardBg,
        overflow: "hidden",
        boxShadow: cardShadow,
        transition: "all 0.3s ease",
        opacity: fadeOut ? 0.4 : 1,
        color: textColor,
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-4px)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <img
        src={thumbnail || "https://via.placeholder.com/300x200"}
        alt={title || "stay"}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
        }}
      />

      <div style={{ padding: "16px 18px" }}>
        <h3
          style={{
            fontSize: "17px",
            margin: "0 0 6px",
            fontWeight: 600,
            color: textColor,
          }}
        >
          {title}
        </h3>

        <p style={{ color: subText, margin: "0 0 6px" }}>{location}</p>

        <p style={{ fontWeight: 600, marginBottom: 6, color: textColor }}>
          {displayPrice}
        </p>

        <p style={{ margin: 0, fontWeight: 500, color: textColor }}>
          ⭐ {rating ?? 4.5}
        </p>
      </div>
    </div>
  );
}

export default ListingCard;
