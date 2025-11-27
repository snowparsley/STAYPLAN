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
      setUser(parsed); // role 그대로 사용 (user / admin / seller)
    }

    if (storedToken) setToken(storedToken);

    setLoading(false);
  }, []);

  // ⭐ 로그인 요청
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

      // ⭐ role 문자열 그대로 저장
      const safeUser = {
        ...data.user,
        role: data.user.role, // user / admin / seller
      };

      sessionStorage.setItem("user", JSON.stringify(safeUser));
      sessionStorage.setItem("token", data.token);

      setUser(safeUser);
      setToken(data.token);

      alert(data.message);

      // ⭐ role 기반 라우팅
      if (safeUser.role === "admin") {
        window.location.href = "/admin";
      } else if (safeUser.role === "seller") {
        window.location.href = "/seller";
      } else {
        window.location.href = "/";
      }

      return true;
    } catch (err) {
      alert("서버 연결 실패 ❌");
      return false;
    }
  };

  // ⭐ 로그아웃
  const logout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    setUser(null);
    setToken(null);
  };

  // ⭐ 유저 정보 업데이트 (role 포함)
  const updateUser = (newUser) => {
    const savedToken = sessionStorage.getItem("token");

    const updated = {
      ...user,
      ...newUser,
      role: newUser.role || user.role, // role 유지
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
