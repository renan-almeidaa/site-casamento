"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import {
  ArrowLeft,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  Loader2,
  Send,
  CheckCircle2,
} from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatBRL } from "@/lib/utils";
import { WEDDING } from "@/lib/wedding-data";
import { useToast } from "@/components/ui/toaster";
import { HorizontalDivider } from "@/components/ui/ornament";
import { pixForAmount } from "@/lib/pix";

type Buyer = { name: string; whatsapp: string; purchaseId?: string };

export default function PagarPage() {
  const router = useRouter();
  const { items, total, count, clear } = useCartStore();
  const { toast } = useToast();
  const [tab, setTab] = useState<"pix" | "cartao">("pix");
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const totalValue = total();
  const pixCode = useMemo(() => pixForAmount(totalValue), [totalValue]);
  const qrWrapperRef = useRef<HTMLDivElement>(null);
  const [mpLoading, setMpLoading] = useState(false);

  const payWithCard = async () => {
    if (!buyer) return;
    setMpLoading(true);
    try {
      const r = await fetch("/api/presentes/checkout-mp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerName: buyer.name,
          purchaseId: buyer.purchaseId ?? `manual-${Date.now()}`,
          total: totalValue,
          items: items.map((it) => ({
            id: it.id,
            nome: it.nome,
            valor: it.valor,
            qtd: it.qtd,
          })),
        }),
      });
      const data = (await r.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };
      if (r.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      // Fallback: abre o link genérico do Mercado Pago em nova aba
      toast("Não foi possível pré-preencher o valor. Digite manualmente.");
      window.open(WEDDING.payment.mercadoPagoLink, "_blank", "noopener");
    } catch {
      window.open(WEDDING.payment.mercadoPagoLink, "_blank", "noopener");
    } finally {
      setMpLoading(false);
    }
  };

  const downloadQr = () => {
    const canvas = qrWrapperRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `pix-samara-renan-${totalValue.toFixed(2)}.png`;
    a.click();
    toast("QR Code salvo!");
  };

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!hydrated) return;
    const raw = sessionStorage.getItem("presente-buyer");
    if (!raw) {
      router.replace("/presentes/resumo");
      return;
    }
    try {
      setBuyer(JSON.parse(raw) as Buyer);
    } catch {
      router.replace("/presentes/resumo");
    }
  }, [hydrated, router]);

  useEffect(() => {
    if (hydrated && items.length === 0) {
      router.replace("/presentes");
    }
  }, [hydrated, items.length, router]);

  // Quando o convidado alterna entre PIX/Cartão, atualiza o método registrado.
  // Fire-and-forget: o pagamento em si não bloqueia se a API falhar.
  const switchMethod = (method: "pix" | "cartao") => {
    if (tab === method) return;
    setTab(method);
    if (!buyer?.purchaseId) return;
    void fetch(`/api/presentes/${buyer.purchaseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentMethod: method }),
    }).catch(() => {});
  };

  const copy = (text: string, msg: string) => {
    navigator.clipboard?.writeText(text);
    toast(msg);
  };

  const sendComprovanteUrl = () => {
    const text = encodeURIComponent(
      `Olá Renan! Sou ${buyer?.name ?? ""} e estou enviando o comprovante do presente do casamento.\n\nValor: ${formatBRL(total())}\nItens: ${items
        .map((it) => `${it.qtd}× ${it.nome}`)
        .join(", ")}.`,
    );
    return `https://wa.me/${WEDDING.whatsappNumber}?text=${text}`;
  };

  const finishAndClear = () => {
    clear();
    sessionStorage.removeItem("presente-buyer");
    router.push("/");
  };

  if (!hydrated || !buyer) return null;

  return (
    <main className="min-h-screen bg-[var(--color-champagne-darker)] text-[var(--color-cream)] flex flex-col">
      <Link
        href="/presentes/resumo"
        className="fixed top-4 left-4 z-50 inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-[rgba(247,243,238,0.1)] backdrop-blur text-[11px] tracking-[0.2em] uppercase text-[var(--color-cream)] hover:bg-[rgba(247,243,238,0.2)]"
      >
        <ArrowLeft size={13} /> Voltar
      </Link>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center px-5 py-20"
      >
        <div className="w-full max-w-md text-center">
          <p className="label-uppercase text-[var(--color-champagne)] mb-2">
            Resumo do presente
          </p>
          <p className="font-[var(--font-display)] text-xl mb-1">
            {count()} {count() === 1 ? "item selecionado" : "itens selecionados"}
          </p>
          <p
            className="font-[var(--font-display)] text-5xl md:text-6xl my-3 tabular-nums"
            style={{ color: "#e6c98e" }}
          >
            {formatBRL(total())}
          </p>

          <p className="label-uppercase text-[var(--color-champagne)] mb-3">
            Como deseja pagar?
          </p>

          <div className="grid grid-cols-2 rounded-full border border-[rgba(196,168,130,0.4)] overflow-hidden mb-6">
            <button
              type="button"
              onClick={() => switchMethod("pix")}
              className={`py-3 text-[11px] tracking-[0.3em] uppercase font-medium transition-colors ${
                tab === "pix"
                  ? "bg-[var(--color-champagne)] text-[var(--color-champagne-darker)]"
                  : "text-[var(--color-cream)]"
              }`}
            >
              PIX
            </button>
            <button
              type="button"
              onClick={() => switchMethod("cartao")}
              className={`py-3 text-[11px] tracking-[0.3em] uppercase font-medium transition-colors ${
                tab === "cartao"
                  ? "bg-[var(--color-champagne)] text-[var(--color-champagne-darker)]"
                  : "text-[var(--color-cream)]"
              }`}
            >
              Cartão
            </button>
          </div>

          {tab === "pix" ? (
            <div className="space-y-4">
              <p className="font-[var(--font-display)] italic text-base opacity-90">
                Escaneie o QR Code — o valor de {formatBRL(totalValue)} já vem preenchido
              </p>
              <div
                ref={qrWrapperRef}
                className="mx-auto w-fit rounded-2xl bg-[var(--color-cream)] p-4 cursor-pointer"
                onClick={() => copy(pixCode, "Código PIX copiado!")}
                role="button"
                tabIndex={0}
                aria-label="Copiar código PIX copia-e-cola"
              >
                <QRCodeCanvas
                  value={pixCode}
                  size={220}
                  level="M"
                  marginSize={2}
                  fgColor="#3d2818"
                  bgColor="#f7f3ee"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => copy(pixCode, "Código PIX copiado!")}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-champagne)] text-[var(--color-champagne-darker)] hover:bg-[#d8be90] py-3 px-4 text-[11px] tracking-[0.25em] uppercase font-medium transition-colors"
                >
                  <Copy size={13} /> Copiar código
                </button>
                <button
                  type="button"
                  onClick={downloadQr}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(196,168,130,0.5)] hover:bg-[rgba(196,168,130,0.15)] py-3 px-4 text-[11px] tracking-[0.25em] uppercase font-medium transition-colors"
                >
                  <Download size={13} /> Salvar QR
                </button>
              </div>
              <div className="bg-[rgba(247,243,238,0.06)] border border-[rgba(196,168,130,0.25)] rounded-2xl p-5 text-center">
                <p className="label-uppercase text-[var(--color-champagne)] mb-2">
                  Ou use a chave PIX manualmente
                </p>
                <p className="text-sm mb-1 break-all">
                  {WEDDING.payment.pixEmail}
                </p>
                <p className="text-xs opacity-60 mb-3">
                  {WEDDING.payment.pixHolder}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    copy(WEDDING.payment.pixEmail, "Chave PIX copiada!")
                  }
                  className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-[var(--color-champagne)] hover:text-[var(--color-cream)]"
                >
                  <Copy size={12} /> Copiar chave
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="font-[var(--font-display)] italic text-base opacity-90">
                Pague com cartão pelo Mercado Pago — em até 12x
              </p>
              <button
                type="button"
                onClick={payWithCard}
                disabled={mpLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-champagne)] text-[var(--color-champagne-darker)] hover:bg-[#d8be90] disabled:opacity-60 py-3.5 px-6 text-[12px] tracking-[0.3em] uppercase font-medium transition-colors"
              >
                {mpLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Preparando pagamento...
                  </>
                ) : (
                  <>
                    <CreditCard size={14} />
                    Pagar {formatBRL(totalValue)} via Cartão
                    <ExternalLink size={12} />
                  </>
                )}
              </button>
              <p className="text-xs opacity-70 max-w-xs mx-auto">
                Você será redirecionado para o ambiente seguro do Mercado Pago com o valor já preenchido.
              </p>
            </div>
          )}

          <HorizontalDivider className="my-8 bg-[var(--color-champagne)]" />

          <p className="text-xs opacity-80 mb-3">
            Após pagar, envie o comprovante por WhatsApp
          </p>
          <a
            href={sendComprovanteUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(196,168,130,0.4)] hover:bg-[rgba(196,168,130,0.15)] py-2.5 px-5 text-[11px] tracking-[0.25em] uppercase"
          >
            <Send size={13} /> Enviar comprovante
          </a>

          <div className="mt-8 inline-flex items-center gap-2 text-sm text-[var(--color-champagne)]">
            <CheckCircle2 size={16} />
            Presente registrado! Os noivos foram avisados.
          </div>

          <button
            type="button"
            onClick={finishAndClear}
            className="block mx-auto mt-8 text-sm text-[rgba(247,243,238,0.7)] hover:text-[var(--color-cream)]"
          >
            Concluir e voltar para o início
          </button>
        </div>
      </motion.section>
    </main>
  );
}
