// 로그인
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme } = useTheme();

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

  // 🎨 다크모드 스타일
  const bgGradient =
    theme === "dark"
      ? "linear-gradient(135deg, #000, #111)"
      : "linear-gradient(135deg, rgba(255,90,95,0.1), rgba(255,90,95,0.3))";

  const cardStyle = {
    background: theme === "dark" ? "#111" : "#fff",
    padding: "40px 30px",
    borderRadius: "12px",
    boxShadow:
      theme === "dark"
        ? "0 10px 30px rgba(255,255,255,0.07)"
        : "0 10px 30px rgba(0,0,0,0.1)",
    width: "90%",
    maxWidth: "380px",
    textAlign: "center",
    border: theme === "dark" ? "1px solid #333" : "1px solid #eee",
    transition: "0.25s",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: theme === "dark" ? "1px solid #444" : "1px solid #ddd",
    background: theme === "dark" ? "#222" : "#fff",
    color: theme === "dark" ? "#fff" : "#222",
    borderRadius: "6px",
    marginBottom: "14px",
    outline: "none",
    fontSize: "15px",
    transition: "0.25s",
  };

  const loginButton = {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    background: "#ff5a5f",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "16px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: bgGradient,
        padding: "20px",
        transition: "0.25s",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={cardStyle}
      >
        <h2
          style={{
            marginBottom: "25px",
            fontWeight: "700",
            fontSize: "26px",
            color: theme === "dark" ? "#fff" : "#333",
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
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          {error && <p style={{ color: "#ff5a5f" }}>{error}</p>}

          <button type="submit" style={loginButton}>
            로그인하기
          </button>
        </form>

        <div
          style={{
            marginTop: "16px",
            fontSize: "14px",
            color: theme === "dark" ? "#ccc" : "#555",
          }}
        >
          아직 계정이 없으신가요?{" "}
          <span
            style={{
              color: theme === "dark" ? "#ff767a" : "#ff5a5f",
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
