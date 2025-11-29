import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------------------
  //  localStorage에서 로그인 정보 불러오기
  // ---------------------------
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);

    setLoading(false);
  }, []);

  // ---------------------------
  //      로그인 처리
  // ---------------------------
  const login = async (userId, password, navigate) => {
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

      const safeUser = {
        id: data.user.id,
        user_id: data.user.user_id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      };

      // ⭐ localStorage 저장
      localStorage.setItem("user", JSON.stringify(safeUser));
      localStorage.setItem("token", data.token);

      setUser(safeUser);
      setToken(data.token);

      alert(data.message);

      if (safeUser.role === "admin") navigate("/admin");
      else if (safeUser.role === "seller") navigate("/seller");
      else navigate("/");

      return true;
    } catch (err) {
      alert("서버 연결 실패 ❌");
      return false;
    }
  };

  // ---------------------------
  //      로그아웃
  // ---------------------------
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  // ---------------------------
  //      유저 정보 업데이트
  // ---------------------------
  const updateUser = (newUser) => {
    const savedToken = localStorage.getItem("token");

    const updated = {
      ...user,
      ...newUser,
      role: newUser.role || user.role,
    };

    setUser(updated);
    setToken(savedToken);

    localStorage.setItem("user", JSON.stringify(updated));
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
