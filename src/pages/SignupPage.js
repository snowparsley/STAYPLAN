// src/pages/SignupPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";

function SignupPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [form, setForm] = useState({
    userId: "",
    password: "",
    name: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 공통 API 주소
  const API = import.meta.env.VITE_API_URL;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!form.userId || !form.password || !form.name || !form.email) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

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

  const signupButton = {
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
          회원가입
        </h2>

        <form autoComplete="off" onSubmit={handleSignup}>
          <input
            type="text"
            name="userId"
            placeholder="아이디를 입력하세요"
            value={form.userId}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="password"
            name="password"
            placeholder="비밀번호를 입력하세요"
            value={form.password}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="text"
            name="name"
            placeholder="이름을 입력하세요"
            value={form.name}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="email"
            name="email"
            placeholder="이메일을 입력하세요"
            value={form.email}
            onChange={handleChange}
            style={inputStyle}
          />

          {error && (
            <p style={{ color: "#ff5a5f", fontSize: "14px", marginBottom: 10 }}>
              {error}
            </p>
          )}

          <button type="submit" style={signupButton} disabled={loading}>
            {loading ? "가입 중..." : "회원가입하기"}
          </button>
        </form>

        <div
          style={{
            marginTop: "16px",
            fontSize: "14px",
            color: theme === "dark" ? "#ccc" : "#555",
          }}
        >
          이미 계정이 있으신가요?{" "}
          <span
            style={{
              color: theme === "dark" ? "#ff767a" : "#ff5a5f",
              cursor: "pointer",
              fontWeight: 600,
            }}
            onClick={() => navigate("/login")}
          >
            로그인
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default SignupPage;
