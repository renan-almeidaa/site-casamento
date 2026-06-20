"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { WEDDING } from "@/lib/wedding-data";
import { Ornament } from "@/components/ui/ornament";
import { Countdown } from "./Countdown";

export function Hero() {
  const dateLabel = WEDDING.dateLabel.toUpperCase();

  const handleScroll = () => {
    if (typeof window === "undefined") return;
    const el = document.getElementById("nossa-historia");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="inicio"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-[var(--color-champagne-darker)]"
    >
      {/* Foto principal */}
      <Image
        src="/fotos-do-casal/foto inicial.jpg"
        alt="Samara e Renan"
        fill
        priority
        sizes="100vw"
        className="object-cover scale-105"
      />

      {/* Vinheta suave + degradê de baixo pra cima (texto sempre legível) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(31,22,13,0.55) 0%, rgba(31,22,13,0.35) 38%, rgba(31,22,13,0.72) 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 0%, rgba(31,22,13,0.45) 100%)",
        }}
      />

      {/* Frames decorativos finos no canto — referência editorial */}
      <div
        aria-hidden
        className="absolute top-6 left-6 right-6 bottom-6 pointer-events-none hidden md:block"
        style={{
          border: "1px solid rgba(212, 183, 138, 0.32)",
        }}
      />

      {/* Marcadores de cantos (corner ticks) */}
      <div
        aria-hidden
        className="absolute top-6 left-6 w-3 h-3 hidden md:block fade-in"
        style={{
          borderTop: "1px solid var(--color-champagne-foil)",
          borderLeft: "1px solid var(--color-champagne-foil)",
        }}
      />
      <div
        aria-hidden
        className="absolute top-6 right-6 w-3 h-3 hidden md:block fade-in stagger-1"
        style={{
          borderTop: "1px solid var(--color-champagne-foil)",
          borderRight: "1px solid var(--color-champagne-foil)",
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-6 left-6 w-3 h-3 hidden md:block fade-in stagger-2"
        style={{
          borderBottom: "1px solid var(--color-champagne-foil)",
          borderLeft: "1px solid var(--color-champagne-foil)",
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-6 right-6 w-3 h-3 hidden md:block fade-in stagger-3"
        style={{
          borderBottom: "1px solid var(--color-champagne-foil)",
          borderRight: "1px solid var(--color-champagne-foil)",
        }}
      />

      <div className="relative z-10 text-center px-5 max-w-5xl">
        {/* 1. Data, bem fina, no topo */}
        <p
          className="rise-in stagger-1 text-[10px] sm:text-[11px] font-medium tracking-[0.55em] uppercase text-[var(--color-champagne-foil)] mb-7"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
        >
          {dateLabel}
        </p>

        {/* 2. Ornamento */}
        <div className="rise-in stagger-2 mb-8 text-white/90">
          <Ornament width={56} />
        </div>

        {/* 3. Nomes — Fraunces light extremo + itálico romântico no & */}
        <h1
          className="rise-in stagger-3 font-[var(--font-display)] font-extralight text-white text-[clamp(3.2rem,12vw,9rem)] leading-[0.88] tracking-[-0.04em]"
          style={{ textShadow: "0 2px 30px rgba(0,0,0,0.35)" }}
        >
          <span className="block sm:inline">Samara</span>
          <span
            className="italic font-light text-[var(--color-champagne-foil)] mx-1 sm:mx-3 inline-block"
            style={{
              fontWeight: 300,
              transform: "translateY(0.08em)",
              fontStretch: "100%",
            }}
          >
            &amp;
          </span>
          <span className="block sm:inline">Renan</span>
        </h1>

        {/* 4. Divisor hairline com crescimento */}
        <div
          className="width-grow stagger-4 mx-auto my-10 h-px w-20 bg-[var(--color-champagne-foil)]/70"
        />

        {/* 5. Versículo curto — só na home, peça de identidade */}
        <p
          className="rise-in stagger-4 italic-romance text-white/80 text-base sm:text-lg max-w-md mx-auto mb-12 leading-relaxed"
          style={{ textShadow: "0 1px 8px rgba(0,0,0,0.3)" }}
        >
          “{WEDDING.verse}”
          <span className="block mt-2 not-italic text-[10px] tracking-[0.4em] uppercase text-[var(--color-champagne-foil)]/85">
            {WEDDING.verseRef}
          </span>
        </p>

        {/* 6. Countdown */}
        <div className="rise-in stagger-5">
          <Countdown variant="inline" tone="light" />
        </div>
      </div>

      {/* Indicador de scroll, fixo no rodapé */}
      <button
        type="button"
        onClick={handleScroll}
        className="fade-in stagger-6 absolute bottom-9 left-1/2 -translate-x-1/2 text-white/80 hover:text-white p-3 group"
        aria-label="Rolar para o conteúdo"
      >
        <span className="block text-[9px] tracking-[0.45em] uppercase mb-2 text-[var(--color-champagne-foil)]">
          Role
        </span>
        <ChevronDown
          size={22}
          strokeWidth={1.3}
          className="mx-auto transition-transform group-hover:translate-y-1"
        />
      </button>
    </section>
  );
}
