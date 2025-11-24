import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userId.trim() || !password.trim()) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    const success = await login(userId, password);
    if (success) navigate("/");
  };

  const pageBg = isDark ? "#1F1E1C" : "#FAF7F0";
  const cardBg = isDark ? "#2A2926" : "#FFFFFF";
  const cardBorder = isDark ? "#4A4743" : "#E6E1D8";
  const mainText = isDark ? "#E3DFD7" : "#4C4740";
  const subText = isDark ? "#A9A39A" : "#7A746D";

  const inputBg = isDark ? "#1A1917" : "#FFFFFF";
  const inputBorder = isDark ? "#4A4743" : "#DAD6CF";
  const inputText = isDark ? "#E3DFD7" : "#4C4740";

  const buttonBg = isDark ? "#CFCAC0" : "#5A554D";
  const buttonText = isDark ? "#1F1E1C" : "#FFFFFF";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: pageBg,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        transition: "0.3s ease",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: cardBg,
          padding: "40px 30px",
          borderRadius: 12,
          width: "90%",
          maxWidth: 380,
          textAlign: "center",
          border: `1px solid ${cardBorder}`,
          boxShadow: isDark
            ? "0 10px 25px rgba(0,0,0,0.4)"
            : "0 10px 25px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            marginBottom: 25,
            fontWeight: 700,
            fontSize: 26,
            color: mainText,
          }}
        >
          로그인
        </h2>

        <form autoComplete="off" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="아이디를 입력하세요"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 8,
              border: `1px solid ${inputBorder}`,
              background: inputBg,
              color: inputText,
              fontSize: 15,
              marginBottom: 14,
              outline: "none",
            }}
          />

          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 8,
              border: `1px solid ${inputBorder}`,
              background: inputBg,
              color: inputText,
              fontSize: 15,
              marginBottom: 14,
              outline: "none",
            }}
          />

          {error && (
            <p
              style={{
                color: "#B86B6B",
                marginTop: -4,
                marginBottom: 12,
                fontSize: 14,
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 8,
              border: "none",
              background: buttonBg,
              color: buttonText,
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            로그인하기
          </button>
        </form>

        <div
          style={{
            marginTop: 16,
            fontSize: 14,
            color: subText,
          }}
        >
          아직 계정이 없으신가요?{" "}
          <span
            style={{
              color: isDark ? "#D8C8B7" : "#A47A6B",
              cursor: "pointer",
              fontWeight: 600,
            }}
            onClick={() => navigate("/signup")}
          >
            회원가입
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;
