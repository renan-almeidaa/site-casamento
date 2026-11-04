"use client";

import { useState } from "react";
import { MessageCircle, Undo2 } from "lucide-react";
import type { AdminLotClaim } from "@/lib/gift-lots";
import {
  LOTES_POR_PRESENTE,
  PRESENTES,
  loteId,
  temLotes,
  valorDoLote,
} from "@/data/presentes";
import { formatBRL } from "@/lib/utils";

// Controle dos lotes dos presentes grandes: quem ficou com cada lote e
// botão para liberar (o lote volta a ficar disponível no site).
export function LotesManager({
  claims,
  onRefresh,
}: {
  claims: AdminLotClaim[];
  onRefresh: () => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const byLot = new Map(claims.map((c) => [c.lotId, c]));

  const release = async (c: AdminLotClaim, nome: string, numero: number) => {
    const ok = window.confirm(
      `Liberar o lote ${numero} de ${nome} (escolhido por ${c.buyerName})?\n\nEle volta a ficar disponível no site e sai da compra dessa pessoa.`,
    );
    if (!ok) return;
    setBusy(c.lotId);
    setError(null);
    try {
      const r = await fetch(`/api/admin/lotes/${encodeURIComponent(c.lotId)}`, {
        method: "DELETE",
      });
      if (!r.ok) {
        const d = (await r.json().catch(() => ({}))) as { error?: string };
        setError(d.error ?? "Não foi possível liberar o lote.");
        return;
      }
      onRefresh();
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="mb-10">
      <h2 className="heading-display text-2xl mb-1">Lotes</h2>
      <p className="text-sm text-[var(--color-text-soft)] mb-4">
        Se alguém desistir, libere o lote. Apagar a compra na tabela abaixo
        também libera todos os lotes dela.
      </p>
      {error && (
        <p className="mb-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg py-2 px-3">
          {error}
        </p>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        {PRESENTES.filter(temLotes).map((p) => {
          const lotes = Array.from({ length: LOTES_POR_PRESENTE }, (_, i) => ({
            numero: i + 1,
            claim: byLot.get(loteId(p.id, i + 1)),
          }));
          const ocupados = lotes.filter((l) => l.claim);
          return (
            <div key={p.id} className="card-soft p-5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-[var(--font-display)] text-lg text-[var(--color-ink)]">
                  {p.nome}
                </p>
                <p className="text-xs text-[var(--color-text-soft)] whitespace-nowrap">
                  {ocupados.length} de {LOTES_POR_PRESENTE} · {formatBRL(valorDoLote(p))}/lote
                </p>
              </div>
              <div className="flex gap-1.5 mt-3">
                {lotes.map((l) => (
                  <span
                    key={l.numero}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                      l.claim
                        ? "bg-[var(--color-cream-deep)] text-[var(--color-text-soft)] line-through decoration-[var(--color-champagne-deep)] decoration-2"
                        : "border border-[var(--color-champagne)] bg-white text-[var(--color-ink)]"
                    }`}
                  >
                    {l.numero}
                  </span>
                ))}
              </div>
              {ocupados.length > 0 && (
                <ul className="mt-3 divide-y divide-[var(--color-border-soft)]">
                  {ocupados.map(({ numero, claim }) => (
                    <li key={numero} className="flex items-center gap-3 py-2.5">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--color-ink)]">
                          Lote {numero} · {claim!.buyerName}
                        </p>
                        <a
                          href={`https://wa.me/55${claim!.buyerWhatsapp.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-[var(--color-champagne-deep)] hover:underline"
                        >
                          <MessageCircle size={12} /> {claim!.buyerWhatsapp}
                        </a>
                        <span className="ml-2 text-xs text-[var(--color-text-soft)]">
                          {claim!.status === "confirmado" ? "Confirmado" : "Aguardando"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => release(claim!, p.nome, numero)}
                        disabled={busy === claim!.lotId}
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
