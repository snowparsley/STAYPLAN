// src/pages/seller/SellerAddListing.js
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import SellerLayout from "../../components/seller/SellerLayout";

function SellerAddListing() {
  const { token } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    images: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      ...form,
      images: form.images.split(",").map((img) => img.trim()),
    };

    const res = await fetch(
      "https://stayplanserver.onrender.com/api/seller/add-listing",
      {
        method: "POST",
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
    <div style={{ padding: "30px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>숙소 등록하기</h1>

      <form
        onSubmit={handleSubmit}
        style={{ marginTop: "20px", maxWidth: "500px" }}
      >
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

        <label>이미지 URL (쉼표로 여러 개 입력)</label>
        <input
          name="images"
          value={form.images}
          onChange={handleChange}
          style={input}
        />

        <button type="submit" style={button}>
          등록하기
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

export default SellerAddListing;
