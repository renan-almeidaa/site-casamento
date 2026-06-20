"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Copy, CreditCard, Gift } from "lucide-react";
import { WEDDING } from "@/lib/wedding-data";
import { useToast } from "@/components/ui/toaster";
import { SectionHeader } from "./SectionHeader";

export function PresentesCta() {
  const { toast } = useToast();

  const copy = (text: string, msg: string) => {
    navigator.clipboard?.writeText(text);
    toast(msg);
  };

  return (
    <section
      id="presentes"
      className="relative py-24 md:py-32 px-5 overflow-hidden"
    >
      <div className="relative max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="Lista de Presentes"
          title="Sua presença é o maior presente"
          subtitle="A fase de preparação para o casamento é desafiadora e requer muito esforço, tanto espiritual quanto material. Quem quiser nos abençoar com algo a mais, pode escolher uma das opções abaixo."
        />

        <div className="mt-20 grid md:grid-cols-2 gap-6 md:gap-8">
          {/* PIX card */}
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            className="card-envelope p-8 md:p-10 flex flex-col items-center text-center relative"
          >
            {/* Número romano decorativo */}
            <span
              aria-hidden
              className="absolute top-5 right-6 font-[var(--font-display)] font-extralight text-[2.5rem] leading-none opacity-15 select-none"
              style={{ color: "var(--color-champagne-deep)" }}
            >
              I
            </span>

            <p className="label-uppercase mb-3">Contribuição</p>
            <h3
              className="font-[var(--font-display)] font-extralight text-3xl md:text-4xl tracking-[-0.025em] leading-[1.05] mb-4"
              style={{ color: "var(--color-ink)" }}
            >
              Pague via <span className="italic-romance text-[var(--color-champagne-deep)]">PIX</span>
            </h3>
            <div
              aria-hidden
              className="h-px w-10 mb-5"
              style={{ background: "var(--color-champagne-deep)" }}
            />
            <p
              className="italic-romance text-[var(--color-text-soft)] max-w-sm leading-[1.65]"
            >
              Casar é um sonho, e também um novo começo. Toda contribuição
              nos ajuda a construir nosso primeiro lar.
            </p>

            <a
              href={WEDDING.payment.pixQrLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pagar via PIX (abre o app do Nubank)"
              className="mt-7 inline-block bg-white p-3 hover:scale-[1.02] transition-transform"
              style={{
                border: "1px solid var(--color-border-soft)",
                borderRadius: "2px",
              }}
            >
              <Image
                src="/qrcode.png"
                alt="QR Code PIX"
                width={160}
                height={160}
                className="block"
              />
            </a>
            <p className="mt-3 text-[10px] tracking-[0.35em] uppercase text-[var(--color-champagne-light)]">
              Escaneie ou clique para abrir
            </p>

            <div className="mt-6 w-full max-w-xs space-y-2.5">
              <button
                type="button"
                onClick={() =>
                  copy(WEDDING.payment.pixEmail, "Chave PIX copiada!")
                }
                className="w-full inline-flex items-center justify-between gap-2 hover:bg-[var(--color-cream-deep)] py-3 px-4 text-xs text-[var(--color-text)] transition-colors"
                style={{
                  border: "1px solid var(--color-border-soft)",
                  borderRadius: "2px",
                  background: "var(--color-cream-soft)",
                }}
              >
                <span className="font-medium truncate">
                  {WEDDING.payment.pixEmail}
                </span>
                <Copy
                  size={13}
                  className="text-[var(--color-champagne-deep)] flex-shrink-0"
                />
              </button>
              <button
                type="button"
                onClick={() =>
                  copy(
                    WEDDING.payment.pixCopiaCola,
                    "Código copia-e-cola copiado!",
                  )
                }
                className="w-full text-[10px] tracking-[0.35em] uppercase text-[var(--color-champagne-deep)] hover:text-[var(--color-champagne-darker)] py-1.5 transition-colors"
              >
                Copiar código copia-e-cola
              </button>
              <a
                href={WEDDING.payment.mercadoPagoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 border border-[var(--color-champagne-deep)] text-[var(--color-champagne-darker)] hover:bg-[var(--color-champagne-darker)] hover:text-[var(--color-cream)] py-3 px-4 text-[10px] tracking-[0.35em] uppercase font-medium transition-colors"
                style={{ borderRadius: "999px" }}
              >
                <CreditCard size={12} /> Pagar com cartão
              </a>
            </div>
          </motion.article>

          {/* Presente Especial card */}
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
            className="card-envelope p-8 md:p-10 flex flex-col items-center text-center relative"
          >
            <span
              aria-hidden
              className="absolute top-5 right-6 font-[var(--font-display)] font-extralight text-[2.5rem] leading-none opacity-15 select-none"
              style={{ color: "var(--color-champagne-deep)" }}
            >
              II
            </span>

            <p className="label-uppercase mb-3">Lista</p>
            <h3
              className="font-[var(--font-display)] font-extralight text-3xl md:text-4xl tracking-[-0.025em] leading-[1.05] mb-4"
              style={{ color: "var(--color-ink)" }}
            >
              Presente <span className="italic-romance text-[var(--color-champagne-deep)]">especial</span>
            </h3>
            <div
              aria-hidden
              className="h-px w-10 mb-5"
              style={{ background: "var(--color-champagne-deep)" }}
            />
            <p
              className="italic-romance text-[var(--color-text-soft)] max-w-sm leading-[1.65]"
            >
              Para quem prefere presentear com algo mais pessoal, preparamos
              uma lista com itens que vão fazer parte do nosso lar.
            </p>

            <div className="my-8 grid grid-cols-3 gap-2 w-full max-w-xs">
              {[
                { tone: "var(--color-champagne-darker)", op: 0.92 },
                { tone: "var(--color-champagne-deep)", op: 0.85 },
                { tone: "var(--color-champagne)", op: 0.75 },
              ].map((c, i) => (
                <div
                  key={i}
                  className="aspect-square flex items-center justify-center transition-transform hover:scale-[1.04]"
                  style={{
                    background: c.tone,
                    opacity: c.op,
                    borderRadius: "2px",
                  }}
                >
                  <Gift
                    size={26}
                    strokeWidth={1.2}
                    className="text-[var(--color-cream)]"
                  />
                </div>
              ))}
            </div>

            <Link href="/presentes" className="btn-cta mt-auto">
              Acessar lista
              <span aria-hidden>→</span>
            </Link>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
