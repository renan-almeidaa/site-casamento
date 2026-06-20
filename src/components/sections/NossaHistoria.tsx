"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";

export function NossaHistoria() {
  return (
    <section
      id="nossa-historia"
      className="relative py-20 md:py-32 px-5 overflow-hidden"
    >
      <div className="pointer-events-none absolute -left-20 top-12 h-72 w-72 rounded-full bg-[var(--color-pastel-rose)] opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-20 h-64 w-64 rounded-full bg-[var(--color-pastel-salmon)] opacity-25 blur-3xl" />

      <div className="relative max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="O começo de tudo"
          title="Nossa História"
          subtitle="Cada encontro foi um sinal, cada riso virou lembrança. Hoje a gente escreve um novo capítulo, juntos, para sempre."
        />

        <div className="mt-14 grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(100,70,30,0.15)]">
              <Image
                src="/nossa-historia.png"
                alt="Samara e Renan"
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 hidden md:block w-32 h-32 rounded-full bg-[var(--color-pastel-lavender)] opacity-40 -z-10" />
            <div className="absolute -top-4 -left-4 hidden md:block w-24 h-24 rounded-full bg-[var(--color-pastel-mint)] opacity-40 -z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="card-soft p-8 md:p-10 border-l-4 border-[var(--color-champagne)]"
          >
            <p
              className="font-[var(--font-display)] italic text-lg md:text-xl leading-[1.8]"
              style={{ color: "var(--color-text)" }}
            >
              Foi entre conversas e cafés que o nosso amor cresceu devagar, do
              jeito que as coisas verdadeiras crescem. A gente descobriu que rir
              junto é fácil, que sonhar junto é mais bonito e que orar junto é
              um abraço que não tem distância.
            </p>
            <p
              className="mt-5 font-[var(--font-display)] italic text-lg md:text-xl leading-[1.8]"
              style={{ color: "var(--color-text)" }}
            >
              Agora chegou a hora de dizer “sim” diante de Deus e de quem a
              gente ama. E queremos que você esteja lá, dividindo esse momento
              que só existe porque vocês foram parte da nossa caminhada.
            </p>
            <p
              className="mt-6 font-[var(--font-display)] italic text-base"
              style={{ color: "var(--color-champagne-deep)" }}
            >
              Samara &amp; Renan
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
