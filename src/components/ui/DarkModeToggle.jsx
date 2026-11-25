"use client";
import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  // The inline script in layout.jsx has already applied the theme class before
  // paint, so here we only sync React state with it (after mount, to avoid a
  // hydration mismatch).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const toggleDark = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // storage can be blocked (private mode); the theme still switches for this visit
    }
    setDark(next);
  };

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
      aria-pressed={dark}
    >
      {/* the button is always rendered so the layout doesn't shift; the icon waits for mount */}
      {mounted &&
        (dark ? (
          <FaSun
            className="w-4 h-4 transition-all duration-300"
            style={{ color: "var(--text-primary)" }}
          />
        ) : (
          <FaMoon
            className="w-4 h-4 transition-all duration-300"
            style={{ color: "var(--text-primary)" }}
          />
        ))}
    </button>
  );
}
