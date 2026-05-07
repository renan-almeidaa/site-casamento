"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Copy, CreditCard, Gift, Layers } from "lucide-react";
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
      className="relative py-20 md:py-28 px-5 bg-[var(--color-cream-soft)] overflow-hidden"
    >
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-[var(--color-pastel-mint)] opacity-25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-1/4 h-72 w-72 rounded-full bg-[var(--color-pastel-rose)] opacity-25 blur-3xl" />

      <div className="relative max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="Lista de Presentes"
          title="Sua presença é o maior presente"
          subtitle="Como vocês já sabem, a fase de preparação para o casamento é desafiadora e requer muito esforço — tanto espiritual quanto material. Quem quiser nos abençoar com algo a mais, pode escolher uma das opções abaixo."
        />

        <div className="mt-12 grid md:grid-cols-2 gap-5 md:gap-7">
          {/* PIX card */}
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="card-soft p-7 md:p-9 flex flex-col items-center text-center relative overflow-hidden"
          >
            <div
              className="absolute -top-12 -left-12 w-32 h-32 rounded-full opacity-50 blur-2xl"
              style={{ background: "var(--color-pastel-sky)" }}
              aria-hidden
            />
            <div className="relative w-full flex flex-col items-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-cream)] border border-[var(--color-border-soft)] text-[var(--color-champagne-deep)] mb-4">
                <Layers size={20} strokeWidth={1.5} />
              </div>
              <p className="label-uppercase mb-2">PIX</p>
              <h3 className="font-[var(--font-display)] font-light text-2xl md:text-3xl text-[var(--color-ink)] leading-tight mb-3">
                Contribua via PIX
              </h3>
              <p className="font-[var(--font-display)] italic text-[var(--color-text-soft)] max-w-sm">
                Casar é um sonho — e também um novo começo. Toda contribuição
                nos ajuda a construir nosso primeiro lar.
              </p>

              <a
                href={WEDDING.payment.pixQrLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pagar via PIX (abre o app do Nubank)"
                className="mt-6 inline-block rounded-2xl bg-white p-3 border border-[var(--color-border-soft)] hover:scale-[1.02] transition-transform"
              >
                <Image
                  src="/qrcode.png"
                  alt="QR Code PIX"
                  width={150}
                  height={150}
                  className="block"
                />
              </a>
              <p className="mt-3 text-xs text-[var(--color-text-soft)] italic">
                Escaneie o QR Code ou clique para abrir
              </p>

              <div className="mt-5 w-full max-w-xs space-y-2">
                <button
                  type="button"
                  onClick={() =>
                    copy(WEDDING.payment.pixEmail, "Chave PIX copiada!")
                  }
                  className="w-full inline-flex items-center justify-between gap-2 rounded-full border border-[var(--color-border-soft)] hover:bg-[var(--color-cream)] py-2.5 px-4 text-xs text-[var(--color-text)] transition-colors"
                >
                  <span className="font-medium truncate">
                    {WEDDING.payment.pixEmail}
                  </span>
                  <Copy size={13} className="text-[var(--color-champagne-deep)] flex-shrink-0" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    copy(WEDDING.payment.pixCopiaCola, "Código copia-e-cola copiado!")
                  }
                  className="w-full text-[10px] tracking-[0.25em] uppercase text-[var(--color-champagne-deep)] hover:text-[var(--color-champagne)] py-1"
                >
                  Copiar código copia-e-cola
                </button>
                <a
                  href={WEDDING.payment.mercadoPagoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-champagne)] text-[var(--color-champagne-deep)] hover:bg-[var(--color-champagne)] hover:text-white py-2.5 px-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
                >
                  <CreditCard size={13} /> Pagar com cartão
                </a>
              </div>
            </div>
          </motion.article>

          {/* Presente Especial card */}
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card-soft p-7 md:p-9 flex flex-col items-center text-center relative overflow-hidden"
          >
            <div
              className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-50 blur-2xl"
              style={{ background: "var(--color-pastel-salmon)" }}
              aria-hidden
            />
            <div className="relative w-full flex flex-col items-center flex-1">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-cream)] border border-[var(--color-border-soft)] text-[var(--color-champagne-deep)] mb-4">
                <Gift size={20} strokeWidth={1.5} />
              </div>
              <p className="label-uppercase mb-2">Presentes</p>
              <h3 className="font-[var(--font-display)] font-light text-2xl md:text-3xl text-[var(--color-ink)] leading-tight mb-3">
                Presente especial
              </h3>
              <p className="font-[var(--font-display)] italic text-[var(--color-text-soft)] max-w-sm">
                Para quem prefere presentear com algo mais pessoal, preparamos
                uma lista com itens que vão fazer parte do nosso lar.
              </p>

              <div className="my-7 grid grid-cols-3 gap-3 w-full max-w-xs">
                {(["mint", "rose", "sky"] as const).map((c) => (
                  <div
                    key={c}
                    className="aspect-square rounded-2xl flex items-center justify-center"
                    style={{
                      background: `var(--color-pastel-${c})`,
                    }}
                  >
                    <Gift
                      size={26}
                      strokeWidth={1.4}
                      className="text-[var(--color-champagne-darker)]/70"
                    />
                  </div>
                ))}
              </div>

              <Link href="/presentes" className="btn-cta mt-auto">
                Acessar lista de presentes
              </Link>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
