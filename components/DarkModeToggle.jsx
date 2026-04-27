"use client";
import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      document.documentElement.classList.remove("dark");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
    setMounted(true);
  }, []);

  const toggleDark = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDark(!dark);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleDark}
      className="w-11 h-11 z-[1100] rounded-[10px] bg-transparent
                 flex items-center justify-center
                 hover:scale-110 transition-all duration-300"
      style={{
        border: "1.5px solid rgba(var(--overlay-color), 0.25)",
      }}
      aria-label="Toggle dark mode"
    >
      {dark ? (
        <FaSun
          className="w-4 h-4 transition-all duration-300"
          style={{ color: "var(--text-primary)" }}
        />
      ) : (
        <FaMoon
          className="w-4 h-4 transition-all duration-300"
          style={{ color: "var(--text-primary)" }}
        />
      )}
    </button>
  );
}