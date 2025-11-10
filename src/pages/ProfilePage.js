import React from "react";
import { useAuth } from "../contexts/AuthContext";

function ProfilePage() {
  const { user } = useAuth();

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "80px auto",
        padding: "40px 20px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "25px" }}>
        내 정보 보기
      </h2>

      {user ? (
        <div style={{ lineHeight: "1.8", fontSize: "16px" }}>
          <p>
            <strong>아이디:</strong> {user.id}
          </p>
          <p>
            <strong>이름:</strong> {user.name || "이름 정보 없음"}
          </p>
          <p>
            <strong>이메일:</strong> {user.email || "이메일 정보 없음"}
          </p>
          <p>
            <strong>가입일:</strong> {user.created_at || "정보 없음"}
          </p>
        </div>
      ) : (
        <p style={{ color: "#777" }}>로그인된 사용자 정보가 없습니다.</p>
      )}
    </div>
  );
}

export default ProfilePage;
