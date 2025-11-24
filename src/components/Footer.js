import React from "react";
import { useTheme } from "../contexts/ThemeContext";

function Footer() {
  const { theme } = useTheme();

  /* 크리미 베이지 / 미드나잇 베이지 */
  const light = {
    bg: "#FAF7F0",
    text: "#6F6A62",
    line: "#E6E1D8",
  };

  const dark = {
    bg: "#2A2926",
    text: "#CFCAC0",
    line: "#4A4743",
  };

  const colors = theme === "dark" ? dark : light;

  return (
    <footer
      style={{
        textAlign: "center",
        padding: "40px 20px",
        borderTop: `1px solid ${colors.line}`,
        color: colors.text,
        fontFamily: "Pretendard",
        marginTop: "80px",
        fontSize: "14px",
        letterSpacing: "0.3px",
        background: colors.bg,
        transition: "0.3s ease",
      }}
    >
      © 2025 STAYPLAN — Travel Magazine Edition
    </footer>
  );
}

export default Footer;
