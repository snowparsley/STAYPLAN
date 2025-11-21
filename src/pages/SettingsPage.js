import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

function SettingsPage() {
  const { user, token, logout, updateUser } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const API = "https://stayplanserver.onrender.com/api";

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  /* 전체 배경 */
  useEffect(() => {
    document.body.style.background = isDark ? "#1A1A18" : "#FAF7F0";
    return () => (document.body.style.background = "");
  }, [isDark]);

  /* B안 팔레트 */
  const c = {
    bg: isDark ? "#1A1A18" : "#FAF7F0",
    card: isDark ? "#2A2926" : "#FFFFFF",
    line: isDark ? "#4A4743" : "#E6E1D8",
    text: isDark ? "#EAE6DE" : "#3F3A35",
    sub: isDark ? "#A9A39A" : "#7A746D",
    input: isDark ? "#34322E" : "#F7F4ED",
    button: isDark ? "#CFCAC0" : "#5A554D",
    buttonText: isDark ? "#1A1A18" : "#FFFFFF",
    danger: "#C66A6A",
  };

  /* -------------------------- 저장하기 -------------------------- */
  const saveProfile = async () => {
    try {
      const res = await axios.patch(`${API}/profile/update`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(res.data.message);
      updateUser({ ...user, ...form });
    } catch (err) {
      alert("정보 저장 실패 ❌");
    }
  };

  /* -------------------------- 비밀번호 변경 -------------------------- */
  const changePassword = async () => {
    if (passwordForm.next !== passwordForm.confirm)
      return alert("새 비밀번호가 일치하지 않습니다.");

    try {
      const res = await axios.patch(
        `${API}/profile/password`,
        {
          currentPassword: passwordForm.current,
          newPassword: passwordForm.next,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);
      setPasswordForm({ current: "", next: "", confirm: "" });
    } catch (err) {
      alert("비밀번호 변경 실패 ❌");
    }
  };

  /* -------------------------- 회원 탈퇴 -------------------------- */
  const deleteUser = async () => {
    if (!window.confirm("정말 탈퇴하시겠습니까?")) return;

    try {
      const res = await axios.delete(`${API}/profile/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(res.data.message);
      logout();
    } catch (err) {
      alert("회원 탈퇴 실패 ❌");
    }
  };

  /* 공통 스타일 */
  const card = {
    background: c.card,
    border: `1px solid ${c.line}`,
    borderRadius: 22,
    padding: "40px",
    marginBottom: 50,
    boxShadow: isDark
      ? "0 14px 30px rgba(0,0,0,0.55)"
      : "0 14px 30px rgba(0,0,0,0.08)",
    transition: ".25s ease",
  };

  const input = {
    width: "100%",
    padding: "14px 16px",
    marginTop: 10,
    marginBottom: 25,
    background: c.input,
    border: `1px solid ${c.line}`,
    color: c.text,
    borderRadius: 12,
    outline: "none",
    fontSize: 15,
    transition: ".25s",
  };

  const btn = {
    padding: "14px 24px",
    borderRadius: 12,
    border: "none",
    background: c.button,
    color: c.buttonText,
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 15,
  };

  const dangerBtn = {
    padding: "14px 24px",
    background: c.danger,
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 15,
  };

  return (
    <div
      style={{
        maxWidth: 950,
        margin: "70px auto 100px",
        padding: "0 20px",
        color: c.text,
      }}
    >
      {/* HEADER */}
      <div style={card}>
        <h2 style={{ margin: 0, fontSize: 34, fontWeight: 800, color: c.text }}>
          계정 설정
        </h2>
        <p style={{ marginTop: 12, color: c.sub, fontSize: 17 }}>
          프로필, 보안, 개인정보를 관리하세요.
        </p>
      </div>

      {/* 프로필 정보 */}
      <div style={card}>
        <h3 style={{ marginBottom: 25, color: c.sub }}>✨ 프로필 정보 수정</h3>

        <label>닉네임</label>
        <input
          style={input}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label>이메일</label>
        <input
          style={input}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <button style={btn} onClick={saveProfile}>
          저장하기
        </button>
      </div>

      {/* 비밀번호 변경 */}
      <div style={card}>
        <h3 style={{ marginBottom: 25, color: c.sub }}>🔐 비밀번호 변경</h3>

        <label>현재 비밀번호</label>
        <input
          type="password"
          style={input}
          value={passwordForm.current}
          onChange={(e) =>
            setPasswordForm({ ...passwordForm, current: e.target.value })
          }
        />

        <label>새 비밀번호</label>
        <input
          type="password"
          style={input}
          value={passwordForm.next}
          onChange={(e) =>
            setPasswordForm({ ...passwordForm, next: e.target.value })
          }
        />

        <label>새 비밀번호 확인</label>
        <input
          type="password"
          style={input}
          value={passwordForm.confirm}
          onChange={(e) =>
            setPasswordForm({ ...passwordForm, confirm: e.target.value })
          }
        />

        <button style={btn} onClick={changePassword}>
          비밀번호 변경
        </button>
      </div>

      {/* 회원 탈퇴 */}
      <div style={{ textAlign: "center", marginTop: 60 }}>
        <button style={dangerBtn} onClick={deleteUser}>
          회원 탈퇴
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
