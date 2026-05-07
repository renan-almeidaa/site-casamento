"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SECTIONS, WEDDING } from "@/lib/wedding-data";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setMobileOpen(false);
    if (typeof window === "undefined") return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: scrolled ? 0 : -20, opacity: scrolled ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-[var(--color-border-soft)] ${
          scrolled ? "bg-[rgba(247,243,238,0.92)]" : "pointer-events-none"
        }`}
      >
        <div className="mx-auto max-w-6xl px-5 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="font-[var(--font-display)] italic text-xl text-[var(--color-ink)]"
          >
            {WEDDING.coupleName}
          </Link>
          <div className="hidden lg:flex items-center gap-7">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleNavClick(s.id)}
                className="text-[12px] tracking-[0.18em] uppercase text-[var(--color-text-soft)] hover:text-[var(--color-champagne-deep)] transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label="Abrir menu"
            className="lg:hidden p-2 -mr-2 text-[var(--color-champagne-deep)]"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-[rgba(46,34,24,0.5)] lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute right-0 top-0 h-full w-[78%] max-w-xs bg-[var(--color-cream)] shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-[var(--color-border-soft)]">
                <span className="font-[var(--font-display)] italic text-lg text-[var(--color-ink)]">
                  {WEDDING.coupleName}
                </span>
                <button
                  type="button"
                  aria-label="Fechar menu"
                  onClick={() => setMobileOpen(false)}
                  className="p-1 text-[var(--color-champagne-deep)]"
                >
                  <X size={22} />
                </button>
              </div>
              <ul className="flex-1 p-5 flex flex-col gap-1">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => handleNavClick(s.id)}
                      className="w-full text-left py-3 text-sm tracking-[0.18em] uppercase text-[var(--color-text)] hover:text-[var(--color-champagne-deep)] border-b border-[var(--color-border-soft)]"
                    >
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
