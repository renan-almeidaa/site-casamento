"use client";

import { motion } from "framer-motion";
import { Ornament } from "@/components/ui/ornament";
import { WEDDING } from "@/lib/wedding-data";

type Props = {
  onOpenRsvp: () => void;
};

export function RsvpCta({ onOpenRsvp }: Props) {
  return (
    <section
      id="rsvp"
      className="relative py-24 md:py-32 px-5 overflow-hidden"
    >
      {/* Fundo champagne profundo — quebra o ritmo cream */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, var(--color-champagne-darker) 0%, #1a0e07 100%)",
        }}
        aria-hidden
      />

      {/* Vinheta radial e cantos editoriais */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative max-w-2xl mx-auto text-center"
      >
        <p
          className="text-[10px] tracking-[0.5em] uppercase font-medium mb-6"
          style={{ color: "var(--color-champagne-foil)" }}
        >
          Confirmação de Presença
        </p>

        <div className="mb-9 text-[var(--color-champagne-foil)]/85">
          <Ornament width={56} tone="light" />
        </div>

        <h2
          className="font-[var(--font-display)] font-extralight text-[clamp(2.6rem,7vw,4.8rem)] leading-[0.95] tracking-[-0.035em] mb-3"
          style={{ color: "var(--color-cream)" }}
        >
          Conte que vai
          <br />
          <span className="italic-romance text-[var(--color-champagne-foil)]">
            estar conosco
          </span>
        </h2>

        <div
          aria-hidden
          className="mx-auto mt-8 mb-7 h-px w-12"
          style={{ background: "var(--color-champagne-foil)" }}
        />

        <p
          className="italic-romance text-base sm:text-lg leading-[1.7] max-w-lg mx-auto mb-10"
          style={{ color: "rgba(245, 239, 230, 0.78)" }}
        >
          {WEDDING.welcome}
        </p>

        <button
          type="button"
          onClick={onOpenRsvp}
          className="inline-flex items-center justify-center gap-3 py-[18px] px-12 text-[11px] tracking-[0.4em] uppercase font-medium transition-all duration-300"
          style={{
            background: "var(--color-cream)",
            color: "var(--color-champagne-darker)",
            borderRadius: "999px",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.6) inset, 0 18px 40px -16px rgba(0,0,0,0.5)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--color-champagne-foil)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--color-cream)";
          }}
        >
          Confirmar Presença
          <span aria-hidden>→</span>
        </button>

        <p
          className="mt-8 text-[10px] tracking-[0.4em] uppercase"
          style={{ color: "rgba(212, 183, 138, 0.5)" }}
        >
          Até {WEDDING.dateShort}
        </p>
      </motion.div>
    </section>
  );
}
