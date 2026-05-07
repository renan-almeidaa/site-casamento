"use client";

import Image from "next/image";
import { motion } from "framer-motion";
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
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
    >
      <Image
        src="/fotos-do-casal/foto-1.png"
        alt="Samara e Renan"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(46,34,24,0.45)] via-[rgba(46,34,24,0.4)] to-[rgba(46,34,24,0.7)]" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
        className="relative z-10 text-center px-5 max-w-4xl"
      >
        <p className="text-[10px] sm:text-xs tracking-[0.5em] uppercase text-[#e6c98e] mb-5 drop-shadow">
          {dateLabel}
        </p>
        <Ornament width={70} className="mb-7 text-white/90" />
        <h1 className="font-[var(--font-display)] font-light text-white text-6xl sm:text-7xl md:text-8xl leading-[1.05] drop-shadow-md">
          <span className="block sm:inline">Samara</span>
          <span className="italic font-light text-[#e6c98e] mx-2 sm:mx-4 inline-block">
            &amp;
          </span>
          <span className="block sm:inline">Renan</span>
        </h1>
        <div className="mx-auto my-10 h-px w-16 bg-[#e6c98e]/70" />
        <Countdown variant="inline" tone="light" />
      </motion.div>

      <motion.button
        type="button"
        onClick={handleScroll}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 text-white/85 hover:text-white p-3"
        aria-label="Rolar para o conteúdo"
      >
        <ChevronDown size={26} strokeWidth={1.4} />
      </motion.button>
    </section>
  );
}
