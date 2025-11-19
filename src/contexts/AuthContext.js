import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(sessionStorage.getItem("token") || null);

  // 로그인
  const login = async (userId, password) => {
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message);
        return false;
      }

      // localStorage → sessionStorage 변경
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

  // 로그아웃
  const logout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  // 사용자 정보 업데이트
  const updateUser = (newUser) => {
    const savedToken = sessionStorage.getItem("token");
    setUser(newUser);
    setToken(savedToken);
    sessionStorage.setItem("user", JSON.stringify(newUser));
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
