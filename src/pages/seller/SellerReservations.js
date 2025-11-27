import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

function SellerReservations() {
  const { token } = useAuth();
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetch("https://stayplanserver.onrender.com/api/seller/reservations", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setReservations(data))
      .catch(() => alert("예약 정보 불러오기 실패"));
  }, [token]);

  return (
    <div style={{ padding: 30 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>예약 현황</h1>

      {reservations.length === 0 ? (
        <p style={{ marginTop: 20 }}>예약된 숙소가 없습니다.</p>
      ) : (
        <div style={{ marginTop: 20 }}>
          {reservations.map((r) => (
            <div key={r.id} style={card}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>
                {r.listing_title}
              </h2>
              <p>예약자: {r.user_name}</p>
              <p>체크인: {r.check_in}</p>
              <p>체크아웃: {r.check_out}</p>
              <p>결제 금액: ₩{r.total_price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const card = {
  border: "1px solid #e5e7eb",
  padding: "16px",
  borderRadius: "8px",
  marginBottom: "12px",
  background: "#fff",
};

export default SellerReservations;
