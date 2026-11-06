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
  const { items, total, clear } = useCartStore();
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
        className="self-start m-4 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[rgba(247,243,238,0.14)] text-[13px] tracking-[0.1em] uppercase text-[var(--color-cream)] hover:bg-[rgba(247,243,238,0.24)]"
      >
        <ArrowLeft size={15} /> Voltar
      </Link>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center px-5 pt-2 pb-16"
      >
        <div className="w-full max-w-md text-center">
          <h1 className="font-[var(--font-display)] text-3xl mb-1">
            Envie o valor para Samara e Renan
          </h1>
          <p
            className="font-[var(--font-display)] text-5xl md:text-6xl my-3 tabular-nums"
            style={{ color: "#e6c98e" }}
          >
            {formatBRL(total())}
          </p>
          <p className="text-base leading-relaxed mb-6">
            Não precisa comprar nem levar o item. Nós compramos com esse valor 💛
          </p>

          <p className="label-uppercase !text-[#e6c98e] !text-[13px] !tracking-[0.14em] mb-3">
            Como quer enviar?
          </p>

          <div className="grid grid-cols-2 rounded-full border border-[rgba(196,168,130,0.4)] overflow-hidden mb-6">
            <button
              type="button"
              onClick={() => switchMethod("pix")}
              className={`py-3.5 text-[14px] tracking-[0.12em] uppercase font-medium transition-colors ${
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
              className={`py-3.5 text-[14px] tracking-[0.12em] uppercase font-medium transition-colors ${
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
              <p className="text-base leading-relaxed">
                Abra o app do banco e escaneie o QR Code. O valor de{" "}
                {formatBRL(totalValue)} já vem preenchido.
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
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-champagne)] text-[var(--color-champagne-darker)] hover:bg-[#d8be90] py-3.5 px-3 text-[13px] tracking-[0.06em] uppercase font-medium transition-colors"
                >
                  <Copy size={15} /> Copiar código
                </button>
                <button
                  type="button"
                  onClick={downloadQr}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e6c98e] hover:bg-[rgba(196,168,130,0.15)] py-3.5 px-3 text-[13px] tracking-[0.06em] uppercase font-medium transition-colors"
                >
                  <Download size={15} /> Salvar QR
                </button>
              </div>
              <div className="bg-[rgba(247,243,238,0.06)] border border-[rgba(196,168,130,0.25)] rounded-2xl p-5 text-center">
                <p className="label-uppercase !text-[#e6c98e] !text-[13px] !tracking-[0.14em] mb-2">
                  Ou use a chave Pix
                </p>
                <p className="text-base mb-1 break-all">
                  {WEDDING.payment.pixEmail}
                </p>
                <p className="text-[15px] mb-3">
                  Em nome de {WEDDING.payment.pixHolder}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    copy(WEDDING.payment.pixEmail, "Chave PIX copiada!")
                  }
                  className="inline-flex items-center gap-2 text-[14px] tracking-[0.08em] uppercase text-[#e6c98e] hover:text-[var(--color-cream)]"
                >
                  <Copy size={15} /> Copiar chave
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-base leading-relaxed">
                Envie pelo cartão de crédito, pelo Mercado Pago, em até 12x.
              </p>
              <button
                type="button"
                onClick={payWithCard}
                disabled={mpLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-champagne)] text-[var(--color-champagne-darker)] hover:bg-[#d8be90] disabled:opacity-60 py-4 px-5 text-[14px] tracking-[0.06em] uppercase font-medium transition-colors"
              >
                {mpLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Preparando pagamento...
                  </>
                ) : (
                  <>
                    <CreditCard size={16} />
                    Enviar {formatBRL(totalValue)} pelo cartão
                    <ExternalLink size={14} />
                  </>
                )}
              </button>
              <p className="text-[15px] leading-relaxed">
                Você vai para o site seguro do Mercado Pago, com o valor já
                preenchido.
              </p>
            </div>
          )}

          <HorizontalDivider className="my-8 bg-[var(--color-champagne)]" />

          <p className="text-base mb-3">
            Depois de enviar, mande o comprovante por WhatsApp
          </p>
          <a
            href={sendComprovanteUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#e6c98e] hover:bg-[rgba(196,168,130,0.15)] py-3 px-5 text-[13px] tracking-[0.08em] uppercase"
          >
            <Send size={15} /> Enviar comprovante
          </a>

          <div className="mt-8 flex items-start justify-center gap-2 text-base text-[#e6c98e]">
            <CheckCircle2 size={18} className="mt-1 shrink-0" />
            Sua escolha foi registrada. Agora é só enviar o valor.
          </div>

          <button
            type="button"
            onClick={finishAndClear}
            className="block mx-auto mt-8 text-base underline underline-offset-4 text-[var(--color-cream)] hover:text-[#e6c98e]"
          >
            Concluir e voltar para o início
          </button>
        </div>
      </motion.section>
    </main>
  );
}
