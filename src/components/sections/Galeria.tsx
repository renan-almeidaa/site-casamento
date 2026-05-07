"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { GALLERY_PHOTOS } from "@/lib/wedding-data";
import { SectionHeader } from "./SectionHeader";

export function Galeria() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight")
        setOpenIndex((i) =>
          i === null ? null : (i + 1) % GALLERY_PHOTOS.length,
        );
      if (e.key === "ArrowLeft")
        setOpenIndex((i) =>
          i === null
            ? null
            : (i - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length,
        );
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex]);

  return (
    <section id="galeria" className="relative py-20 md:py-32 px-5">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Memórias nossas"
          title="Galeria"
          subtitle="Momentos guardados no coração — e em cada foto."
        />

        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-5">
          {GALLERY_PHOTOS.map((p, i) => (
            <motion.button
              type="button"
              key={p.src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.06 }}
              onClick={() => setOpenIndex(i)}
              className={`relative aspect-square overflow-hidden rounded-2xl group focus:outline-none focus:ring-2 focus:ring-[var(--color-champagne)] ${
                i === 0 ? "sm:col-span-2 sm:row-span-2 sm:aspect-auto" : ""
              }`}
              aria-label={`Abrir foto ${i + 1}`}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(46,34,24,0.45)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[120] bg-[rgba(46,34,24,0.92)] flex items-center justify-center p-5"
            onClick={() => setOpenIndex(null)}
          >
            <button
              type="button"
              aria-label="Fechar"
              onClick={() => setOpenIndex(null)}
              className="absolute top-5 right-5 text-white/85 hover:text-white p-2"
            >
              <X size={26} />
            </button>
            <motion.div
              key={GALLERY_PHOTOS[openIndex].src}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-4xl aspect-[4/3]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={GALLERY_PHOTOS[openIndex].src}
                alt={GALLERY_PHOTOS[openIndex].alt}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
