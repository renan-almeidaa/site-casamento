"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { GALLERY_PHOTOS } from "@/lib/wedding-data";
import { SectionHeader } from "./SectionHeader";

// Mostra esse número de fotos antes do "ver mais". 6 mantém o grid
// 3x2 do desktop com a primeira em destaque 2x2 (ocupa 4 células
// das 9 do 3x3 visível) e mais 5 fotos preenchendo o resto.
const INITIAL_COUNT = 6;
// Mini-thumbs de prévia mostradas acima do botão "ver mais".
const PREVIEW_COUNT = 4;

export function Galeria() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);

  const totalCount = GALLERY_PHOTOS.length;
  const hasMore = totalCount > INITIAL_COUNT;
  const remaining = totalCount - INITIAL_COUNT;
  const visiblePhotos = expanded
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.slice(0, INITIAL_COUNT);
  const previewPhotos = !expanded && hasMore
    ? GALLERY_PHOTOS.slice(INITIAL_COUNT, INITIAL_COUNT + PREVIEW_COUNT)
    : [];

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight")
        setOpenIndex((i) => (i === null ? null : (i + 1) % totalCount));
      if (e.key === "ArrowLeft")
        setOpenIndex((i) =>
          i === null ? null : (i - 1 + totalCount) % totalCount,
        );
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, totalCount]);

  return (
    <section id="galeria" className="relative py-20 md:py-32 px-5">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Memórias nossas"
          title="Galeria"
          subtitle="Momentos guardados no coração, e em cada foto."
        />

        <motion.div
          layout
          className="mt-14 grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-5"
        >
          {visiblePhotos.map((p, i) => (
            <motion.button
              layout
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
        </motion.div>

        {hasMore && (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mt-10 flex flex-col items-center"
          >
            {!expanded && previewPhotos.length > 0 && (
              <div className="flex items-center justify-center gap-2 mb-6">
                {previewPhotos.map((p) => (
                  <div
                    key={p.src}
                    className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-[var(--color-border-soft)] opacity-70"
                    aria-hidden
                  >
                    <Image
                      src={p.src}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                ))}
                {remaining > PREVIEW_COUNT && (
                  <div
                    className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-[var(--color-cream-deep)] border border-[var(--color-border-soft)] text-[var(--color-champagne-deep)] font-[var(--font-display)] text-sm font-light"
                    aria-hidden
                  >
                    +{remaining - PREVIEW_COUNT}
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[var(--color-champagne-deep)] text-[var(--color-champagne-darker)] hover:bg-[var(--color-champagne-darker)] hover:text-[var(--color-cream)] text-[11px] tracking-[0.32em] uppercase font-medium transition-colors"
            >
              {expanded ? (
                <>
                  <ChevronUp size={14} />
                  Ver menos
                </>
              ) : (
                <>
                  <ChevronDown size={14} />
                  Ver mais {remaining} foto{remaining > 1 ? "s" : ""}
                </>
              )}
            </button>

            {!expanded && (
              <p className="mt-3 text-[10px] tracking-[0.35em] uppercase text-[var(--color-champagne-light)]">
                {totalCount} fotos no total
              </p>
            )}
          </motion.div>
        )}
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
            <p className="absolute top-6 left-6 text-white/60 text-xs tracking-[0.3em] uppercase">
              {openIndex + 1} / {totalCount}
            </p>
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
