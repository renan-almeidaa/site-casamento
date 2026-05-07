"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatBRL, maskWhatsapp } from "@/lib/utils";

export default function ResumoPage() {
  const router = useRouter();
  const { items, total, count } = useCartStore();
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
        }),
      });
      const data = (await r.json().catch(() => ({}))) as {
        ok?: boolean;
        id?: string;
        error?: string;
      };
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
        className="fixed top-4 left-4 z-50 inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-[rgba(247,243,238,0.1)] backdrop-blur text-[11px] tracking-[0.2em] uppercase text-[var(--color-cream)] hover:bg-[rgba(247,243,238,0.2)]"
      >
        <ArrowLeft size={13} /> Lista
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
          <p className="font-[var(--font-display)] text-xl md:text-2xl mb-1">
            {count()} {count() === 1 ? "item selecionado" : "itens selecionados"}
          </p>
          <p
            className="font-[var(--font-display)] text-5xl md:text-6xl my-4 tabular-nums"
            style={{ color: "#e6c98e" }}
          >
            {formatBRL(total())}
          </p>

          <ul className="text-left text-sm space-y-1 mb-8 max-h-32 overflow-y-auto opacity-80">
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

          <p className="label-uppercase text-[var(--color-champagne)] mb-3">
            Antes de pagar, seus dados
          </p>

          <div className="space-y-5 text-left">
            <div>
              <label className="block label-uppercase text-[var(--color-champagne)] mb-1.5 text-center">
                Nome completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="w-full bg-transparent border-0 border-b border-[rgba(196,168,130,0.5)] py-2 text-center font-[var(--font-display)] text-xl text-[var(--color-cream)] placeholder:text-[rgba(247,243,238,0.4)] focus:outline-none focus:border-[var(--color-champagne)]"
              />
            </div>
            <div>
              <label className="block label-uppercase text-[var(--color-champagne)] mb-1.5 text-center">
                WhatsApp
              </label>
              <input
                type="tel"
                inputMode="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(maskWhatsapp(e.target.value))}
                placeholder="(11) 9 0000-0000"
                className="w-full bg-transparent border-0 border-b border-[rgba(196,168,130,0.5)] py-2 text-center font-[var(--font-display)] text-xl text-[var(--color-cream)] placeholder:text-[rgba(247,243,238,0.4)] focus:outline-none focus:border-[var(--color-champagne)]"
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-200 bg-red-950/40 border border-red-900/40 rounded-lg py-2 px-3">
              {error}
            </p>
          )}

          <button
            type="button"
            disabled={submitting}
            onClick={submit}
            className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-champagne)] text-[var(--color-champagne-darker)] hover:bg-[#d8be90] py-3.5 px-6 text-[12px] tracking-[0.3em] uppercase font-medium transition-colors disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                Continuar para pagamento <ArrowRight size={14} />
              </>
            )}
          </button>

          <p className="mt-8">
            <Link
              href="/presentes"
              className="text-sm text-[var(--color-champagne)] hover:text-[var(--color-cream)]"
            >
              ← Voltar para a lista
            </Link>
          </p>
        </div>
      </motion.section>
    </main>
  );
}
