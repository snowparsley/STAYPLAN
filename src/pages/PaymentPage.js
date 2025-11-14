//결제페이지
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { theme } = useTheme();

  const [selectedMethod, setSelectedMethod] = useState("card");

  useEffect(() => {
    if (!state || !state.listing || !state.form) navigate("/");
  }, [state, navigate]);

  if (!state) return null;

  const { listing, form, nights } = state;
  const nightly = Number(listing.price) || 0;
  const nightsCount = Math.max(1, Number(nights || 1));
  const subtotal = nightly * nightsCount;
  const serviceFee = Math.round(subtotal * 0.1);
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + serviceFee + taxes;

  const pay = async () => {
    if (!token) return navigate("/login");

    try {
      const payload = {
        listing_id: listing.id,
        user_name: form.user_name,
        check_in: form.check_in,
        check_out: form.check_out,
        guests: Number(form.guests) || 1,
        total_price: total,
        status: "paid",
        payment_method: selectedMethod,
      };

      const res = await axios.post(
        "http://localhost:5000/api/reservations",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/reservation-complete", {
        state: {
          reservationId: res.data.id,
          listing,
          form,
        },
      });
    } catch (err) {
      alert("결제 중 오류 발생 ❌");
    }
  };

  // ✅ 결제 수단 정보
  const methods = [
    {
      id: "card",
      label: "신용/체크카드",
      color: "#007AFF",
      logo: "💳",
      bg: "rgba(0,122,255,0.10)",
    },
    {
      id: "kakaopay",
      label: "카카오페이",
      color: "#ffde00",
      logo: "🟡",
      bg: "rgba(255,222,0,0.18)",
    },
    {
      id: "naverpay",
      label: "네이버페이",
      color: "#03C75A",
      logo: "🟢",
      bg: "rgba(3,199,90,0.16)",
    },
  ];

  const selected = methods.find((m) => m.id === selectedMethod);

  // 🌙 라이트 / 다크 공통 색 정의
  const isDark = theme === "dark";

  const pageBackground = isDark
    ? "radial-gradient(circle at top, #1b1c20 0%, #050507 45%, #000000 100%)"
    : "linear-gradient(145deg, #f8f9fb 0%, #eef1f4 100%)";

  const headingColor = isDark ? "#f5f5f7" : "#222";
  const textColor = isDark ? "#e3e3e6" : "#222";
  const subtleText = isDark ? "#a4a4ab" : "#777";
  const borderSoft = isDark ? "#2b2b33" : "#eee";

  const mainCardBg = isDark ? "#111114" : "#ffffff";
  const sideCardBg = isDark ? "rgba(15,15,20,0.96)" : "rgba(255,255,255,0.85)";

  const mainCardShadow = isDark
    ? "0 20px 40px rgba(0,0,0,0.65)"
    : "0 20px 40px rgba(0,0,0,0.08)";

  const sideCardShadow = isDark
    ? "0 20px 40px rgba(0,0,0,0.8)"
    : "0 20px 40px rgba(0,0,0,0.10)";

  const dividerColor = isDark ? "#33333b" : "#eee";

  const totalColor = "#ff5a5f";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: pageBackground,
        padding: "80px 20px 120px",
        transition: "background 0.3s ease, color 0.3s ease",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "34px",
          fontWeight: "800",
          color: headingColor,
          marginBottom: "60px",
          letterSpacing: "-0.5px",
        }}
      >
        예약 결제 확인
      </h1>

      <div
        className="payment-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "40px",
          maxWidth: "1150px",
          margin: "0 auto",
          alignItems: "stretch",
        }}
      >
        {/* ✅ 숙소 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: mainCardBg,
            borderRadius: "20px",
            boxShadow: mainCardShadow,
            border: `1px solid ${borderSoft}`,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            transition: "background 0.3s ease, box-shadow 0.3s ease",
          }}
        >
          <img
            src={listing.thumbnail}
            alt={listing.title}
            style={{
              width: "100%",
              height: "280px",
              objectFit: "cover",
            }}
          />
          <div style={{ padding: "30px 32px" }}>
            <h2
              style={{
                margin: "0 0 6px 0",
                fontSize: "22px",
                fontWeight: "700",
                color: headingColor,
              }}
            >
              {listing.title}
            </h2>
            <p style={{ margin: "0 0 12px 0", color: subtleText }}>
              {listing.location}
            </p>
            <p
              style={{
                fontWeight: "700",
                color: totalColor,
                fontSize: "16px",
              }}
            >
              {nightly.toLocaleString()}원 / 1박
            </p>
            <hr
              style={{
                borderTop: `1px solid ${dividerColor}`,
                margin: "24px 0",
              }}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "18px",
                fontSize: "15px",
                color: textColor,
              }}
            >
              <div>
                <div style={{ color: subtleText, fontSize: "13px" }}>
                  예약자
                </div>
                <div style={{ fontWeight: 600 }}>{form.user_name}</div>
              </div>
              <div>
                <div style={{ color: subtleText, fontSize: "13px" }}>
                  게스트
                </div>
                <div style={{ fontWeight: 600 }}>{form.guests}명</div>
              </div>
              <div>
                <div style={{ color: subtleText, fontSize: "13px" }}>
                  체크인
                </div>
                <div style={{ fontWeight: 600 }}>{form.check_in}</div>
              </div>
              <div>
                <div style={{ color: subtleText, fontSize: "13px" }}>
                  체크아웃
                </div>
                <div style={{ fontWeight: 600 }}>{form.check_out}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ✅ 결제 요약 + 수단 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            background: sideCardBg,
            backdropFilter: "blur(12px)",
            borderRadius: "20px",
            padding: "32px",
            boxShadow: sideCardShadow,
            border: isDark
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(255,255,255,0.5)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transition: "background 0.3s ease, box-shadow 0.3s ease",
            color: textColor,
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: 800,
                color: headingColor,
                marginBottom: "24px",
              }}
            >
              요금 내역
            </h3>

            <div style={{ display: "grid", gap: "12px", fontSize: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>숙박 ({nightsCount}박)</span>
                <span>{subtotal.toLocaleString()}원</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>서비스 수수료</span>
                <span>{serviceFee.toLocaleString()}원</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>세금</span>
                <span>{taxes.toLocaleString()}원</span>
              </div>

              <hr
                style={{
                  border: "none",
                  borderTop: `1px solid ${dividerColor}`,
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 800,
                  fontSize: "17px",
                  marginTop: "4px",
                }}
              >
                <span>총 결제금액</span>
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  style={{ color: totalColor }}
                >
                  {total.toLocaleString()}원
                </motion.span>
              </div>
            </div>

            {/* ✅ 결제 수단 선택 (로고형) */}
            <div style={{ marginTop: "35px" }}>
              <h4
                style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  marginBottom: "16px",
                  color: headingColor,
                }}
              >
                결제 수단 선택
              </h4>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {methods.map((method) => {
                  const isActive = selectedMethod === method.id;
                  return (
                    <motion.div
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "14px 16px",
                        borderRadius: "12px",
                        border: isActive
                          ? `2px solid ${method.color}`
                          : `1px solid ${borderSoft}`,
                        background: isActive
                          ? method.bg
                          : isDark
                          ? "#141419"
                          : "#ffffff",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        boxShadow: isActive
                          ? `0 4px 16px ${method.bg}`
                          : "none",
                        color: isActive
                          ? isDark
                            ? "#ffffff"
                            : method.color
                          : subtleText,
                        fontWeight: isActive ? 700 : 500,
                      }}
                    >
                      <span
                        style={{
                          fontSize: "22px",
                          width: "28px",
                          textAlign: "center",
                        }}
                      >
                        {method.logo}
                      </span>
                      <span>{method.label}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={pay}
            style={{
              width: "100%",
              marginTop: "30px",
              background: selected.color,
              padding: "16px 0",
              borderRadius: "14px",
              border: "none",
              fontSize: "17px",
              fontWeight: 700,
              color: selectedMethod === "kakaopay" ? "#222" : "#fff", // 카카오는 원래 노란색이라 어둡게
              cursor: "pointer",
              boxShadow: `0 8px 20px ${selected.bg}`,
              transition: "all 0.3s ease",
            }}
          >
            {selected.label}로 결제하기
          </motion.button>
        </motion.div>
      </div>

      <style>
        {`
          @media (max-width: 768px) {
            .payment-grid {
              grid-template-columns: 1fr !important;
              gap: 28px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default PaymentPage;
