import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

function SettingsPage() {
  const { user, token, logout, updateUser } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    document.body.style.backgroundColor = isDark ? "#1A1A18" : "#FAF7F0";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [isDark]);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const API = "https://stayplanserver.onrender.com/api";

  const palette = {
    light: {
      bg: "#FAF7F0",
      card: "#FFFFFF",
      line: "#E6E1D8",
      text: "#5A554D",
      sub: "#7A746D",
      input: "#F7F4ED",
      button: "#A47A6B",
      buttonText: "#FFF",
      danger: "#C66A6A",
    },
    dark: {
      bg: "#1A1A18",
      card: "#2A2926",
      line: "#4A4743",
      text: "#E3DFD7",
      sub: "#A9A39A",
      input: "#34322E",
      button: "#CFCAC0",
      buttonText: "#1A1A18",
      danger: "#C66A6A",
    },
  };

  const c = palette[isDark ? "dark" : "light"];

  // 프로필 저장
  const saveProfile = async () => {
    try {
      const res = await axios.patch(`${API}/profile/update`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(res.data.message);
      updateUser({ ...user, name: form.name, email: form.email });
    } catch (err) {
      console.error(err.response || err);
      alert("정보 저장 실패 ❌");
    }
  };

  // 비밀번호 변경
  const changePassword = async () => {
    if (passwordForm.next !== passwordForm.confirm) {
      return alert("새 비밀번호가 일치하지 않습니다.");
    }

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
      console.error(err.response || err);
      alert("비밀번호 변경 실패 ❌");
    }
  };

  // 회원 탈퇴
  const deleteUser = async () => {
    if (!window.confirm("정말 탈퇴하시겠습니까?")) return;

    try {
      const res = await axios.delete(`${API}/profile/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(res.data.message);
      logout();
    } catch (err) {
      console.error(err.response || err);
      alert("회원 탈퇴 실패 ❌");
    }
  };

  const sectionStyle = {
    background: c.card,
    border: `1px solid ${c.line}`,
    borderRadius: 18,
    padding: "35px",
    marginBottom: "45px",
    transition: "0.3s ease",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: 8,
    marginBottom: 18,
    borderRadius: 10,
    border: `1px solid ${c.line}`,
    background: c.input,
    color: c.text,
    outline: "none",
  };

  const buttonStyle = {
    padding: "12px 20px",
    background: c.button,
    color: c.buttonText,
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
    marginTop: 5,
  };

  const dangerBtn = {
    padding: "12px 20px",
    background: c.danger,
    color: "white",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "60px auto",
        padding: "20px",
        color: c.text,
      }}
    >
      <div style={sectionStyle}>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 600 }}>계정 설정</h2>
        <p style={{ marginTop: 10, color: c.sub }}>
          프로필 및 계정 보안 정보를 변경할 수 있습니다.
        </p>
      </div>

      <div style={sectionStyle}>
        <h3 style={{ marginBottom: 20, color: c.sub }}>프로필 정보 수정</h3>

        <label>닉네임</label>
        <input
          style={inputStyle}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label>이메일</label>
        <input
          style={inputStyle}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <button style={buttonStyle} onClick={saveProfile}>
          저장하기
        </button>
      </div>

      <div style={sectionStyle}>
        <h3 style={{ marginBottom: 20, color: c.sub }}>비밀번호 변경</h3>

        <label>현재 비밀번호</label>
        <input
          type="password"
          style={inputStyle}
          value={passwordForm.current}
          onChange={(e) =>
            setPasswordForm({ ...passwordForm, current: e.target.value })
          }
        />

        <label>새 비밀번호</label>
        <input
          type="password"
          style={inputStyle}
          value={passwordForm.next}
          onChange={(e) =>
            setPasswordForm({ ...passwordForm, next: e.target.value })
          }
        />

        <label>새 비밀번호 확인</label>
        <input
          type="password"
          style={inputStyle}
          value={passwordForm.confirm}
          onChange={(e) =>
            setPasswordForm({ ...passwordForm, confirm: e.target.value })
          }
        />

        <button style={buttonStyle} onClick={changePassword}>
          비밀번호 변경
        </button>
      </div>

      <div style={{ textAlign: "center", marginTop: 50 }}>
        <button style={dangerBtn} onClick={deleteUser}>
          회원 탈퇴
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
