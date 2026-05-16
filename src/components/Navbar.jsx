"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import DarkModeToggle from "../components/ui/DarkModeToggle";

// Navbar links
const navLinks = [
  { label: "About Me", href: "#about", isHash: true },
  { label: "Writings & Blog", href: "/blog" },
  { label: "Electronics Projects", href: "/portfolio/electronics" },
  { label: "Software Projects", href: "/portfolio/software" },
  { label: "Technical Skills", href: "#skills", isHash: true },
  { label: "Certifications", href: "#certifications", isHash: true },
  { label: "Contact", href: "#contact", isHash: true, dividerBefore: true },
  { label: "Resume", href: "/resume" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  // Motion properties for links
  const linkMotionProps = (i) => ({
    className:
      "flex items-center px-[22px] py-[11px] text-[15px] font-bold no-underline transition-all duration-150 cursor-pointer",
    style: {
      fontFamily: "var(--font-instrument-serif)",
      color: "var(--text-secondary)",
      borderLeft: "2px solid transparent",
    },
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.2, delay: 0.04 + i * 0.03 },
    whileHover: {
      color: "var(--text-primary)",
      paddingLeft: "28px",
      borderLeftColor: "var(--text-primary)",
    },
    onClick: close,
  });

  return (
    <>
      {/* Navbar bar */}
      <nav
        className="fixed top-0 left-0 w-full h-[60px] z-[1000] flex items-center justify-between px-6 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(var(--overlay-color), 0.08)"
            : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          boxShadow: scrolled
            ? "0 1px 0 rgba(var(--overlay-color), 0.08)"
            : "none",
        }}
      >
        {/* Hamburger button */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="w-11 h-11 flex flex-col items-center justify-center gap-[5px] rounded-[10px] bg-transparent cursor-pointer p-0 transition-all duration-200 z-[1100]"
          style={{
            border: "1.5px solid",
            borderColor: open
              ? "var(--text-primary)"
              : "rgba(var(--overlay-color), 100)",
          }}
        >
          <motion.span
            className="block w-5 rounded-sm origin-center"
            style={{ height: "1.5px", backgroundColor: "var(--text-primary)" }}
            animate={open ? { y: 6.5, rotate: 45 } : { y: 0, rotate: 0 }}
            transition={{ duration: 0.3, ease: [0.68, -0.55, 0.27, 1.55] }}
          />
          <motion.span
            className="block w-5 rounded-sm origin-center"
            style={{ height: "1.5px", backgroundColor: "var(--text-primary)" }}
            animate={
              open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }
            }
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="block w-5 rounded-sm origin-center"
            style={{ height: "1.5px", backgroundColor: "var(--text-primary)" }}
            animate={open ? { y: -6.5, rotate: -45 } : { y: 0, rotate: 0 }}
            transition={{ duration: 0.3, ease: [0.68, -0.55, 0.27, 1.55] }}
          />
        </button>

        <DarkModeToggle />
      </nav>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[998]"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Dropdown menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed top-[60px] left-0 w-[260px] z-[999] pb-4 pt-2 rounded-br-2xl"
            initial={{ opacity: 0, y: -8, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: "rgba(var(--overlay-color), 0.06)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(var(--overlay-color), 0.12)",
              borderTop: "none",
              boxShadow: "4px 8px 32px rgba(var(--overlay-color), 0.10)",
              transformOrigin: "top left",
            }}
            role="menu"
          >
            <p
              className="px-[22px] pt-[10px] pb-1 text-[9px] tracking-[0.18em] uppercase font-mono"
              style={{ color: "rgba(var(--overlay-color), 0.35)" }}
            >
              Navigate
            </p>

            {navLinks.map((link, i) => (
              <div key={link.label}>
                {link.dividerBefore && (
                  <div
                    className="h-px mx-5 my-2"
                    style={{
                      backgroundColor: "rgba(var(--overlay-color), 0.12)",
                    }}
                  />
                )}

                {link.isHash ? (
                  <motion.a href={link.href} {...linkMotionProps(i)}>
                    {link.label}
                  </motion.a>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.04 + i * 0.03 }}
                  >
                    <Link
                      href={link.href}
                      onClick={close}
                      className="flex items-center px-[22px] py-[11px] text-[15px] font-bold no-underline transition-all duration-150 cursor-pointer"
                      style={{
                        fontFamily: "var(--font-instrument-serif)",
                        color: "var(--text-secondary)",
                        borderLeft: "2px solid transparent",
                        display: "flex",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--text-primary)";
                        e.currentTarget.style.paddingLeft = "28px";
                        e.currentTarget.style.borderLeftColor =
                          "var(--text-primary)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--text-secondary)";
                        e.currentTarget.style.paddingLeft = "22px";
                        e.currentTarget.style.borderLeftColor = "transparent";
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
