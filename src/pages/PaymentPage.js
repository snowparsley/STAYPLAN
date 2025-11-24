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
  const isDark = theme === "dark";
  const checkInDate = new Date(form.check_in);
  const checkOutDate = new Date(form.check_out);
  const isInvalidDate = checkOutDate <= checkInDate;

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

      // Render 서버 URL로 변경됨
      const res = await axios.post(
        "https://stayplanserver.onrender.com/api/reservations",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/reservation-complete", {
        state: { reservationId: res.data.id, listing, form },
      });
    } catch (err) {
      alert("결제 중 오류 발생 ❌");
    }
  };

  const pageBg = isDark ? "#1F1E1C" : "#FAF7F0";
  const cardBg = isDark ? "#2A2926" : "#FFFFFF";
  const sideCardBg = isDark ? "#252422" : "#FFFFFF";
  const lineColor = isDark ? "#4A4743" : "#E6E1D8";

  const headingColor = isDark ? "#E3DFD7" : "#3F3A35";
  const textColor = isDark ? "#D8D4CC" : "#4B463F";
  const subtleText = isDark ? "#A9A39A" : "#7A746D";

  const mainShadow = isDark
    ? "0 14px 34px rgba(0,0,0,0.5)"
    : "0 14px 34px rgba(0,0,0,0.08)";

  const buttonBg = isDark ? "#CFCAC0" : "#5A554D";
  const buttonText = isDark ? "#1F1E1C" : "#FFFFFF";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: pageBg,
        padding: "80px 20px 120px",
        transition: "0.3s ease",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: 34,
          fontWeight: 800,
          color: headingColor,
          marginBottom: 60,
        }}
      >
        예약 결제 확인
      </h1>

      <div
        className="payment-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 40,
          maxWidth: 1150,
          margin: "0 auto",
        }}
      >
        {/* 숙소 정보 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: cardBg,
            borderRadius: 20,
            border: `1px solid ${lineColor}`,
            overflow: "hidden",
            boxShadow: mainShadow,
          }}
        >
          <img
            src={listing.thumbnail}
            alt={listing.title}
            style={{
              width: "100%",
              height: 280,
              objectFit: "cover",
            }}
          />

          <div style={{ padding: "30px 32px" }}>
            <h2
              style={{
                margin: "0 0 8px 0",
                fontSize: 22,
                fontWeight: 700,
                color: headingColor,
              }}
            >
              {listing.title}
            </h2>

            <p style={{ margin: "0 0 16px 0", color: subtleText }}>
              {listing.location}
            </p>

            <p
              style={{
                color: "#A47A6B",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              {nightly.toLocaleString()}원 / 1박
            </p>

            <hr
              style={{ borderTop: `1px solid ${lineColor}`, margin: "24px 0" }}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 18,
                color: textColor,
                fontSize: 15,
              }}
            >
              <Info label="예약자" value={form.user_name} subtle={subtleText} />
              <Info
                label="게스트"
                value={`${form.guests}명`}
                subtle={subtleText}
              />
              <Info label="체크인" value={form.check_in} subtle={subtleText} />
              <Info
                label="체크아웃"
                value={form.check_out}
                subtle={subtleText}
              />
            </div>
          </div>
        </motion.div>

        {/* 결제 요약 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            background: sideCardBg,
            borderRadius: 20,
            padding: 32,
            border: `1px solid ${lineColor}`,
            boxShadow: mainShadow,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: textColor,
          }}
        >
          <div>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 800,
                marginBottom: 26,
                color: headingColor,
              }}
            >
              요금 내역
            </h3>

            <PriceRow label={`숙박 (${nightsCount}박)`} value={subtotal} />
            <PriceRow label="서비스 수수료" value={serviceFee} />
            <PriceRow label="세금" value={taxes} />

            <hr
              style={{ borderTop: `1px solid ${lineColor}`, margin: "22px 0" }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 800,
                fontSize: 17,
              }}
            >
              <span>총 결제금액</span>
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{ color: "#A47A6B" }}
              >
                {total.toLocaleString()}원
              </motion.span>
            </div>

            <h4
              style={{
                fontSize: 17,
                fontWeight: 700,
                marginTop: 32,
                marginBottom: 16,
                color: headingColor,
              }}
            >
              결제 수단 선택
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["card", "kakaopay", "naverpay"].map((m) => (
                <PayMethod
                  key={m}
                  id={m}
                  selected={selectedMethod}
                  onSelect={setSelectedMethod}
                  isDark={isDark}
                  lineColor={lineColor}
                  subtleText={subtleText}
                />
              ))}
            </div>
          </div>

          <motion.button
            whileHover={isInvalidDate ? {} : { scale: 1.05 }}
            whileTap={isInvalidDate ? {} : { scale: 0.97 }}
            onClick={isInvalidDate ? null : pay}
            disabled={isInvalidDate}
            style={{
              width: "100%",
              marginTop: 30,
              background: isInvalidDate ? "#9e9e9e" : buttonBg,
              padding: "15px 0",
              borderRadius: 14,
              border: "none",
              color: buttonText,
              fontSize: 17,
              fontWeight: 700,
              cursor: isInvalidDate ? "not-allowed" : "pointer",
              opacity: isInvalidDate ? 0.6 : 1,
              transition: "0.3s",
            }}
          >
            {isInvalidDate ? "날짜를 다시 선택해주세요" : "결제하기"}
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

function Info({ label, value, subtle }) {
  return (
    <div>
      <div style={{ color: subtle, fontSize: 13 }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function PriceRow({ label, value }) {
  return (
    <div
      style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}
    >
      <span>{label}</span>
      <span>{value.toLocaleString()}원</span>
    </div>
  );
}

function PayMethod({ id, selected, onSelect, isDark, lineColor, subtleText }) {
  const logos = {
    card: "💳",
    kakaopay: "🟡",
    naverpay: "🟢",
  };

  const labels = {
    card: "신용/체크카드",
    kakaopay: "카카오페이",
    naverpay: "네이버페이",
  };

  const active = selected === id;

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(id)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 16px",
        borderRadius: 12,
        border: active ? "2px solid #A47A6B" : `1px solid ${lineColor}`,
        background: active
          ? isDark
            ? "rgba(164,122,107,0.22)"
            : "rgba(164,122,107,0.12)"
          : isDark
          ? "#1F1E1C"
          : "#FFFFFF",
        cursor: "pointer",
        color: active ? "#A47A6B" : subtleText,
        fontWeight: active ? 700 : 500,
        transition: "0.28s",
      }}
    >
      <span style={{ fontSize: 22 }}>{logos[id]}</span>
      {labels[id]}
    </motion.div>
  );
}

export default PaymentPage;
