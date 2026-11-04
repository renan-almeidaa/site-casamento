"use client";

import { useState } from "react";
import { MessageCircle, Undo2 } from "lucide-react";
import type { AdminQuotaClaim } from "@/lib/gift-quotas";
import { PRESENTES, VALOR_COTA, temCotas, totalCotas } from "@/data/presentes";
import { formatBRL } from "@/lib/utils";

// Controle das cotas dos presentes grandes: quem escolheu quantas e botão
// para liberar (as cotas voltam a ficar disponíveis no site).
export function CotasManager({
  claims,
  onRefresh,
}: {
  claims: AdminQuotaClaim[];
  onRefresh: () => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const release = async (c: AdminQuotaClaim, nome: string) => {
    const ok = window.confirm(
      `Liberar ${c.qtd} ${c.qtd === 1 ? "cota" : "cotas"} de ${nome} (${c.buyerName})?\n\nElas voltam a ficar disponíveis no site e saem da compra dessa pessoa.`,
    );
    if (!ok) return;
    setBusy(c.id);
    setError(null);
    try {
      const r = await fetch(`/api/admin/cotas/${encodeURIComponent(c.id)}`, {
        method: "DELETE",
      });
      if (!r.ok) {
        const d = (await r.json().catch(() => ({}))) as { error?: string };
        setError(d.error ?? "Não foi possível liberar as cotas.");
        return;
      }
      onRefresh();
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="mb-10">
      <h2 className="heading-display text-2xl mb-1">Cotas</h2>
      <p className="text-sm text-[var(--color-text-soft)] mb-4">
        Se alguém desistir, libere as cotas. Apagar a compra na tabela abaixo
        também libera todas as cotas dela.
      </p>
      {error && (
        <p className="mb-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg py-2 px-3">
          {error}
        </p>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        {PRESENTES.filter(temCotas).map((p) => {
          const doPresente = claims.filter((c) => c.presenteId === p.id);
          const usadas = doPresente.reduce((sum, c) => sum + c.qtd, 0);
          const total = totalCotas(p);
          return (
            <div key={p.id} className="card-soft p-5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-[var(--font-display)] text-lg text-[var(--color-ink)]">
                  {p.nome}
                </p>
                <p className="text-xs text-[var(--color-text-soft)] whitespace-nowrap">
                  {usadas} de {total} cotas
                </p>
              </div>
              <p className="text-xs text-[var(--color-text-soft)] mt-1">
                {formatBRL(usadas * VALOR_COTA)} de {formatBRL(p.valor)}
              </p>
              <div className="mt-2 h-2 rounded-full bg-[var(--color-cream-deep)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--color-champagne-deep)]"
                  style={{ width: `${Math.min(100, (usadas / total) * 100)}%` }}
                />
              </div>
              {doPresente.length > 0 && (
                <ul className="mt-3 divide-y divide-[var(--color-border-soft)]">
                  {doPresente.map((c) => (
                    <li key={c.id} className="flex items-center gap-3 py-2.5">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--color-ink)]">
                          {c.buyerName} · {c.qtd} {c.qtd === 1 ? "cota" : "cotas"} ·{" "}
                          {formatBRL(c.qtd * VALOR_COTA)}
                        </p>
                        <a
                          href={`https://wa.me/55${c.buyerWhatsapp.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-[var(--color-champagne-deep)] hover:underline"
                        >
                          <MessageCircle size={12} /> {c.buyerWhatsapp}
                        </a>
                        <span className="ml-2 text-xs text-[var(--color-text-soft)]">
                          {c.status === "confirmado" ? "Confirmado" : "Aguardando"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => release(c, p.nome)}
                        disabled={busy === c.id}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-soft)] px-3 py-1.5 text-[11px] tracking-[0.15em] uppercase text-[var(--color-text-soft)] hover:bg-[var(--color-cream)] disabled:opacity-50"
                      >
                        <Undo2 size={12} /> Liberar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
