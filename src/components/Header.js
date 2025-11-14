//상단
import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import {
  FiLogIn,
  FiUser,
  FiChevronDown,
  FiLogOut,
  FiSettings,
  FiClipboard,
  FiUserCheck,
  FiMenu,
  FiX,
  FiMoon,
  FiSun,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

function Header() {
  const { isLoggedIn, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const dropdownRef = useRef(null);
  const myBtnRef = useRef(null);

  const THEME = useMemo(
    () => ({
      brand: "#ff5a5f",
      text: "#222",
      subText: "#444",
      border: "#e5e5e5",
      bg: "#ffffff",
      menuBg: "#222",
      menuDivider: "#444",
      focus: "rgba(255,90,95,0.35)",
    }),
    []
  );

  const menuVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: -10 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.18 } },
      exit: { opacity: 0, y: -10, transition: { duration: 0.12 } },
    }),
    []
  );

  useEffect(() => {
    const onMouseDown = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        myBtnRef.current &&
        !myBtnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMobileMenu(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setOpen(false);
    setMobileMenu(false);
    navigate("/");
    window.scrollTo(0, 0);
    window.location.reload();
  };

  const styles = {
    header: {
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: THEME.bg,
      borderBottom: `1px solid ${THEME.border}`,
      backgroundColor: theme === "dark" ? "#111" : "beige",
      transition: "0.3s ease",
    },
    headerInner: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      maxWidth: 1200,
      margin: "0 auto",
      padding: "16px 20px",
    },
    brand: {
      textDecoration: "none",
      fontWeight: 800,
      fontSize: 24,
      color: THEME.brand,
    },
    right: {
      display: "flex",
      alignItems: "center",
      gap: 14,
    },
    navLink: {
      textDecoration: "none",
      color: THEME.subText,
      fontWeight: 500,
      fontSize: 15,
      padding: "8px 10px",
      borderRadius: 10,
      transition: "background 120ms ease",
    },
    pill: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 14px",
      borderRadius: 999,
      border: `1px solid ${THEME.border}`,
      background: THEME.bg,
      color: THEME.text,
      fontWeight: 600,
      cursor: "pointer",
      textDecoration: "none",
      transition: "background 120ms ease",
    },
    dropdown: {
      position: "absolute",
      top: "calc(100% + 10px)",
      right: 0,
      minWidth: 220,
      background: THEME.menuBg,
      color: "#fff",
      borderRadius: 12,
      boxShadow: "0 12px 24px rgba(0,0,0,0.18)",
      overflow: "hidden",
    },
    menuItem: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      width: "100%",
      padding: "12px 16px",
      color: "#fff",
      textDecoration: "none",
      fontSize: 14,
      fontWeight: 500,
      cursor: "pointer",
      background: "transparent",
      border: "none",
      textAlign: "left",
    },
  };

  return (
    <header style={styles.header}>
      <div style={styles.headerInner}>
        <Link to="/" style={styles.brand}>
          STAYPLAN
        </Link>

        <div className="desktop-menu" style={styles.right}>
          {/* 💡 다크모드 토글 버튼 */}
          <button
            onClick={toggleTheme}
            style={{
              background: "none",
              border: "none",
              fontSize: "22px",
              cursor: "pointer",
              color: theme === "dark" ? "#fff" : "#444",
              transition: "0.25s",
            }}
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>

          {isLoggedIn && (
            <Link to="/reservations" style={styles.navLink}>
              예약 내역
            </Link>
          )}

          {!isLoggedIn && (
            <button
              onClick={() => navigate("/login")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "#fff",
                color: "#6e6e6e",
                border: "none",
                borderRadius: "6px",
                padding: "8px 14px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              <FiLogIn />
              <span>LOGIN</span>
            </button>
          )}

          {isLoggedIn && (
            <div style={{ position: "relative" }}>
              <button
                ref={myBtnRef}
                onClick={() => setOpen(!open)}
                style={styles.pill}
              >
                <FiUser />
                <span>마이페이지</span>
                <FiChevronDown />
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={menuVariants}
                    style={styles.dropdown}
                    ref={dropdownRef}
                  >
                    <Link to="/profile" style={styles.menuItem}>
                      <FiUserCheck /> 내 정보 보기
                    </Link>
                    <Link to="/reservations" style={styles.menuItem}>
                      <FiClipboard /> 예약 내역 보기
                    </Link>
                    {/* <Link to="/settings" style={styles.menuItem}>
                      <FiSettings /> 설정
                    </Link> */}
                    <hr style={{ height: 1, background: "#444", margin: 0 }} />
                    <button onClick={handleLogout} style={styles.menuItem}>
                      <FiLogOut /> 로그아웃
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <button
          className="mobile-toggle"
          onClick={() => setMobileMenu((prev) => !prev)}
          style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            display: "none",
            color: THEME.text,
          }}
        >
          {mobileMenu ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              background: theme === "dark" ? "#111" : "#fff",
              borderTop: `1px solid ${THEME.border}`,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "14px 20px",
                gap: "14px",
              }}
            >
              {/* 모바일에도 다크모드 버튼 추가 */}
              <button
                onClick={toggleTheme}
                style={{
                  border: "none",
                  background: "none",
                  textAlign: "left",
                  color: theme === "dark" ? "#fff" : "#444",
                  fontWeight: 600,
                  cursor: "pointer",
                  marginBottom: "8px",
                  fontSize: "16px",
                }}
              >
                {theme === "dark" ? "☀ 라이트 모드" : "🌙 다크 모드"}
              </button>

              {isLoggedIn ? (
                <>
                  <Link to="/profile" onClick={() => setMobileMenu(false)}>
                    내 정보 보기
                  </Link>
                  <Link to="/reservations" onClick={() => setMobileMenu(false)}>
                    예약 내역
                  </Link>
                  <Link to="/settings" onClick={() => setMobileMenu(false)}>
                    설정
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{
                      border: "none",
                      background: "none",
                      textAlign: "left",
                      color: THEME.brand,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  style={{
                    border: "none",
                    background: "none",
                    textAlign: "left",
                    color: THEME.brand,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  로그인
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>
        {`
          @media (max-width: 768px) {
            .desktop-menu {
              display: none !important;
            }
            .mobile-toggle {
              display: block !important;
            }
          }
        `}
      </style>
    </header>
  );
}

export default Header;
