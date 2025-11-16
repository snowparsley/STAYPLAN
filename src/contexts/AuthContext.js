import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // 🔥 배포/개발 환경 공통 API 주소
  const API = import.meta.env.VITE_API_URL;
  // 예: https://stayplan-server.onrender.com

  const login = async (userId, password) => {
    try {
      const res = await fetch(`${API}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "로그인 실패 ❌");
        return false;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setToken(data.token);

      alert(data.message);
      return true;
    } catch (err) {
      alert("서버 연결 실패 ❌");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!token, user, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
