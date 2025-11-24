import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";

function AdminNoticeNew() {
  const { theme } = useTheme();
  const { token } = useAuth();
  const navigate = useNavigate();

  const isDark = theme === "dark";

  const c = {
    bg: isDark ? "#2A2926" : "#F7F5EF",
    card: isDark ? "#34322D" : "#FFFFFF",
    text: isDark ? "#EFEDE8" : "#4A3F35",
    sub: isDark ? "#CFCAC0" : "#7A746D",
    line: isDark ? "#3F3C38" : "#E5E1D8",
  };

  const [form, setForm] = useState({
    title: "",
    content: "",
    visible: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveNotice = async () => {
    if (!form.title.trim()) return alert("제목을 입력해주세요.");
    if (!form.content.trim()) return alert("내용을 입력해주세요.");

    if (!window.confirm("새 공지사항을 등록할까요?")) return;

    try {
      const res = await fetch(
        "https://stayplanserver.onrender.com/api/admin/notices",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (!res.ok) return alert(data.message || "등록 실패");

      alert("공지사항이 등록되었습니다!");
      navigate("/admin/notices");
    } catch (err) {
      alert("서버 오류: 등록 실패");
    }
  };

  return (
    <main
      style={{
        padding: "20px",
        maxWidth: 850,
        margin: "0 auto",
        color: c.text,
      }}
    >
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        공지사항 작성
      </h2>

      <div
        style={{
          background: c.card,
          padding: 24,
          borderRadius: 14,
          border: `1px solid ${c.line}`,
          boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
        }}
      >
        {/* 제목 */}
        <label style={label(c)}>제목</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          style={input(c)}
          placeholder="공지 제목을 입력하세요"
        />

        {/* 내용 */}
        <label style={label(c)}>내용</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          style={{ ...input(c), height: 180, resize: "vertical" }}
          placeholder="공지 내용을 입력하세요"
        />

        {/* 공개 여부 */}
        <label style={{ ...label(c), marginTop: 10 }}>공개 여부</label>
        <div style={{ marginBottom: 20 }}>
          <input
            type="checkbox"
            name="visible"
            checked={form.visible}
            onChange={handleChange}
            style={{ marginRight: 8 }}
          />
          <span style={{ color: c.text }}>공개</span>
        </div>

        <button style={saveBtn} onClick={saveNotice}>
          공지사항 등록하기
        </button>
      </div>
    </main>
  );
}

/* 공통 스타일 */
const label = (c) => ({
  color: c.sub,
  fontWeight: 700,
  display: "block",
  marginBottom: 6,
  marginTop: 14,
});

const input = (c) => ({
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
  marginTop: 20,
  cursor: "pointer",
  fontSize: 16,
};

export default AdminNoticeNew;
