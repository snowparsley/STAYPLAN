import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { useTheme } from "../../contexts/ThemeContext";

function EditListing() {
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
    title: "",
    location: "",
    price: "",
    description: "",
    type: "",
  });

  const [loading, setLoading] = useState(true);

  /* -----------------------------
        1) 숙소 데이터 불러오기
  ----------------------------- */
  const fetchListing = async () => {
    try {
      const res = await fetch(
        `https://stayplanserver.onrender.com/api/admin/listings/${id}`
      );
      const data = await res.json();

      setForm({
        title: data.title || "",
        location: data.location || "",
        price: data.price || "",
        description: data.description || "",
        type: data.type || "",
      });

      setLoading(false);
    } catch (err) {
      alert("숙소 정보를 불러올 수 없습니다.");
      navigate("/admin/listings");
    }
  };

  useEffect(() => {
    fetchListing();
  }, []);

  /* -----------------------------
        2) 숙소 수정 저장
  ----------------------------- */
  const saveListing = async () => {
    // 필수 검증
    if (!form.title.trim()) return alert("숙소명을 입력해주세요.");
    if (!form.location.trim()) return alert("숙소 위치를 입력해주세요.");
    if (!form.price || isNaN(Number(form.price)))
      return alert("가격은 숫자로 입력해주세요.");
    if (!form.type.trim()) return alert("숙소 타입을 선택해주세요.");

    if (!window.confirm("정말 저장하시겠습니까?")) return;

    try {
      const res = await fetch(
        `https://stayplanserver.onrender.com/api/admin/listings/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            price: Number(form.price), // 숫자 변환
          }),
        }
      );

      const result = await res.json();
      if (!res.ok) {
        alert(result.message || "수정 실패");
        return;
      }

      alert("숙소 수정 완료!");
      navigate("/admin/listings");
    } catch (err) {
      alert("서버 오류: 저장 실패");
    }
  };

  /* -----------------------------
        3) Input 변경
  ----------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
            숙소 정보 수정
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
            {/* title */}
            <label style={labelStyle(c)}>숙소명</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="예: 강릉 오션뷰 하우스"
              style={inputStyle(c)}
            />

            {/* location */}
            <label style={labelStyle(c)}>위치</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="예: 강릉"
              style={inputStyle(c)}
            />

            {/* price */}
            <label style={labelStyle(c)}>가격(1박)</label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="예: 120000"
              style={inputStyle(c)}
            />

            {/* type */}
            <label style={labelStyle(c)}>타입</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              style={inputStyle(c)}
            >
              <option value="">선택해주세요</option>
              <option value="domestic">국내</option>
              <option value="abroad">해외</option>
            </select>

            {/* description */}
            <label style={labelStyle(c)}>설명</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="숙소 설명을 입력하세요."
              style={{
                ...inputStyle(c),
                height: 120,
                resize: "none",
              }}
            />

            {/* 저장 버튼 */}
            <button style={saveBtn} onClick={saveListing}>
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

export default EditListing;
