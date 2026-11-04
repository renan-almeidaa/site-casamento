"use client";

import { useState } from "react";
import { Copy, MessageCircle, Trash2, Undo2 } from "lucide-react";
import type { AdminChaResponse } from "@/lib/cha-data";
import { CHA, WEDDING } from "@/lib/wedding-data";
import { CHA_ITENS } from "@/data/cha-itens";
import { useToast } from "@/components/ui/toaster";

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

export function ChaManager({
  responses,
  onRefresh,
}: {
  responses: AdminChaResponse[];
  onRefresh: () => void;
}) {
  const { toast } = useToast();
  const [busy, setBusy] = useState<string | null>(null);

  const vao = responses.filter((r) => r.attendingNames.length > 0);
  const pessoas = vao.reduce((s, r) => s + r.attendingNames.length, 0);
  const pix = responses.filter((r) => r.givesPix).length;
  const claimed = responses.flatMap((r) =>
    r.items.map((it) => ({ ...it, familyName: r.familyName })),
  );

  const link =
    typeof window !== "undefined"
      ? `${window.location.origin}/cha/${CHA.slug}`
      : `/cha/${CHA.slug}`;

  const release = async (itemId: string, nome: string, familyName: string) => {
    if (!window.confirm(`Liberar "${nome}" (escolhido por ${familyName})?\n\nEle volta a ficar disponível na lista.`)) return;
    setBusy(itemId);
    try {
      await fetch(`/api/admin/cha/claims/${encodeURIComponent(itemId)}`, { method: "DELETE" });
      onRefresh();
    } finally {
      setBusy(null);
    }
  };

  const remove = async (r: AdminChaResponse) => {
    if (!window.confirm(`Apagar a resposta de ${r.familyName}?\n\nOs itens dela voltam para a lista e a família pode responder de novo.`)) return;
    setBusy(r.id);
    try {
      await fetch(`/api/admin/cha/responses/${r.id}`, { method: "DELETE" });
      onRefresh();
    } finally {
      setBusy(null);
    }
  };

  const cards = [
    { label: "Famílias responderam", value: responses.length },
    { label: "Pessoas vão", value: pessoas },
    { label: "Itens escolhidos", value: `${claimed.length} / ${CHA_ITENS.length}` },
    { label: "Vão de Pix", value: pix },
  ];

  return (
    <div className="space-y-8">
      <div className="card-soft p-5 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="label-uppercase mb-1">Link para enviar</p>
          <p className="text-sm text-[var(--color-ink)] truncate">{link}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(link);
            toast("Link copiado!");
          }}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-champagne-deep)] px-4 py-2 text-[11px] tracking-[0.2em] uppercase text-[var(--color-champagne-darker)] hover:bg-[var(--color-champagne-darker)] hover:text-[var(--color-cream)]"
        >
          <Copy size={13} /> Copiar link
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {cards.map((c) => (
          <div key={c.label} className="card-soft p-5">
            <p className="label-uppercase mb-1">{c.label}</p>
            <p className="font-[var(--font-display)] text-2xl text-[var(--color-ink)]">{c.value}</p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="heading-display text-2xl mb-3">Respostas</h2>
        {responses.length === 0 ? (
          <div className="card-soft p-10 text-center">
            <p className="font-[var(--font-display)] italic text-[var(--color-text-soft)]">
              Ninguém respondeu ainda.
            </p>
          </div>
        ) : (
          <div className="card-soft overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-[var(--color-border-soft)] bg-[var(--color-cream-soft)]">
                  <th className="px-4 py-3 label-uppercase">Data</th>
                  <th className="px-4 py-3 label-uppercase">Família</th>
                  <th className="px-4 py-3 label-uppercase">Quem vai</th>
                  <th className="px-4 py-3 label-uppercase">Presentes</th>
                  <th className="px-4 py-3 label-uppercase">Recado</th>
                  <th className="px-4 py-3 label-uppercase">Ações</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((r) => {
                  const wa = `https://wa.me/55${r.whatsapp.replace(/\D/g, "")}`;
                  return (
                    <tr key={r.id} className="border-b border-[var(--color-border-soft)] last:border-b-0 align-top">
                      <td className="px-4 py-3 text-xs whitespace-nowrap text-[var(--color-text-soft)]">
                        {fmtDate(r.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-[var(--color-ink)]">{r.familyName}</p>
                        <a
                          href={wa}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-[var(--color-champagne-deep)] hover:underline"
                        >
                          <MessageCircle size={12} /> {r.whatsapp}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-[var(--color-text)]">
                        {r.attendingNames.length > 0 ? (
                          r.attendingNames.join(", ")
                        ) : (
                          <span className="text-[var(--color-text-soft)]">Não vão</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[var(--color-text)]">
                        {r.givesPix && <p>💸 Pix / cartão</p>}
                        {r.items.map((it) => (
                          <p key={it.id}>🎁 {it.nome}</p>
                        ))}
                        {!r.givesPix && r.items.length === 0 && (
                          <span className="text-[var(--color-text-soft)]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--color-text-soft)] max-w-[220px]">
                        {r.comment ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => remove(r)}
                          disabled={busy === r.id}
                          aria-label={`Apagar resposta de ${r.familyName}`}
                          className="p-2 rounded-lg text-[var(--color-text-soft)] hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {claimed.length > 0 && (
        <section>
          <h2 className="heading-display text-2xl mb-1">Itens escolhidos</h2>
          <p className="text-sm text-[var(--color-text-soft)] mb-3">
            Se alguém desistir, libere o item para ele voltar à lista.
          </p>
          <div className="card-soft divide-y divide-[var(--color-border-soft)]">
            {claimed.map((it) => (
              <div key={it.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--color-ink)]">{it.nome}</p>
                  <p className="text-xs text-[var(--color-text-soft)]">
                    {it.comodo} · {it.familyName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => release(it.id, it.nome, it.familyName)}
                  disabled={busy === it.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-soft)] px-3 py-1.5 text-[11px] tracking-[0.15em] uppercase text-[var(--color-text-soft)] hover:bg-[var(--color-cream)] disabled:opacity-50"
                >
                  <Undo2 size={12} /> Liberar
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="text-xs text-[var(--color-text-soft)]">
        {CHA.dateLabel} · {CHA.timeLabel} · {CHA.address}, CEP {CHA.cep} · {WEDDING.coupleName}
      </p>
    </div>
  );
}
