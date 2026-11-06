"use client";

import { useState } from "react";
import { MessageCircle, Undo2 } from "lucide-react";
import type { AdminItemClaim } from "@/lib/gift-quotas";
import { PRESENTES } from "@/data/presentes";
import { formatBRL } from "@/lib/utils";

// Itens de dono único já escolhidos: mostra quem escolheu e permite liberar
// (o item volta a ficar disponível no site).
export function ItensManager({
  claims,
  onRefresh,
}: {
  claims: AdminItemClaim[];
  onRefresh: () => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const release = async (c: AdminItemClaim, nome: string) => {
    const ok = window.confirm(
      `Liberar ${nome} (${c.buyerName})?\n\nEle volta a ficar disponível no site e sai da compra dessa pessoa.`,
    );
    if (!ok) return;
    setBusy(c.itemId);
    setError(null);
    try {
      const r = await fetch(`/api/admin/itens/${encodeURIComponent(c.itemId)}`, {
        method: "DELETE",
      });
      if (!r.ok) {
        const d = (await r.json().catch(() => ({}))) as { error?: string };
        setError(d.error ?? "Não foi possível liberar o item.");
        return;
      }
      onRefresh();
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="mb-10">
      <h2 className="heading-display text-2xl mb-1">Itens escolhidos</h2>
      <p className="text-sm text-[var(--color-text-soft)] mb-4">
        Estes aparecem riscados no site. Se alguém desistir, libere o item.
        Apagar a compra na tabela abaixo também libera.
      </p>
      {error && (
        <p className="mb-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg py-2 px-3">
          {error}
        </p>
      )}
      {claims.length === 0 ? (
        <div className="card-soft p-6 text-center">
          <p className="font-[var(--font-display)] italic text-[var(--color-text-soft)]">
            Nenhum item escolhido ainda.
          </p>
        </div>
      ) : (
        <ul className="card-soft divide-y divide-[var(--color-border-soft)]">
          {claims.map((c) => {
            const presente = PRESENTES.find((p) => p.id === c.itemId);
            const nome = presente?.nome ?? c.itemId;
            return (
              <li key={c.itemId} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--color-ink)]">
                    {nome}
                    {presente && ` · ${formatBRL(presente.valor)}`} · {c.buyerName}
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
                  onClick={() => release(c, nome)}
                  disabled={busy === c.itemId}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-soft)] px-3 py-1.5 text-[11px] tracking-[0.15em] uppercase text-[var(--color-text-soft)] hover:bg-[var(--color-cream)] disabled:opacity-50"
                >
                  <Undo2 size={12} /> Liberar
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
