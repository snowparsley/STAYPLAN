import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(sessionStorage.getItem("token") || null);

  /* -------------------------------------------------------
     ⭐ 로그인
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

      // ⭐ admin 여부도 user 내부에 포함됨
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
     ⭐ 로그아웃
  ------------------------------------------------------- */
  const logout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  /* -------------------------------------------------------
     ⭐ 사용자 정보 업데이트 (프로필 수정)
  ------------------------------------------------------- */
  const updateUser = (newUser) => {
    const savedToken = sessionStorage.getItem("token");

    // 🔥 admin 값 유지
    const updated = {
      ...newUser,
      admin: user?.admin || false,
    };

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
