"use client";

import { useState } from "react";
import { CheckCircle2, Clock, MessageCircle, Trash2 } from "lucide-react";
import type { AdminGiftPurchase } from "@/lib/admin-data";
import { formatBRL } from "@/lib/utils";

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

export function GiftPurchasesTable({
  purchases,
  onRefresh,
}: {
  purchases: AdminGiftPurchase[];
  onRefresh?: () => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);

  const totalConfirmado = purchases
    .filter((p) => p.status === "confirmado")
    .reduce((s, p) => s + p.total, 0);
  const totalAguardando = purchases
    .filter((p) => p.status === "aguardando")
    .reduce((s, p) => s + p.total, 0);

  const handleToggle = async (p: AdminGiftPurchase) => {
    if (p.status === "aguardando") {
      const ok = window.confirm(
        `Confirmar o presente de ${p.buyerName} (${formatBRL(p.total)})?\n\nFaça isso apenas após verificar o comprovante.`,
      );
      if (!ok) return;
    }
    setBusy(p.id);
    try {
      const next = p.status === "confirmado" ? "aguardando" : "confirmado";
      await fetch(`/api/admin/gift-purchases/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      onRefresh?.();
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async (p: AdminGiftPurchase) => {
    const ok = window.confirm(
      `Remover permanentemente o registro de "${p.buyerName}" (${formatBRL(p.total)})?\n\nEssa ação não pode ser desfeita.`,
    );
    if (!ok) return;
    setBusy(p.id);
    try {
      await fetch(`/api/admin/gift-purchases/${p.id}`, { method: "DELETE" });
      onRefresh?.();
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="card-soft p-5">
          <p className="label-uppercase mb-1">Confirmado</p>
          <p
            className="font-[var(--font-display)] text-3xl"
            style={{ color: "var(--color-champagne-deep)" }}
          >
            {formatBRL(totalConfirmado)}
          </p>
          <p className="text-xs text-[var(--color-text-soft)] mt-1">
            {purchases.filter((p) => p.status === "confirmado").length}{" "}
            presente(s) recebidos
          </p>
        </div>
        <div className="card-soft p-5">
          <p className="label-uppercase mb-1">Aguardando comprovante</p>
          <p
            className="font-[var(--font-display)] text-3xl"
            style={{ color: "var(--color-text-soft)" }}
          >
            {formatBRL(totalAguardando)}
          </p>
          <p className="text-xs text-[var(--color-text-soft)] mt-1">
            {purchases.filter((p) => p.status === "aguardando").length}{" "}
            registrados
          </p>
        </div>
      </div>

      {purchases.length === 0 ? (
        <div className="card-soft p-10 text-center">
          <p className="font-[var(--font-display)] italic text-[var(--color-text-soft)]">
            Nenhum presente registrado ainda.
          </p>
        </div>
      ) : (
        <div className="card-soft overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-[var(--color-border-soft)] bg-[var(--color-cream-soft)]">
                <th className="px-4 py-3 label-uppercase">Data</th>
                <th className="px-4 py-3 label-uppercase">Comprador</th>
                <th className="px-4 py-3 label-uppercase">Itens</th>
                <th className="px-4 py-3 label-uppercase">Total</th>
                <th className="px-4 py-3 label-uppercase">Método</th>
                <th className="px-4 py-3 label-uppercase">Status</th>
                <th className="px-4 py-3 label-uppercase">Ações</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => {
                const waNumber = p.buyerWhatsapp.replace(/\D/g, "");
                const waLink = `https://wa.me/55${waNumber}`;
                const isBusy = busy === p.id;
                return (
                  <tr
                    key={p.id}
                    className="border-b border-[var(--color-border-soft)] last:border-b-0 align-top"
                  >
                    <td className="px-4 py-3 text-xs whitespace-nowrap text-[var(--color-text-soft)]">
                      {fmtDate(p.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--color-ink)]">
                        {p.buyerName}
                      </p>
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[var(--color-champagne-deep)] hover:underline"
                      >
                        <MessageCircle size={12} /> {p.buyerWhatsapp}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-xs max-w-[260px]">
                      <ul>
                        {p.items.map((it, i) => (
                          <li key={i}>
                            {it.qtd}× {it.nome} ·{" "}
                            <span className="text-[var(--color-champagne-deep)]">
                              {formatBRL(it.valor * it.qtd)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-3 font-[var(--font-display)] text-lg text-[var(--color-champagne-deep)]">
                      {formatBRL(p.total)}
                    </td>
                    <td className="px-4 py-3 text-xs uppercase tracking-[0.2em] text-[var(--color-text-soft)]">
                      {p.paymentMethod ?? "·"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggle(p)}
                        disabled={isBusy}
                        title={
                          p.status === "aguardando"
                            ? "Clicar para confirmar (pede confirmação)"
                            : "Clicar para reverter para aguardando"
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-medium transition-colors disabled:opacity-60"
                        style={{
                          background:
                            p.status === "confirmado"
                              ? "var(--color-pastel-mint)"
                              : "var(--color-pastel-yellow)",
                          color: "var(--color-ink)",
                        }}
                      >
                        {p.status === "confirmado" ? (
                          <>
                            <CheckCircle2 size={12} /> Confirmado
                          </>
                        ) : (
                          <>
                            <Clock size={12} /> Aguardando
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleDelete(p)}
                        disabled={isBusy}
                        title="Remover registro"
                        className="p-1.5 rounded-lg text-[var(--color-text-soft)] hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
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
    </div>
  );
}
