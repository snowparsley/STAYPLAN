// src/pages/ProfilePage.js
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import CollectionSection from "../components/CollectionSection";

function ProfilePage() {
  const { user, token } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [reservations, setReservations] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [badges, setBadges] = useState([]);

  /* -------------------------------------------------------
     브라우저 배경
  ------------------------------------------------------- */
  useEffect(() => {
    document.body.style.backgroundColor = isDark ? "#1A1A18" : "#FAF7F0";
    return () => (document.body.style.backgroundColor = "");
  }, [isDark]);

  /* -------------------------------------------------------
     예약 데이터 불러오기
  ------------------------------------------------------- */
  useEffect(() => {
    const loadReservations = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/my-reservations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (Array.isArray(data)) {
          setReservations(data);
          calculateBadges(data);
          loadRecommendations(data);
        }
      } catch (err) {
        console.error("❌ 예약 로딩 오류:", err);
      }
    };

    loadReservations();
  }, [token]);

  /* -------------------------------------------------------
     뱃지 계산
  ------------------------------------------------------- */
  const calculateBadges = (list) => {
    const newBadges = [];

    if (list.length >= 1) newBadges.push("첫 여행 완료");
    if (list.length >= 3) newBadges.push("3회 이상 여행자");

    const cities = new Set(list.map((r) => r.title.slice(0, 2)));
    if (cities.size >= 3) newBadges.push("3개 도시 여행");

    const totalPrice = list.reduce((s, r) => s + Number(r.total_price), 0);
    if (totalPrice >= 500000) newBadges.push("고액 여행자");

    let totalNights = 0;
    list.forEach((r) => {
      const inDate = new Date(r.check_in);
      const outDate = new Date(r.check_out);
      const diff = (outDate - inDate) / (1000 * 60 * 60 * 24);
      totalNights += diff;
    });
    if (totalNights >= 5) newBadges.push("장기 여행자");

    setBadges(newBadges);
  };

  /* -------------------------------------------------------
     추천 숙소 로딩
  ------------------------------------------------------- */
  const loadRecommendations = async (list) => {
    if (list.length === 0) return;

    const recent = list[0];
    const recentCity = recent.title.slice(0, 2);

    try {
      const res = await fetch("http://localhost:5000/api/listings");
      const data = await res.json();

      if (!Array.isArray(data)) return;

      let filtered = data.filter(
        (l) => !l.title.includes(recentCity) && l.type === "domestic"
      );

      filtered = filtered.slice(0, 3);
      setRecommended(filtered);
    } catch (err) {
      console.error("❌ 추천 로딩 오류:", err);
    }
  };

  /* -------------------------------------------------------
     스타일
  ------------------------------------------------------- */
  const c = {
    bg: isDark ? "#1A1A18" : "#FAF7F0",
    card: isDark ? "#262522" : "#FFFFFF",
    line: isDark ? "#3F3C38" : "#E9E5DD",
    text: isDark ? "#EAE6DE" : "#3F3A35",
    sub: isDark ? "#A9A39A" : "#7F776E",
  };

  const cardStyle = {
    background: c.card,
    border: `1px solid ${c.line}`,
    borderRadius: 22,
    padding: "38px",
    marginBottom: "48px",
    boxShadow: isDark
      ? "0 14px 28px rgba(0,0,0,0.6)"
      : "0 14px 28px rgba(0,0,0,0.08)",
  };

  const summaryCard = {
    flex: 1,
    background: c.card,
    border: `1px solid ${c.line}`,
    padding: "28px",
    borderRadius: 20,
    minHeight: 130,
    boxShadow: isDark
      ? "0 10px 22px rgba(0,0,0,0.5)"
      : "0 10px 22px rgba(0,0,0,0.06)",
  };

  const stats = {
    totalCount: reservations.length,
    totalPrice: reservations.reduce((s, r) => s + Number(r.total_price), 0),
    recent: reservations[0] || null,
  };

  /* -------------------------------------------------------
     JSX
  ------------------------------------------------------- */
  return (
    <div
      style={{
        maxWidth: 1150,
        margin: "60px auto 80px",
        padding: "20px",
        color: c.text,
      }}
    >
      {/* ⭐ HERO */}
      <div style={cardStyle}>
        <h2 style={{ margin: 0, fontSize: 34, fontWeight: 800 }}>
          {user?.name}님,
        </h2>
        <p style={{ marginTop: 14, color: c.sub, fontSize: 19 }}>
          따뜻했던 여행의 순간을 다시 만나보세요.
        </p>
      </div>

      {/* ⭐ SUMMARY */}
      <div style={{ display: "flex", gap: 22, marginBottom: 55 }}>
        <div style={summaryCard}>
          <h3 style={{ margin: 0, color: c.sub, fontSize: 15 }}>총 예약 수</h3>
          <p style={{ margin: "10px 0 0", fontSize: 28, fontWeight: 700 }}>
            {stats.totalCount}회
          </p>
        </div>
        <div style={summaryCard}>
          <h3 style={{ margin: 0, color: c.sub, fontSize: 15 }}>
            총 결제 금액
          </h3>
          <p style={{ margin: "10px 0 0", fontSize: 28, fontWeight: 700 }}>
            {stats.totalPrice.toLocaleString()}원
          </p>
        </div>
        <div style={summaryCard}>
          <h3 style={{ margin: 0, color: c.sub, fontSize: 15 }}>
            최근 여행 기간
          </h3>
          <p style={{ margin: "10px 0 0", fontSize: 22, fontWeight: 700 }}>
            {stats.recent
              ? `${stats.recent.check_in.slice(
                  5,
                  10
                )} ~ ${stats.recent.check_out.slice(5, 10)}`
              : "-"}
          </p>
        </div>
      </div>

      {/* ⭐ BADGES */}
      <div style={cardStyle}>
        <h3 style={{ marginBottom: 22, color: c.sub }}>여행 뱃지</h3>

        {badges.length === 0 ? (
          <p style={{ color: c.sub }}>아직 획득한 뱃지가 없습니다.</p>
        ) : (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {badges.map((b, i) => (
              <div
                key={i}
                style={{
                  padding: "10px 18px",
                  background: isDark ? "#34322E" : "#F1ECE4",
                  borderRadius: 22,
                  fontSize: 14,
                  fontWeight: 600,
                  border: `1px solid ${isDark ? "#3F3C38" : "#E0DAD2"}`,
                }}
              >
                {b}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ⭐ RECENT */}
      {stats.recent && (
        <div style={cardStyle}>
          <h3 style={{ marginBottom: 22, color: c.sub }}>최근 방문 숙소</h3>

          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <img
              src={stats.recent.thumbnail}
              alt=""
              style={{
                width: 125,
                height: 95,
                borderRadius: 14,
                objectFit: "cover",
              }}
            />
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 18 }}>
                {stats.recent.title}
              </p>
              <p style={{ marginTop: 6, color: c.sub }}>
                {stats.recent.check_in.slice(0, 10)} ~{" "}
                {stats.recent.check_out.slice(0, 10)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ⭐ RECOMMENDATIONS — 화살표 제거 적용 */}
      {recommended.length > 0 && (
        <CollectionSection
          title="다음 여행을 위한 추천"
          subtitle="최근 여행과 비슷한 분위기의 숙소를 골라봤어요."
          listings={recommended}
          hideArrows={true}
        />
      )}
    </div>
  );
}

export default ProfilePage;
