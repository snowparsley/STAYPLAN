// src/pages/admin/AdminNoticeEdit.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";

function AdminNoticeEdit() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    content: "",
    visible: true,
  });

  /* 📌 기존 공지 불러오기 */
  const fetchNotice = async () => {
    try {
      const res = await fetch(
        `https://stayplanserver.onrender.com/api/admin/notices/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "공지사항 조회 실패");
        navigate("/admin/notices");
        return;
      }

      setForm({
        title: data.title,
        content: data.content,
        visible: data.visible === 1,
      });

      setLoading(false);
    } catch {
      alert("서버 오류");
      navigate("/admin/notices");
    }
  };

  useEffect(() => {
    fetchNotice();
  }, []);

  /* 📌 input 핸들러 */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* 📌 공지 수정 저장 */
  const saveNotice = async () => {
    if (!form.title.trim()) return alert("제목을 입력해주세요.");
    if (!form.content.trim()) return alert("내용을 입력해주세요.");

    if (!window.confirm("공지사항을 수정할까요?")) return;

    try {
      const res = await fetch(
        `https://stayplanserver.onrender.com/api/admin/notices/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (!res.ok) return alert(data.message || "수정 실패");

      alert("수정 완료되었습니다!");
      navigate("/admin/notices");
    } catch {
      alert("서버 오류: 수정 실패");
    }
  };

  /* 📌 로딩 표시 */
  if (loading) {
    return (
      <AdminLayout>
        <main style={{ padding: 40, color: c.text }}>불러오는 중...</main>
      </AdminLayout>
    );
  }

  /* 📌 화면 렌더 */
  return (
    <AdminLayout>
      <main
        style={{
          padding: "20px",
          maxWidth: 850,
          margin: "0 auto",
          color: c.text,
        }}
      >
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
          공지사항 수정
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
          />

          {/* 내용 */}
          <label style={label(c)}>내용</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            style={{
              ...input(c),
              height: 180,
              resize: "vertical",
            }}
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
            공지사항 수정하기
          </button>
        </div>
      </main>
    </AdminLayout>
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

export default AdminNoticeEdit;
