import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import SellerLayout from "../../components/seller/SellerLayout";

function SellerEditListing() {
  const { token } = useAuth();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    images: "",
  });

  // 기존 숙소 정보 불러오기
  useEffect(() => {
    fetch(`https://stayplanserver.onrender.com/api/seller/listing/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setForm({
          title: data.title,
          description: data.description,
          price: data.price,
          location: data.location,
          images: data.images.join(", "),
        });
      })
      .catch(() => alert("불러오기 실패"));
  }, [id, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      ...form,
      images: form.images.split(",").map((x) => x.trim()),
    };

    const res = await fetch(
      `https://stayplanserver.onrender.com/api/seller/listing/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();
    alert(data.message);

    window.location.href = "/seller/listings";
  };

  return (
    <div style={{ padding: 30 }}>
      <h1 style={{ fontSize: 28, fontWeight: "700" }}>숙소 수정</h1>

      <form onSubmit={handleSubmit} style={{ marginTop: 20, maxWidth: 500 }}>
        <label>숙소명</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          style={input}
        />

        <label>설명</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          style={textarea}
        />

        <label>가격</label>
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          style={input}
        />

        <label>위치</label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          style={input}
        />

        <label>이미지 URL (쉼표로 구분)</label>
        <input
          name="images"
          value={form.images}
          onChange={handleChange}
          style={input}
        />

        <button type="submit" style={button}>
          수정 완료
        </button>
      </form>
    </div>
  );
}

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
};

const textarea = {
  width: "100%",
  height: "100px",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
};

const button = {
  padding: "12px 20px",
  background: "#4F46E5",
  color: "#fff",
  borderRadius: "6px",
  border: "none",
  fontWeight: "bold",
  cursor: "pointer",
};

export default SellerEditListing;
