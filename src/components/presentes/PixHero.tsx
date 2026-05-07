"use client";

import Image from "next/image";
import { Copy, ExternalLink, Mail, CreditCard } from "lucide-react";
import { WEDDING } from "@/lib/wedding-data";
import { useToast } from "@/components/ui/toaster";
import { Ornament, HorizontalDivider } from "@/components/ui/ornament";

export function PixHero() {
  const { toast } = useToast();

  const copy = (text: string, msg: string) => {
    navigator.clipboard?.writeText(text);
    toast(msg);
  };

  return (
    <section className="relative pt-28 pb-12 px-5 bg-[var(--color-champagne-darker)] text-[var(--color-cream)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_30%_20%,_rgba(196,168,130,0.4)_0%,_transparent_60%),_radial-gradient(ellipse_at_70%_80%,_rgba(160,120,80,0.4)_0%,_transparent_60%)]" />

      <div className="relative max-w-3xl mx-auto text-center">
        <Ornament className="mb-4" />
        <p className="label-uppercase text-[var(--color-champagne)] mb-3">
          Lista de Presentes
        </p>
        <h1 className="font-[var(--font-display)] font-light text-4xl md:text-5xl mb-3">
          Sua presença é o maior presente
        </h1>
        <HorizontalDivider className="my-4" />
        <p
          className="font-[var(--font-display)] italic text-base md:text-lg max-w-xl mx-auto"
          style={{ color: "rgba(247,243,238,0.85)" }}
        >
          Mas se quiser nos ajudar a construir nossa nova vida juntos, ficamos
          imensamente gratos pelo carinho.
        </p>

        <div className="mt-8 grid sm:grid-cols-[auto_1fr] gap-6 sm:gap-8 items-center max-w-xl mx-auto bg-[rgba(247,243,238,0.06)] backdrop-blur rounded-3xl p-6 sm:p-8 border border-[rgba(196,168,130,0.25)]">
          <a
            href={WEDDING.payment.pixQrLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pagar via PIX (abre o app do Nubank)"
            className="block mx-auto rounded-xl bg-[var(--color-cream)] p-3 hover:scale-[1.02] transition-transform"
          >
            <Image
              src="/qrcode.png"
              alt="QR Code PIX"
              width={170}
              height={170}
              className="w-[150px] sm:w-[170px] h-auto"
            />
          </a>
          <div className="text-left space-y-3">
            <div>
              <p className="label-uppercase text-[var(--color-champagne)] mb-1">
                Chave PIX
              </p>
              <p className="text-sm break-all">{WEDDING.payment.pixEmail}</p>
              <p className="text-xs opacity-70 mt-0.5">
                {WEDDING.payment.pixHolder}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                copy(WEDDING.payment.pixCopiaCola, "Código PIX copiado!")
              }
              className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-champagne)] text-[var(--color-champagne)] hover:bg-[var(--color-champagne)] hover:text-[var(--color-champagne-darker)] py-2.5 px-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
            >
              <Copy size={13} /> Copiar código copia-e-cola
            </button>
            <button
              type="button"
              onClick={() => copy(WEDDING.payment.pixEmail, "Email PIX copiado!")}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(196,168,130,0.4)] text-[var(--color-cream)] hover:bg-[rgba(196,168,130,0.15)] py-2.5 px-4 text-[11px] tracking-[0.25em] uppercase transition-colors"
            >
              <Mail size={13} /> Copiar email PIX
            </button>
            <a
              href={WEDDING.payment.mercadoPagoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-champagne)] text-[var(--color-champagne-darker)] hover:bg-[#d8be90] py-2.5 px-4 text-[11px] tracking-[0.25em] uppercase font-medium transition-colors"
            >
              <CreditCard size={13} /> Pagar com cartão
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
