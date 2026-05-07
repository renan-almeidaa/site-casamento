"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { WEDDING } from "@/lib/wedding-data";
import { Ornament } from "@/components/ui/ornament";

const SESSION_KEY = "intro-shown";

export function IntroOverlay() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem(SESSION_KEY);
    if (seen) return;
    setShow(true);
    sessionStorage.setItem(SESSION_KEY, "1");
    const t = setTimeout(() => setShow(false), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-[var(--color-cream)]"
          aria-hidden
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center px-6"
          >
            <Ornament width={50} className="mb-5" />
            <p className="label-uppercase mb-4">Save the date</p>
            <h1 className="heading-display text-5xl sm:text-6xl md:text-7xl mb-3">
              Vamos nos casar
            </h1>
            <p
              className="font-[var(--font-display)] text-2xl md:text-3xl italic"
              style={{ color: "var(--color-champagne-deep)" }}
            >
              {WEDDING.coupleName}
            </p>
            <div className="mx-auto mt-5 h-px w-12 bg-[var(--color-champagne)]" />
            <p className="mt-5 text-xs tracking-[0.4em] uppercase text-[var(--color-champagne-light)]">
              {WEDDING.dateShort}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
