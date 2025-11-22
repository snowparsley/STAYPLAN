// src/components/Header.js
import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import {
  FiLogIn,
  FiUser,
  FiChevronDown,
  FiLogOut,
  FiClipboard,
  FiUserCheck,
  FiMenu,
  FiX,
  FiMoon,
  FiSun,
  FiShield,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

function Header() {
  const { isLoggedIn, logout, user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const dropdownRef = useRef(null);
  const btnRef = useRef(null);

  const light = {
    bg: "#faf7f0ff",
    text: "#663e3eff",
    sub: "#6F6A62",
    line: "#E6E1D8",
    menuBg: "#FFFFFF",
  };

  const dark = {
    bg: "#2A2926",
    text: "#EFEDE8",
    sub: "#CFCAC0",
    line: "#4A4743",
    menuBg: "#34322D",
  };

  const colors = theme === "dark" ? dark : light;

  const menuAnim = {
    hidden: { opacity: 0, y: -6 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.18 } },
    exit: { opacity: 0, y: -6, transition: { duration: 0.12 } },
  };

  /* 🔥 클릭 외부 감지 → 드롭다운 닫기 */
  useEffect(() => {
    const onMouseDown = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  /* 페이지 이동 시 드롭다운 닫힘 */
  useEffect(() => {
    setOpen(false);
    setMobileMenu(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/");
    window.scrollTo(0, 0);
  };

  /* 🔥 로딩 중에는 헤더 숨김 (초기 "0" 문제 해결) */
  if (loading) return null;

  /* 🔥 관리자(admin) 계정이면 헤더 완전 숨김 */
  if (user?.admin) return null;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: colors.bg,
        borderBottom: `1px solid ${colors.line}`,
        transition: "0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* 로고 */}
        <div
          onClick={() => {
            navigate("/");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: colors.text,
            letterSpacing: "0.45px",
            cursor: "pointer",
          }}
        >
          STAYPLAN
        </div>

        {/* PC 메뉴 */}
        <div
          className="desktop-menu"
          style={{ display: "flex", gap: 14, alignItems: "center" }}
        >
          {/* 다크모드 버튼 */}
          <button
            onClick={toggleTheme}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 22,
              color: colors.text,
            }}
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>

          {/* 로그인 전 */}
          {!isLoggedIn && (
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "none",
                border: `1px solid ${colors.line}`,
                padding: "8px 14px",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
                color: colors.text,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <FiLogIn />
              LOGIN
            </button>
          )}

          {/* 로그인 후 */}
          {isLoggedIn && (
            <div style={{ position: "relative" }}>
              <button
                ref={btnRef}
                onClick={() => setOpen(!open)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 14px",
                  borderRadius: 999,
                  border: `1px solid ${colors.line}`,
                  background: colors.bg,
                  color: colors.text,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                <FiUser />
                마이페이지
                <FiChevronDown />
              </button>

              {/* 드롭다운 메뉴 */}
              <AnimatePresence>
                {open && (
                  <motion.div
                    variants={menuAnim}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    ref={dropdownRef}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      minWidth: 230,
                      background: colors.menuBg,
                      borderRadius: 12,
                      border: `1px solid ${colors.line}`,
                      boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                      overflow: "hidden",
                    }}
                  >
                    <Link to="/profile" style={dropItem(colors)}>
                      <FiUserCheck /> 내 정보
                    </Link>

                    <Link to="/reservations" style={dropItem(colors)}>
                      <FiClipboard /> 예약 내역
                    </Link>

                    <Link to="/settings" style={dropItem(colors)}>
                      <FiUserCheck /> 설정
                    </Link>

                    <hr
                      style={{
                        border: 0,
                        height: 1,
                        background: colors.line,
                      }}
                    />

                    <button onClick={handleLogout} style={dropItem(colors)}>
                      <FiLogOut /> 로그아웃
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* 모바일 메뉴 버튼 */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenu((p) => !p)}
          style={{
            background: "none",
            border: "none",
            fontSize: 26,
            cursor: "pointer",
            color: colors.text,
            display: "none",
          }}
        >
          {mobileMenu ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* 모바일 메뉴 */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              background: colors.bg,
              borderTop: `1px solid ${colors.line}`,
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {/* 다크모드 */}
            <button
              onClick={toggleTheme}
              style={{
                background: "none",
                border: "none",
                textAlign: "left",
                color: colors.text,
                fontWeight: 600,
              }}
            >
              {theme === "dark" ? "☀ 라이트 모드" : "🌙 다크 모드"}
            </button>

            {/* 로그인 전 */}
            {!isLoggedIn ? (
              <button
                onClick={() => navigate("/login")}
                style={mobileItem(colors)}
              >
                로그인
              </button>
            ) : (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenu(false)}
                  style={mobileItem(colors)}
                >
                  내 정보 보기
                </Link>

                <Link
                  to="/reservations"
                  onClick={() => setMobileMenu(false)}
                  style={mobileItem(colors)}
                >
                  예약 내역
                </Link>

                <button onClick={handleLogout} style={mobileItem(colors)}>
                  로그아웃
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 반응형 */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}

/* 드롭다운 item 스타일 */
const dropItem = (colors) => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "12px 16px",
  width: "100%",
  background: "none",
  color: colors.text,
  fontSize: 15,
  cursor: "pointer",
  textDecoration: "none",
});

/* 모바일 item 스타일 */
const mobileItem = (colors) => ({
  color: colors.text,
  fontWeight: 600,
  padding: "6px 0",
  cursor: "pointer",
  textAlign: "left",
});

export default Header;
