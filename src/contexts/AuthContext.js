// src/contexts/AuthContext.js
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 로그인 상태 초기화 (sessionStorage 사용)
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(sessionStorage.getItem("token") || null);

  /* -------------------------------------------------------
      로그인
  ------------------------------------------------------- */
  const login = async (userId, password) => {
    try {
      const res = await fetch("https://stayplanserver.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return false;
      }

      // 🔥 서버에서 받아온 user 정보 안에 admin 포함됨
      sessionStorage.setItem("user", JSON.stringify(data.user));
      sessionStorage.setItem("token", data.token);

      setUser(data.user);
      setToken(data.token);

      alert(data.message);
      return true;
    } catch (err) {
      alert("서버 연결 실패 ❌");
      return false;
    }
  };

  /* -------------------------------------------------------
      로그아웃
  ------------------------------------------------------- */
  const logout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  /* -------------------------------------------------------
      프로필 정보 업데이트 (name/email 수정)
  ------------------------------------------------------- */
  const updateUser = (newUser) => {
    const savedToken = sessionStorage.getItem("token"); // 유지

    const updated = { ...user, ...newUser }; // admin 포함 유지

    setUser(updated);
    setToken(savedToken);
    sessionStorage.setItem("user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        user,
        token,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
