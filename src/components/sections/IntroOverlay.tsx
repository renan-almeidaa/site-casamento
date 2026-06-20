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
    const t = setTimeout(() => setShow(false), 2600);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-[var(--color-cream)]"
          aria-hidden
        >
          {/* Frame editorial */}
          <div
            className="absolute top-8 left-8 right-8 bottom-8 hidden md:block"
            style={{ border: "1px solid var(--color-border-soft)" }}
          />

          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.16, delayChildren: 0.15 },
              },
            }}
            className="text-center px-6 max-w-2xl"
          >
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 8 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
              }}
              className="label-uppercase mb-7"
            >
              Save the date
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, scaleX: 0 },
                show: {
                  opacity: 1,
                  scaleX: 1,
                  transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] },
                },
              }}
              className="mb-8"
            >
              <Ornament width={48} />
            </motion.div>

            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0, transition: { duration: 0.9 } },
              }}
              className="heading-hairline text-[clamp(2.8rem,9vw,6.2rem)] mb-6"
            >
              <span className="block">Vamos</span>
              <span className="italic-romance font-light text-[var(--color-champagne-deep)]">
                nos casar
              </span>
            </motion.h1>

            <motion.div
              variants={{
                hidden: { opacity: 0, scaleX: 0 },
                show: {
                  opacity: 1,
                  scaleX: 1,
                  transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] },
                },
              }}
              className="mx-auto mt-6 mb-5 h-px w-12 bg-[var(--color-champagne-deep)]"
            />

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 8 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
              className="italic-romance text-xl md:text-2xl text-[var(--color-text)]"
            >
              {WEDDING.coupleName}
            </motion.p>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 6 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
              className="mt-7 text-[10px] tracking-[0.55em] uppercase font-medium text-[var(--color-champagne-deep)]"
            >
              {WEDDING.dateShort}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
