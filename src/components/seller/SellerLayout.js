// src/components/seller/SellerLayout.js
import React, { useState } from "react";
import SellerSidebar from "./SellerSidebar";
import SellerHeader from "./SellerHeader";
import { useTheme } from "../../contexts/ThemeContext";
import { FiMenu } from "react-icons/fi";

function SellerLayout({ children }) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);

  const isDark = theme === "dark";
  const bgColor = isDark ? "#1A1A18" : "#FAF7F0";
  const textColor = isDark ? "#EFEDE8" : "#4A3F35";

  return (
    <div style={{ display: "flex", background: bgColor, minHeight: "100vh" }}>
      {/* PC 모드 사이드바 */}
      <div className="seller-sidebar-pc">
        <SellerSidebar />
      </div>

      {/* 모바일 햄버거 버튼 */}
      <button className="seller-mobile-menu-btn" onClick={() => setOpen(true)}>
        <FiMenu size={26} />
      </button>

      {/* 모바일 Sidebar Drawer */}
      <div className={`seller-drawer ${open ? "open" : ""}`}>
        <SellerSidebar closeMenu={() => setOpen(false)} />
      </div>

      {/* 오버레이 */}
      {open && (
        <div className="seller-overlay" onClick={() => setOpen(false)} />
      )}

      {/* 메인 영역 */}
      <div style={{ flex: 1 }}>
        <SellerHeader onOpenSidebar={() => setOpen(true)} />

        <div
          style={{
            padding: "40px 32px",
            color: textColor,
          }}
        >
          {children}
        </div>
      </div>

      {/* 스타일 */}
      <style>{`
        /* PC 사이드바 */
        .seller-sidebar-pc {
          display: block;
        }

        /* 모바일 버튼 */
        .seller-mobile-menu-btn {
          display: none;
          position: fixed;
          top: 16px;
          left: 16px;
          background: ${bgColor};
          border: 1px solid rgba(0,0,0,0.1);
          padding: 8px;
          border-radius: 8px;
          z-index: 20;
        }

        /* Drawer 기본 상태 */
        .seller-drawer {
          display: none;
        }

        /* 오버레이 */
        .seller-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.4);
          z-index: 9;
        }

        /* 모바일 반응형 */
        @media (max-width: 768px) {

          .seller-sidebar-pc {
            display: none;
          }

          .seller-mobile-menu-btn {
            display: block;
          }

          .seller-drawer {
            display: block;
            position: fixed;
            top: 0;
            left: -260px;
            width: 240px;
            height: 100vh;
            background: ${bgColor};
            border-right: 1px solid rgba(0,0,0,0.1);
            transition: left 0.3s ease;
            z-index: 10;
          }

          .seller-drawer.open {
            left: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default SellerLayout;
