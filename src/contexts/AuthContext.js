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
      setUser(parsed);
    }

    if (storedToken) setToken(storedToken);

    setLoading(false);
  }, []);

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

      // ⭐ 서버에서 받은 user 정보만 정확히 저장
      const safeUser = {
        id: data.user.id,
        user_id: data.user.user_id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role, // admin / seller / user
      };

      sessionStorage.setItem("user", JSON.stringify(safeUser));
      sessionStorage.setItem("token", data.token);

      setUser(safeUser);
      setToken(data.token);

      alert(data.message);

      // ⭐ 역할 기반 리디렉션
      if (safeUser.role === "admin") window.location.href = "/admin";
      else if (safeUser.role === "seller") window.location.href = "/seller";
      else window.location.href = "/";

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

    const updated = {
      ...user,
      ...newUser,
      role: newUser.role || user.role,
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
