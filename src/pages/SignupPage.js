import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function SignupPage() {
  const navigate = useNavigate();
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
      const res = await fetch("http://localhost:5000/api/signup", {
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

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, rgba(255,90,95,0.1), rgba(255,90,95,0.3))",
        padding: "20px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: "white",
          padding: "40px 30px",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          width: "90%",
          maxWidth: "380px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            marginBottom: "25px",
            fontWeight: "700",
            fontSize: "26px",
            color: "#333",
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
            <p
              style={{
                color: "#ff5a5f",
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              {error}
            </p>
          )}

          <button type="submit" style={signupButton} disabled={loading}>
            {loading ? "가입 중..." : "회원가입하기"}
          </button>
        </form>

        <div style={{ marginTop: "16px", fontSize: "14px", color: "#555" }}>
          이미 계정이 있으신가요?{" "}
          <span
            style={{ color: "#ff5a5f", cursor: "pointer", fontWeight: 600 }}
            onClick={() => navigate("/login")}
          >
            로그인
          </span>
        </div>
      </motion.div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  marginBottom: "14px",
  outline: "none",
  fontSize: "15px",
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

export default SignupPage;
