// src/components/ListingCard.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ListingCard({ listing }) {
  const navigate = useNavigate();
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

  return (
    <div
      onClick={handleClick}
      style={{
        width: "300px", // ✅ 슬라이드 정렬 안정화
        borderRadius: "18px",
        cursor: "pointer",
        background: "#fff",
        overflow: "hidden",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        opacity: fadeOut ? 0.4 : 1,
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-5px)")
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

      <div style={{ padding: "16px" }}>
        <h3
          style={{
            fontSize: "17px",
            margin: "0 0 6px",
            fontWeight: 600,
          }}
        >
          {title}
        </h3>

        <p style={{ color: "#777", margin: "0 0 6px" }}>{location}</p>

        <p style={{ fontWeight: 600, marginBottom: 6 }}>{displayPrice}</p>

        <p style={{ margin: 0, fontWeight: 500 }}>⭐ {rating ?? 4.5}</p>
      </div>
    </div>
  );
}

export default ListingCard;
