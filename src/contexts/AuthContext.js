// src/contexts/AuthContext.js
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(sessionStorage.getItem("token") || null);

  const login = async (userId, password) => {
    try {
      const res = await fetch("https://stayplanserver.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });

      const data = await res.json();

      // ⭐ 추가한 부분: 서버에서 받은 user 데이터 확인
      console.log("🔍 서버에서 받은 user 데이터:", data.user);

      if (!res.ok) {
        alert(data.message);
        return false;
      }

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

  const logout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  const updateUser = (newUser) => {
    const savedToken = sessionStorage.getItem("token");

    const updated = { ...user, ...newUser };

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
