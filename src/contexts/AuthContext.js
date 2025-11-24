import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedToken = sessionStorage.getItem("token");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);

      // admin → boolean
      parsed.admin = parsed.admin === true || parsed.admin === 1;

      setUser(parsed);
    }

    if (storedToken) setToken(storedToken);

    setLoading(false);
  }, []);

  // 로그인 요청

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

      // admin → boolean 변환
      const safeUser = {
        ...data.user,
        admin: data.user.admin === 1 || data.user.admin === true,
      };

      sessionStorage.setItem("user", JSON.stringify(safeUser));
      sessionStorage.setItem("token", data.token);

      setUser(safeUser);
      setToken(data.token);

      alert(data.message);

      // 관리자면 관리자 페이지로 이동
      if (safeUser.admin) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }

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

  // 프론트에서 유저 정보 업데이트

  const updateUser = (newUser) => {
    const savedToken = sessionStorage.getItem("token");
    const updated = {
      ...user,
      ...newUser,
      admin: newUser.admin === 1 || newUser.admin === true,
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
        loading,
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
