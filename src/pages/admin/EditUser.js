// src/pages/admin/EditUser.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { token } = useAuth();
  const isDark = theme === "dark";

  const c = {
    bg: isDark ? "#2A2926" : "#F7F5EF",
    card: isDark ? "#34322D" : "#FFFFFF",
    text: isDark ? "#EFEDE8" : "#4A3F35",
    sub: isDark ? "#CFCAC0" : "#7A746D",
    line: isDark ? "#3F3C38" : "#E5E1D8",
  };

  const [form, setForm] = useState({
    user_id: "",
    name: "",
    email: "",
    admin: false,
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await fetch(
        `https://stayplanserver.onrender.com/api/admin/users/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "불러오기 실패");
        navigate("/admin/users");
        return;
      }

      setForm({
        user_id: data.user_id,
        name: data.name,
        email: data.email,
        admin: data.admin === 1,
        newPassword: "",
        confirmPassword: "",
      });

      setLoading(false);
    } catch (err) {
      alert("유저 정보를 불러올 수 없습니다.");
      navigate("/admin/users");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveUser = async () => {
    if (!form.user_id.trim()) return alert("유저 ID를 입력해주세요.");
    if (!form.name.trim()) return alert("이름을 입력해주세요.");
    if (!form.email.trim() || !form.email.includes("@"))
      return alert("유효한 이메일을 입력해주세요.");

    if (!window.confirm("정보를 저장할까요?")) return;

    try {
      const res = await fetch(
        `https://stayplanserver.onrender.com/api/admin/users/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: form.user_id,
            name: form.name,
            email: form.email,
            admin: form.admin ? 1 : 0,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) return alert(data.message || "수정 실패");

      alert("수정 완료!");
      navigate("/admin/users");
    } catch (err) {
      alert("서버 오류: 수정 실패");
    }
  };

  const resetPassword = async () => {
    if (form.newPassword.length < 4)
      return alert("비밀번호는 최소 4자리 이상이어야 합니다.");

    if (form.newPassword !== form.confirmPassword)
      return alert("비밀번호가 일치하지 않습니다.");

    if (!window.confirm("정말 비밀번호를 재설정하시겠습니까?")) return;

    try {
      const res = await fetch(
        `https://stayplanserver.onrender.com/api/admin/users/${id}/password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newPassword: form.newPassword }),
        }
      );

      const data = await res.json();
      if (!res.ok) return alert(data.message || "재설정 실패");

      alert("비밀번호가 재설정되었습니다!");

      setForm((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      alert("서버 오류: 비밀번호 재설정 실패");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", height: "100vh", background: c.bg }}>
        <AdminSidebar />
        <div style={{ flex: 1 }}>
          <AdminHeader />
          <main style={{ padding: 40, color: c.text }}>불러오는 중...</main>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: c.bg }}>
      <AdminSidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <AdminHeader />

        <main
          style={{
            padding: "40px 50px",
            maxWidth: 600,
            width: "100%",
            color: c.text,
          }}
        >
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 30 }}>
            유저 수정
          </h2>

          <div
            style={{
              background: c.card,
              padding: 30,
              borderRadius: 14,
              border: `1px solid ${c.line}`,
              boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
            }}
          >
            <label style={labelStyle(c)}>유저 ID</label>
            <input
              name="user_id"
              value={form.user_id}
              onChange={handleChange}
              style={inputStyle(c)}
            />

            <label style={labelStyle(c)}>이름</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              style={inputStyle(c)}
            />

            <label style={labelStyle(c)}>이메일</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              style={inputStyle(c)}
            />

            <label style={labelStyle(c)}>관리자 권한</label>
            <div style={{ marginBottom: 20 }}>
              <input
                type="checkbox"
                name="admin"
                checked={form.admin}
                onChange={handleChange}
                style={{ marginRight: 8 }}
              />
              <span style={{ color: c.text }}>관리자 여부</span>
            </div>

            <h3 style={{ marginTop: 25, marginBottom: 10, color: c.text }}>
              비밀번호 재설정
            </h3>

            <label style={labelStyle(c)}>새 비밀번호</label>
            <input
              name="newPassword"
              type="password"
              value={form.newPassword}
              onChange={handleChange}
              style={inputStyle(c)}
              placeholder="새 비밀번호"
            />

            <label style={labelStyle(c)}>비밀번호 확인</label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              style={inputStyle(c)}
              placeholder="비밀번호 재입력"
            />

            <button style={resetBtn} onClick={resetPassword}>
              비밀번호 재설정
            </button>

            <button style={saveBtn} onClick={saveUser}>
              정보 저장하기
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ====== 스타일 ====== */

const labelStyle = (c) => ({
  color: c.sub,
  fontWeight: 700,
  display: "block",
  marginBottom: 6,
  marginTop: 14,
});

const inputStyle = (c) => ({
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: `1px solid ${c.line}`,
  background: c.bg,
  color: c.text,
  marginBottom: 12,
  fontSize: 15,
  outline: "none",
});

/* 버튼 */
const resetBtn = {
  width: "100%",
  padding: "12px 0",
  borderRadius: 10,
  background: "#6D8BB8",
  color: "#fff",
  fontWeight: 700,
  border: "none",
  marginTop: 10,
  cursor: "pointer",
  fontSize: 15,
};

const saveBtn = {
  width: "100%",
  padding: "14px 0",
  borderRadius: 10,
  background: "#A47A6B",
  color: "#fff",
  fontWeight: 800,
  border: "none",
  marginTop: 20,
  cursor: "pointer",
  fontSize: 16,
};

export default EditUser;
