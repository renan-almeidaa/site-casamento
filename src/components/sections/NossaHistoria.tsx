"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";

export function NossaHistoria() {
  return (
    <section
      id="nossa-historia"
      className="relative py-24 md:py-36 px-5 overflow-hidden"
    >
      {/* Atmosfera de fundo — radial bem sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 80% 30%, rgba(196,168,130,0.12) 0%, transparent 65%), radial-gradient(ellipse 40% 50% at 20% 80%, rgba(142,101,57,0.08) 0%, transparent 65%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="O começo de tudo"
          title="Nossa História"
          subtitle="Cada encontro foi um sinal, cada riso virou lembrança. Hoje a gente escreve um novo capítulo, juntos, para sempre."
        />

        <div className="mt-20 md:mt-28 grid md:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Foto à esquerda — assimétrica, 5 colunas */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
            className="md:col-span-5 relative"
          >
            <div
              className="relative aspect-[4/5] w-full max-w-md mx-auto overflow-hidden"
              style={{ borderRadius: "2px" }}
            >
              <Image
                src="/nossa-historia.jpg"
                alt="Samara e Renan"
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-cover"
              />
              {/* Vinheta lateral pra dar profundidade */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 60%, rgba(42,24,16,0.18) 100%)",
                }}
              />
            </div>

            {/* "Selo" no canto inferior — pequena marca editorial */}
            <div
              className="hidden md:flex absolute -bottom-5 -right-5 flex-col items-center justify-center w-24 h-24 bg-[var(--color-champagne-darker)] text-[var(--color-cream)]"
              style={{ borderRadius: "2px" }}
              aria-hidden
            >
              <span className="text-[8px] tracking-[0.4em] uppercase opacity-70 mb-1">
                Capítulo
              </span>
              <span className="font-[var(--font-display)] font-extralight text-3xl leading-none">
                01
              </span>
            </div>
          </motion.div>

          {/* Texto à direita — 7 colunas, com letra dropcap-ish */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="md:col-span-7 md:pl-6 lg:pl-12 relative"
          >
            {/* Marca de citação grande, decorativa — só desktop pra não
                colidir com a foto quando empilha no mobile. */}
            <span
              aria-hidden
              className="hidden md:block font-[var(--font-display)] absolute -top-12 -left-2 text-[8rem] leading-none font-extralight opacity-15 select-none pointer-events-none"
              style={{ color: "var(--color-champagne-deep)" }}
            >
              “
            </span>

            <p
              className="italic-romance text-xl md:text-2xl leading-[1.7] relative"
              style={{ color: "var(--color-ink-soft)" }}
            >
              Foi entre conversas e cafés que o nosso amor cresceu devagar, do
              jeito que as coisas verdadeiras crescem. A gente descobriu que
              rir junto é fácil, que sonhar junto é mais bonito e que orar
              junto é um abraço que não tem distância.
            </p>

            <p
              className="mt-6 italic-romance text-lg md:text-xl leading-[1.7]"
              style={{ color: "var(--color-text)" }}
            >
              Agora chegou a hora de dizer “sim” diante de Deus e de quem a
              gente ama. E queremos que você esteja lá, dividindo esse momento
              que só existe porque vocês foram parte da nossa caminhada.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div
                className="h-px w-12"
                style={{ background: "var(--color-champagne-deep)" }}
                aria-hidden
              />
              <p
                className="text-[10px] tracking-[0.45em] uppercase font-medium"
                style={{ color: "var(--color-champagne-deep)" }}
              >
                Samara &amp; Renan
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
