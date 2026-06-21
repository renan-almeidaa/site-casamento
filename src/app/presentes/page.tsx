"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PRESENTES, CATEGORIAS } from "@/data/presentes";
import { GiftCard } from "@/components/presentes/GiftCard";
import { CartDrawer } from "@/components/presentes/CartDrawer";
import { CartFab } from "@/components/presentes/CartFab";
import { Ornament } from "@/components/ui/ornament";
import { Footer } from "@/components/layout/Footer";

export default function PresentesPage() {
  const [cat, setCat] = useState<string>("todos");
  const filtered =
    cat === "todos"
      ? PRESENTES
      : PRESENTES.filter((p) => p.categoria === cat);

  return (
    <main>
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/85 backdrop-blur border border-[var(--color-border-soft)] text-[11px] tracking-[0.2em] uppercase text-[var(--color-champagne-deep)] hover:bg-white shadow-sm"
      >
        <ArrowLeft size={13} /> Início
      </Link>

      <section
        id="lista-presentes"
        className="relative pt-24 md:pt-32 pb-16 md:pb-24 px-5"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Ornament className="mb-4" />
            <p className="label-uppercase mb-2">Ou escolha um presente</p>
            <h2 className="heading-display text-3xl md:text-4xl">
              Para o nosso novo lar
            </h2>
          </div>

          <div className="max-w-2xl mx-auto mb-10 bg-[var(--color-cream-soft)] border border-[var(--color-border-soft)] rounded-2xl px-5 py-4 sm:px-6 sm:py-5 flex items-start gap-3.5">
            <Heart
              size={17}
              strokeWidth={1.6}
              className="text-[var(--color-champagne-deep)] mt-0.5 shrink-0"
            />
            <p className="text-sm sm:text-[15px] leading-relaxed text-[var(--color-text)]">
              <span className="font-medium text-[var(--color-ink)]">
                Pra deixar tudo claro:
              </span>{" "}
              você não precisa comprar e mandar o item pra gente. Ao escolher
              um presente, você está contribuindo com o valor dele pra a gente
              montar nosso primeiro lar do nosso jeitinho. Cada presente que
              você escolher vira parte da nossa nova vida.{" "}
              <span className="italic-romance text-[var(--color-champagne-deep)]">
                Obrigado de coração!
              </span>
            </p>
          </div>

          <div className="flex justify-center flex-wrap gap-2 mb-10">
            {CATEGORIAS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCat(c.id)}
                className={`rounded-full px-4 py-2 text-[11px] tracking-[0.2em] uppercase transition-colors ${
                  cat === c.id
                    ? "bg-[var(--color-champagne-darker)] text-[var(--color-cream)]"
                    : "border border-[var(--color-border-soft)] text-[var(--color-text-soft)] hover:bg-[var(--color-cream-soft)]"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
          >
            <AnimatePresence>
              {filtered.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.3 }}
                >
                  <GiftCard presente={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <Footer />
      <CartDrawer />
      <CartFab />
    </main>
  );
}
