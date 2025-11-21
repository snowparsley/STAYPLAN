// 회원가입 페이지 (B안 톤 + 다크모드 완전 호환)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

function SignupPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [form, setForm] = useState({
    userId: "",
    password: "",
    name: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!form.userId || !form.password || !form.name || !form.email) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      // ⭐ Render 서버 주소로 변경됨
      const res = await fetch(
        "https://stayplanserver.onrender.com/api/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "회원가입 실패");
        setLoading(false);
        return;
      }

      alert(data.message);
      navigate("/login");
    } catch (err) {
      setError("서버 연결 실패");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // 🌙 B안 샌드스톤 톤 적용
  // -------------------------------
  const pageBg = isDark ? "#1F1E1C" : "#FAF7F0";
  const cardBg = isDark ? "#2A2926" : "#FFFFFF";
  const lineColor = isDark ? "#4A4743" : "#E6E1D8";
  const textColor = isDark ? "#E3DFD7" : "#3F3A35";

  const inputBg = isDark ? "#1A1917" : "#FFFFFF";
  const inputBorder = isDark ? "#4A4743" : "#D8D3C8";

  const buttonBg = isDark ? "#CFCAC0" : "#5A554D";
  const buttonText = isDark ? "#1F1E1C" : "#FFFFFF";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: pageBg,
        padding: "20px",
        transition: "0.3s ease",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{
          background: cardBg,
          padding: "40px 32px",
          borderRadius: "14px",
          width: "92%",
          maxWidth: "420px",
          border: `1px solid ${lineColor}`,
          boxShadow: isDark
            ? "0 12px 28px rgba(0,0,0,0.55)"
            : "0 10px 28px rgba(0,0,0,0.08)",
          color: textColor,
        }}
      >
        <h2
          style={{
            marginBottom: "26px",
            fontWeight: 700,
            fontSize: "26px",
            textAlign: "center",
          }}
        >
          회원가입
        </h2>

        <form onSubmit={handleSignup}>
          {["userId", "password", "name", "email"].map((field) => (
            <input
              key={field}
              type={field === "password" ? "password" : "text"}
              name={field}
              placeholder={
                field === "userId"
                  ? "아이디"
                  : field === "password"
                  ? "비밀번호"
                  : field === "name"
                  ? "이름"
                  : "이메일"
              }
              value={form[field]}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "14px",
                marginBottom: "14px",
                borderRadius: "10px",
                border: `1px solid ${inputBorder}`,
                background: inputBg,
                color: textColor,
                fontSize: "15px",
                outline: "none",
              }}
            />
          ))}

          {error && (
            <p
              style={{
                color: "#ff5a5f",
                fontSize: "14px",
                marginBottom: "10px",
                textAlign: "left",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "10px",
              background: buttonBg,
              color: buttonText,
              fontWeight: 700,
              fontSize: "16px",
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            {loading ? "가입 중..." : "회원가입하기"}
          </button>
        </form>

        <div
          style={{
            marginTop: "18px",
            fontSize: "14px",
            textAlign: "center",
            color: textColor,
          }}
        >
          이미 계정이 있으신가요?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{
              color: isDark ? "#D8C8B7" : "#A47A6B",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            로그인
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default SignupPage;
