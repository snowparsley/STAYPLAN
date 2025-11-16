import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import axios from "axios";

function ProfilePage() {
  const { user, token, logout } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [profile] = useState(user);
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState({
    totalCount: 0,
    totalPrice: 0,
    recent: null,
  });

  const [form, setForm] = useState({
    name: user?.name,
    email: user?.email,
  });

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  // 🔥 공통 API 주소
  const API = import.meta.env.VITE_API_URL;

  // 예약 통계 불러오기
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/api/my-reservations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        setReservations(data);

        let totalPrice = data.reduce(
          (sum, r) => sum + Number(r.total_price),
          0
        );

        setStats({
          totalCount: data.length,
          totalPrice,
          recent: data[0] || null,
        });
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [token, API]);

  // 프로필 정보 수정
  const saveProfile = async () => {
    const res = await axios.patch(`${API}/api/profile/update`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.ok) {
      alert("정보가 저장되었습니다.");
    }
  };

  // 비밀번호 변경
  const changePassword = async () => {
    if (passwordForm.next !== passwordForm.confirm) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    const res = await axios.patch(
      `${API}/api/profile/password`,
      {
        currentPassword: passwordForm.current,
        newPassword: passwordForm.next,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.data.ok) {
      alert("비밀번호가 변경되었습니다.");
    }
  };

  // 회원 탈퇴
  const deleteUser = async () => {
    if (!window.confirm("정말 탈퇴하시겠습니까?")) return;

    await axios.delete(`${API}/api/profile/delete`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("탈퇴 완료되었습니다.");
    logout();
  };

  // 색상
  const boxBg = isDark ? "#111" : "#fff";
  const textColor = isDark ? "#ddd" : "#222";
  const borderColor = isDark ? "#333" : "#ddd";

  if (!user) return <div>로그인이 필요합니다</div>;

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "60px auto",
        padding: "20px",
        color: textColor,
      }}
    >
      {/* 프로필 카드 */}
      <div
        style={{
          background: boxBg,
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
          marginBottom: "40px",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "black", fontSize: "30px" }}>
          {profile?.name}님 환영합니다
        </h2>
      </div>

      {/* 예약 통계 */}
      <div
        style={{
          background: boxBg,
          padding: "25px",
          borderRadius: "16px",
          marginBottom: "40px",
        }}
      >
        <h3>📊 예약 통계</h3>
        <p>
          총 예약 수: <b>{stats.totalCount}</b>
        </p>
        <p>
          총 결제 금액: <b>{stats.totalPrice.toLocaleString()}원</b>
        </p>

        {stats.recent && (
          <div style={{ marginTop: "15px" }}>
            <h4>최근 예약:</h4>
            <img
              src={`${API}/${stats.recent.thumbnail}`}
              alt=""
              style={{ width: "100%", borderRadius: "12px" }}
            />
            <p style={{ marginTop: 10 }}>
              {stats.recent.title}
              <br />
              {stats.recent.check_in.slice(0, 10)} ~{" "}
              {stats.recent.check_out.slice(0, 10)}
            </p>
          </div>
        )}
      </div>

      {/* 개인정보 수정 */}
      <div
        style={{
          background: boxBg,
          padding: "25px",
          borderRadius: "16px",
          marginBottom: "40px",
        }}
      >
        <h3>👤 개인정보 수정</h3>

        <label>이름</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={inputStyle(borderColor, boxBg, textColor)}
        />

        <label>이메일</label>
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={inputStyle(borderColor, boxBg, textColor)}
        />

        <button style={btnStyle} onClick={saveProfile}>
          저장하기
        </button>
      </div>

      {/* 비밀번호 변경 */}
      <div
        style={{
          background: boxBg,
          padding: "25px",
          borderRadius: "16px",
          marginBottom: "40px",
        }}
      >
        <h3>🔐 비밀번호 변경</h3>

        <label>현재 비밀번호</label>
        <input
          type="password"
          value={passwordForm.current}
          onChange={(e) =>
            setPasswordForm({ ...passwordForm, current: e.target.value })
          }
          style={inputStyle(borderColor, boxBg, textColor)}
        />

        <label>새 비밀번호</label>
        <input
          type="password"
          value={passwordForm.next}
          onChange={(e) =>
            setPasswordForm({ ...passwordForm, next: e.target.value })
          }
          style={inputStyle(borderColor, boxBg, textColor)}
        />

        <label>새 비밀번호 확인</label>
        <input
          type="password"
          value={passwordForm.confirm}
          onChange={(e) =>
            setPasswordForm({ ...passwordForm, confirm: e.target.value })
          }
          style={inputStyle(borderColor, boxBg, textColor)}
        />

        <button style={btnStyle} onClick={changePassword}>
          비밀번호 변경
        </button>
      </div>

      {/* 탈퇴 */}
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <button
          onClick={deleteUser}
          style={{
            padding: "12px 22px",
            background: "#d9534f",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "700",
          }}
        >
          회원 탈퇴
        </button>
      </div>
    </div>
  );
}

function inputStyle(borderColor, boxBg, textColor) {
  return {
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    marginBottom: "14px",
    borderRadius: "10px",
    border: `1px solid ${borderColor}`,
    background: boxBg,
    color: textColor,
  };
}

const btnStyle = {
  padding: "12px 20px",
  background: "#ff5a5f",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
};

export default ProfilePage;
