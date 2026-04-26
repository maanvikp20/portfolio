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
      // default to dark
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
      className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full 
                 bg-white/20 dark:bg-black/40 backdrop-blur 
                 flex items-center justify-center 
                 hover:scale-110 transition-all duration-300"
    >
      {dark ? (
        <FaSun className="text-yellow-300 w-5 h-5 transition-all duration-300" />
      ) : (
        <FaMoon className="text-white w-5 h-5 transition-all duration-300" />
      )}
    </button>
  );
}