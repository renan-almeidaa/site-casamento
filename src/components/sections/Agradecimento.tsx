"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Ornament } from "@/components/ui/ornament";

export function Agradecimento() {
  return (
    <section className="relative py-20 md:py-28 px-5 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className="relative max-w-3xl mx-auto text-center"
      >
        <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden mb-10 shadow-[0_10px_50px_rgba(100,70,30,0.15)]">
          <Image
            src="/fotos-do-casal/foto-3.png"
            alt="Samara e Renan"
            fill
            sizes="(max-width: 1024px) 100vw, 768px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(46,34,24,0.4)] via-transparent to-transparent" />
        </div>

        <Ornament className="mb-5" />
        <p className="label-uppercase mb-3">Com gratidão</p>
        <h2 className="heading-display text-3xl md:text-4xl mb-5">
          Obrigado por fazer parte
        </h2>
        <p
          className="font-[var(--font-display)] italic text-lg md:text-xl leading-relaxed mb-6"
          style={{ color: "var(--color-text-soft)" }}
        >
          “Cada um de vocês deixa o nosso amor mais bonito. Que Deus continue
          abençoando essa caminhada, agora a três: Ele, você e o nosso.”
        </p>
        <p
          className="font-[var(--font-display)] italic text-lg"
          style={{ color: "var(--color-champagne-deep)" }}
        >
          Com amor, Samara &amp; Renan
        </p>
      </motion.div>
    </section>
  );
}
