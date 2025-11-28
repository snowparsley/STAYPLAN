// src/pages/seller/SellerListings.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import SellerLayout from "../../components/seller/SellerLayout";

function SellerListings() {
  const { token } = useAuth();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetch("https://stayplanserver.onrender.com/api/seller/my-listings", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setListings(data))
      .catch(() => alert("불러오기 실패"));
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제할까요?")) return;

    const res = await fetch(
      `https://stayplanserver.onrender.com/api/seller/listing/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    alert(data.message);

    setListings(listings.filter((item) => item.id !== id));
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>내 숙소 목록</h1>

      <Link to="/seller/add-listing" style={button}>
        새 숙소 등록하기
      </Link>

      {listings.length === 0 ? (
        <p style={{ marginTop: "20px" }}>등록된 숙소가 없습니다.</p>
      ) : (
        <div style={{ marginTop: "20px" }}>
          {listings.map((item) => (
            <div key={item.id} style={card}>
              <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
                {item.title}
              </h2>
              <p style={{ margin: "8px 0" }}>{item.location}</p>

              <button
                onClick={() => handleDelete(item.id)}
                style={deleteButton}
              >
                삭제하기
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const button = {
  display: "inline-block",
  marginTop: "10px",
  padding: "10px 16px",
  background: "#4F46E5",
  color: "#fff",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "bold",
};

const card = {
  border: "1px solid #e5e7eb",
  padding: "16px",
  borderRadius: "8px",
  marginBottom: "12px",
  background: "#fff",
};

const deleteButton = {
  background: "#DC2626",
  color: "#fff",
  padding: "8px 14px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
};

export default SellerListings;
