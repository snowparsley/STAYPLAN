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
  FiMoon,
  FiSun,
  FiBell,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

function Header() {
  const { isLoggedIn, logout, user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const btnRef = useRef(null);

  const light = {
    bg: "#faf7f0ff",
    text: "#663e3eff",
    sub: "#6F6A62",
    line: "#E6E1D8",
    menuBg: "#FFFFFF",
    hover: "#f1ebe2",
  };

  const dark = {
    bg: "#2A2926",
    text: "#EFEDE8",
    sub: "#CFCAC0",
    line: "#4A4743",
    menuBg: "#34322D",
    hover: "#3d3c38",
  };

  const colors = theme === "dark" ? dark : light;

  const menuAnim = {
    hidden: { opacity: 0, y: -6 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.18 } },
    exit: { opacity: 0, y: -6, transition: { duration: 0.12 } },
  };

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

  useEffect(() => {
    setOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/");
    window.scrollTo(0, 0);
  };

  if (loading) return null;
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

        <div
          className="desktop-menu"
          style={{ display: "flex", gap: 14, alignItems: "center" }}
        >
          {/* 테마 토글 */}
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

          {/* 로그인 버튼 */}
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

          {/* 드롭다운 */}
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
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      style={dropItem(colors)}
                    >
                      <FiUserCheck /> 내 정보
                    </Link>

                    <Link
                      to="/reservations"
                      className="dropdown-item"
                      style={dropItem(colors)}
                    >
                      <FiClipboard /> 예약 내역
                    </Link>

                    <Link
                      to="/settings"
                      className="dropdown-item"
                      style={dropItem(colors)}
                    >
                      <FiUserCheck /> 설정
                    </Link>

                    {/* ⭐ 공지사항 추가 */}
                    <Link
                      to="/notices"
                      className="dropdown-item"
                      style={dropItem(colors)}
                    >
                      <FiBell /> 공지사항
                    </Link>

                    <hr
                      style={{
                        border: 0,
                        height: 1,
                        background: colors.line,
                      }}
                    />

                    <button
                      onClick={handleLogout}
                      className="dropdown-item"
                      style={{
                        ...dropItem(colors),
                      }}
                    >
                      <FiLogOut /> 로그아웃
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* 테두리 제거 CSS */}
      <style>{`
        .dropdown-item:hover {
          background: ${colors.hover} !important;
          transition: 0.2s;
        }

        button {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }

        button:focus,
        button:active,
        button:focus-visible {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }

        .dropdown-item,
        .dropdown-item:focus,
        .dropdown-item:active,
        .dropdown-item:focus-visible,
        .dropdown-item:visited {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
      `}</style>
    </header>
  );
}

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
  border: "none",
  outline: "none",
  boxShadow: "none",
  transition: "0.2s",
});

export default Header;
