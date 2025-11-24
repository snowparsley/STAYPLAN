// src/contexts/ThemeContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const getInitialTheme = () => {
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;

  // 시스템 설정 따라가기 (옵션)
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    // body에 light/dark 클래스 정리
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
