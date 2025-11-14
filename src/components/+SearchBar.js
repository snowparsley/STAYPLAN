import React, { useState, useEffect } from "react";

function SearchBar() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: isMobile ? "90%" : "700px",
        margin: "30px auto",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
        gap: isMobile ? "10px" : "0",
        border: "1px solid #ddd",
        borderRadius: isMobile ? "20px" : "50px",
        backgroundColor: "#fff",
        padding: isMobile ? "10px 14px" : "10px 20px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
        transition: "all 0.3s ease",
      }}
    >
      <input
        type="text"
        placeholder="어디로 떠나볼까요?"
        style={{
          flex: 1,
          width: "100%",
          border: "none",
          outline: "none",
          fontSize: isMobile ? "14px" : "16px",
          backgroundColor: "transparent",
          textAlign: isMobile ? "center" : "left",
          padding: isMobile ? "8px" : "10px",
        }}
      />
      <button
        style={{
          backgroundColor: "#ff5a5f",
          border: "none",
          color: "white",
          borderRadius: "30px",
          padding: isMobile ? "8px 16px" : "10px 20px",
          fontSize: isMobile ? "14px" : "16px",
          cursor: "pointer",
          width: isMobile ? "100%" : "auto",
          transition: "background 0.2s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#ff7a7f")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#ff5a5f")
        }
      >
        검색
      </button>
    </div>
  );
}

export default SearchBar;
