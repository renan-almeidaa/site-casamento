"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Ornament } from "@/components/ui/ornament";
import { WEDDING } from "@/lib/wedding-data";

type Props = {
  onOpenRsvp: () => void;
};

export function RsvpCta({ onOpenRsvp }: Props) {
  return (
    <section
      id="rsvp"
      className="relative py-20 md:py-28 px-5 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--color-pastel-rose)]/30 via-[var(--color-cream)] to-[var(--color-pastel-yellow)]/30" />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="relative max-w-2xl mx-auto text-center card-soft p-10 md:p-14"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-cream)] border border-[var(--color-border-soft)] text-[var(--color-champagne-deep)] mb-5">
          <Heart size={22} strokeWidth={1.5} />
        </div>
        <Ornament className="mb-4" />
        <p className="label-uppercase mb-3">Confirmação de Presença</p>
        <h2 className="heading-display text-3xl md:text-4xl mb-4">
          Confirme sua presença
        </h2>
        <p
          className="font-[var(--font-display)] italic text-lg leading-relaxed mb-8"
          style={{ color: "var(--color-text-soft)" }}
        >
          {WEDDING.welcome}
        </p>
        <button
          type="button"
          onClick={onOpenRsvp}
          className="btn-cta"
        >
          Confirmar Presença
        </button>
      </motion.div>
    </section>
  );
}
