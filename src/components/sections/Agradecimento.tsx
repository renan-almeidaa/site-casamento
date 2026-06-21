"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Ornament } from "@/components/ui/ornament";

export function Agradecimento() {
  return (
    <section className="relative py-24 md:py-32 px-5 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative max-w-3xl mx-auto text-center"
      >
        <div
          className="relative aspect-[16/10] w-full overflow-hidden mb-12"
          style={{
            borderRadius: "2px",
            boxShadow: "0 24px 60px -28px rgba(42,24,16,0.35)",
          }}
        >
          <Image
            src="/fotos-do-casal/gratidao.jpg"
            alt="Samara e Renan"
            fill
            sizes="(max-width: 1024px) 100vw, 768px"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 50%, rgba(31,22,13,0.55) 100%)",
            }}
          />
        </div>

        <p className="label-uppercase mb-6">Com gratidão</p>

        <div className="mb-8">
          <Ornament width={50} />
        </div>

        <h2 className="heading-hairline text-[clamp(2.2rem,5.5vw,3.6rem)] mb-8">
          Obrigado por
          <br />
          <span className="italic-romance text-[var(--color-champagne-deep)]">
            fazer parte
          </span>
        </h2>

        <p
          className="italic-romance text-lg md:text-xl leading-[1.7] max-w-xl mx-auto mb-8"
          style={{ color: "var(--color-text-soft)" }}
        >
          “Cada um de vocês deixa o nosso amor mais bonito. Que Deus continue
          abençoando essa caminhada, agora a três: Ele, você e o nosso.”
        </p>

        <div
          aria-hidden
          className="mx-auto h-px w-12 mb-6"
          style={{ background: "var(--color-champagne-deep)" }}
        />

        <p
          className="text-[10px] tracking-[0.5em] uppercase font-medium"
          style={{ color: "var(--color-champagne-deep)" }}
        >
          Com amor, Samara &amp; Renan
        </p>
      </motion.div>
    </section>
  );
}
