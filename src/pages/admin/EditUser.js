import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { useTheme } from "../../contexts/ThemeContext";

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const c = {
    bg: isDark ? "#2A2926" : "#F4F4F4",
    card: isDark ? "#34322D" : "#FFFFFF",
    text: isDark ? "#EFEDE8" : "#4a3f35",
    sub: isDark ? "#CFCAC0" : "#7a746d",
    line: isDark ? "#3F3C38" : "#e5e1d8",
  };

  const [form, setForm] = useState({
    user_id: "",
    name: "",
    email: "",
    admin: false,
  });

  const [loading, setLoading] = useState(true);

  /* -------------------------------------------
        1) 유저 정보 불러오기
  ------------------------------------------- */
  const fetchUser = async () => {
    try {
      const res = await fetch(
        `https://stayplanserver.onrender.com/api/admin/users/${id}`
      );
      const data = await res.json();

      setForm({
        user_id: data.user_id || "",
        name: data.name || "",
        email: data.email || "",
        admin: data.admin === 1,
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

  /* -------------------------------------------
        2) input 변경 핸들러
  ------------------------------------------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* -------------------------------------------
        3) 수정 저장
  ------------------------------------------- */
  const saveUser = async () => {
    // 유효성 검사
    if (!form.user_id.trim()) return alert("유저 ID를 입력해주세요.");
    if (!form.name.trim()) return alert("이름을 입력해주세요.");
    if (!form.email.trim()) return alert("이메일을 입력해주세요.");
    if (!form.email.includes("@"))
      return alert("유효한 이메일을 입력해주세요.");

    if (!window.confirm("저장하시겠습니까?")) return;

    try {
      const res = await fetch(
        `https://stayplanserver.onrender.com/api/admin/users/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            admin: form.admin ? 1 : 0, // boolean → 0/1
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "수정 실패");
        return;
      }

      alert("수정 완료!");
      navigate("/admin/users");
    } catch (err) {
      alert("서버 오류: 수정 실패");
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

        <main style={{ padding: "40px 50px", maxWidth: 600, color: c.text }}>
          <h2
            style={{
              fontSize: 26,
              fontWeight: 800,
              marginBottom: 30,
            }}
          >
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
            {/* user_id */}
            <label style={labelStyle(c)}>유저 ID</label>
            <input
              name="user_id"
              value={form.user_id}
              onChange={handleChange}
              placeholder="예: minsu123"
              style={inputStyle(c)}
            />

            {/* name */}
            <label style={labelStyle(c)}>이름</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="예: 김민수"
              style={inputStyle(c)}
            />

            {/* email */}
            <label style={labelStyle(c)}>이메일</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="예: example@naver.com"
              style={inputStyle(c)}
            />

            {/* admin */}
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

            {/* 저장 버튼 */}
            <button style={saveBtn} onClick={saveUser}>
              저장하기
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ------------------ 스타일 ------------------- */
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

const saveBtn = {
  width: "100%",
  padding: "14px 0",
  borderRadius: 10,
  background: "#A47A6B",
  color: "#fff",
  fontWeight: 800,
  border: "none",
  marginTop: 10,
  cursor: "pointer",
  fontSize: 16,
};

export default EditUser;
