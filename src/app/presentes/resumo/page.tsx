"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatBRL, maskWhatsapp } from "@/lib/utils";
import { useToast } from "@/components/ui/toaster";

export default function ResumoPage() {
  const router = useRouter();
  const { items, total, remove, setItem } = useCartStore();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (hydrated && items.length === 0) {
      router.replace("/presentes");
    }
  }, [hydrated, items.length, router]);

  const submit = async () => {
    setError(null);
    if (name.trim().length < 2) {
      setError("Por favor, informe seu nome.");
      return;
    }
    const digits = whatsapp.replace(/\D/g, "");
    if (digits.length < 10) {
      setError("Informe um WhatsApp válido.");
      return;
    }
    setSubmitting(true);
    try {
      // Se o convidado voltou e está reenviando, troca o registro anterior
      // (senão ele mesmo ficaria bloqueado pelos lotes que já reservou).
      let previousPurchaseId: string | null = null;
      try {
        const raw = sessionStorage.getItem("presente-buyer");
        if (raw) {
          previousPurchaseId =
            (JSON.parse(raw) as { purchaseId?: string }).purchaseId ?? null;
        }
      } catch {
        // ignora sessão inválida
      }
      const r = await fetch("/api/presentes/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerName: name.trim(),
          buyerWhatsapp: whatsapp.trim(),
          items: items.map((it) => ({
            id: it.id,
            nome: it.nome,
            valor: it.valor,
            qtd: it.qtd,
          })),
          total: total(),
          paymentMethod: "pix",
          previousPurchaseId,
        }),
      });
      const data = (await r.json().catch(() => ({}))) as {
        ok?: boolean;
        id?: string;
        error?: string;
        takenItemIds?: string[];
        short?: { id: string; restante: number }[];
      };
      // Outra pessoa escolheu nesse meio tempo: ajusta o carrinho e avisa.
      if (r.status === 409 && (data.short || data.takenItemIds)) {
        const avisos = (data.short ?? []).map(({ id, restante }) => {
          const item = items.find((it) => it.id === id);
          const nome = item?.nome.replace(/ \(cota.*$/, "") ?? "esse presente";
          if (restante === 0) {
            remove(id);
            return `${nome} já foi completado`;
          }
          if (item) setItem(item, restante);
          return `${nome} só tem mais ${restante} ${restante === 1 ? "cota" : "cotas"}`;
        });
        for (const id of data.takenItemIds ?? []) {
          const item = items.find((it) => it.id === id);
          if (item) avisos.push(`alguém acabou de escolher: ${item.nome}`);
          remove(id);
        }
        useCartStore.getState().close();
        // Carrinho vazio volta para a lista, onde o aviso abaixo não aparece.
        if (useCartStore.getState().items.length === 0) {
          toast("Esse presente acabou de ser escolhido");
        }
        setError(`Ops! ${avisos.join("; ")}. Ajustamos seu carrinho 😅`);
        return;
      }
      if (!r.ok) throw new Error(data.error ?? "Erro ao registrar presente");
      sessionStorage.setItem(
        "presente-buyer",
        JSON.stringify({
          name: name.trim(),
          whatsapp: whatsapp.trim(),
          purchaseId: data.id,
        }),
      );
      router.push("/presentes/pagar");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Erro ao continuar para pagamento.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!hydrated) return null;

  return (
    <main className="min-h-screen bg-[var(--color-champagne-darker)] text-[var(--color-cream)] flex flex-col">
      <Link
        href="/presentes"
        className="self-start m-4 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[rgba(247,243,238,0.14)] text-[13px] tracking-[0.1em] uppercase text-[var(--color-cream)] hover:bg-[rgba(247,243,238,0.24)]"
      >
        <ArrowLeft size={15} /> Lista
      </Link>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center px-5 pt-2 pb-16"
      >
        <div className="w-full max-w-md text-center">
          <h1 className="font-[var(--font-display)] text-3xl mb-1">
            Seu presente em dinheiro
          </h1>
          <p className="text-base mb-1">
            {items.length} {items.length === 1 ? "presente escolhido" : "presentes escolhidos"}
          </p>
          <p
            className="font-[var(--font-display)] text-5xl md:text-6xl my-4 tabular-nums"
            style={{ color: "#e6c98e" }}
          >
            {formatBRL(total())}
          </p>

          <ul className="text-left text-[15px] space-y-1 mb-4 max-h-40 overflow-y-auto">
            {items.map((it) => (
              <li
                key={it.id}
                className="flex items-center justify-between border-b border-[rgba(196,168,130,0.2)] py-2"
              >
                <span>
                  {it.qtd}× {it.nome}
                </span>
                <span>{formatBRL(it.valor * it.qtd)}</span>
              </li>
            ))}
          </ul>

          <p className="text-base leading-relaxed mb-8">
            Não precisa comprar nem levar o item: você envia esse valor para nós
            💛
          </p>

          <p className="label-uppercase !text-[#e6c98e] !text-[13px] !tracking-[0.14em] mb-3">
            Antes de enviar, seus dados
          </p>

          <div className="space-y-5 text-left">
            <div>
              <label className="block label-uppercase !text-[#e6c98e] !text-[13px] !tracking-[0.14em] mb-1.5 text-center">
                Nome completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="w-full bg-transparent border-0 border-b border-[#e6c98e] py-2 text-center font-[var(--font-display)] text-xl text-[var(--color-cream)] placeholder:text-[rgba(247,243,238,0.65)] focus:outline-none focus:border-[var(--color-champagne)]"
              />
            </div>
            <div>
              <label className="block label-uppercase !text-[#e6c98e] !text-[13px] !tracking-[0.14em] mb-1.5 text-center">
                WhatsApp
              </label>
              <input
                type="tel"
                inputMode="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(maskWhatsapp(e.target.value))}
                placeholder="(11) 9 0000-0000"
                className="w-full bg-transparent border-0 border-b border-[#e6c98e] py-2 text-center font-[var(--font-display)] text-xl text-[var(--color-cream)] placeholder:text-[rgba(247,243,238,0.65)] focus:outline-none focus:border-[var(--color-champagne)]"
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 text-[15px] text-red-100 bg-red-950/40 border border-red-900/40 rounded-lg py-2 px-3">
              {error}
            </p>
          )}

          <button
            type="button"
            disabled={submitting}
            onClick={submit}
            className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-champagne)] text-[var(--color-champagne-darker)] hover:bg-[#d8be90] py-4 px-5 text-[14px] tracking-[0.06em] uppercase font-medium transition-colors disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                Continuar para enviar o valor <ArrowRight size={16} />
              </>
            )}
          </button>

          <p className="mt-8">
            <Link
              href="/presentes"
              className="text-base underline underline-offset-4 text-[var(--color-cream)] hover:text-[#e6c98e]"
            >
              ← Voltar para a lista
            </Link>
          </p>
        </div>
      </motion.section>
    </main>
  );
}
