"use client";

import { useMemo, useState } from "react";
import { Check, Download, Search, Trash2, X as XIcon } from "lucide-react";
import type { AdminRsvp } from "@/lib/admin-data";

type Filter = "todos" | "confirmados" | "parcial" | "nao";

type Status = {
  key: "confirmado" | "parcial" | "nao";
  label: string;
  bg: string;
};

const statusOf = (r: AdminRsvp): Status => {
  if (r.attendingNames.length === 0) {
    return {
      key: "nao",
      label: "Não vai",
      bg: "var(--color-pastel-rose)",
    };
  }
  if (r.notAttendingNames.length === 0) {
    return {
      key: "confirmado",
      label: "Confirmado",
      bg: "var(--color-pastel-mint)",
    };
  }
  return {
    key: "parcial",
    label: "Parcial",
    bg: "var(--color-pastel-yellow)",
  };
};

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

const FILTER_LABELS: Record<Filter, string> = {
  todos: "Todos",
  confirmados: "Confirmados",
  parcial: "Parcial",
  nao: "Não vão",
};

export function RsvpTable({
  rsvps,
  onRefresh,
}: {
  rsvps: AdminRsvp[];
  onRefresh?: () => void;
}) {
  const [filter, setFilter] = useState<Filter>("todos");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const handleDelete = async (r: AdminRsvp) => {
    const ok = window.confirm(
      `Apagar a resposta de "${r.familyName}"?\n\nEssa ação não pode ser desfeita. Depois de apagar, a família poderá responder novamente pelo site.`,
    );
    if (!ok) return;
    setBusy(r.id);
    try {
      await fetch(`/api/admin/rsvp-responses/${r.id}`, { method: "DELETE" });
      onRefresh?.();
    } finally {
      setBusy(null);
    }
  };

  const filtered = useMemo(() => {
    let list = rsvps;
    if (filter !== "todos") {
      list = list.filter((r) => {
        const s = statusOf(r).key;
        if (filter === "confirmados") return s === "confirmado";
        if (filter === "parcial") return s === "parcial";
        return s === "nao";
      });
    }
    if (q.trim().length >= 2) {
      const qq = q.toLowerCase();
      list = list.filter(
        (r) =>
          r.familyName.toLowerCase().includes(qq) ||
          r.email.toLowerCase().includes(qq) ||
          r.attendingNames.some((n) => n.toLowerCase().includes(qq)) ||
          r.notAttendingNames.some((n) => n.toLowerCase().includes(qq)),
      );
    }
    return list;
  }, [rsvps, filter, q]);

  const exportCsv = () => {
    const header = [
      "Data",
      "Família",
      "Status",
      "Vão",
      "Não vão",
      "Telefone",
      "Email",
      "Comentário",
    ];
    const rows = filtered.map((r) => [
      fmtDate(r.createdAt),
      r.familyName,
      statusOf(r).label,
      r.attendingNames.join("; "),
      r.notAttendingNames.join("; "),
      r.phone,
      r.email,
      r.comment ?? "",
    ]);
    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");
    const blob = new Blob([`﻿${csv}`], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rsvp-samara-renan-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-champagne)]"
          />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome, família ou email..."
            className="input-soft"
            style={{ paddingLeft: "2.25rem" }}
          />
        </div>
        <div className="flex rounded-full border border-[var(--color-border-soft)] overflow-hidden text-[11px] tracking-[0.2em] uppercase">
          {(Object.keys(FILTER_LABELS) as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-2 ${
                filter === f
                  ? "bg-[var(--color-champagne-darker)] text-[var(--color-cream)]"
                  : "text-[var(--color-text-soft)]"
              }`}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-soft)] px-3 py-2 text-[11px] tracking-[0.2em] uppercase text-[var(--color-text-soft)] hover:bg-[var(--color-cream-soft)] disabled:opacity-50"
        >
          <Download size={12} /> Exportar CSV
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="card-soft p-10 text-center">
          <p className="font-[var(--font-display)] italic text-[var(--color-text-soft)]">
            Nenhuma resposta ainda.
          </p>
        </div>
      ) : (
        <div className="card-soft overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-[var(--color-border-soft)] bg-[var(--color-cream-soft)]">
                <th className="px-4 py-3 label-uppercase">Data</th>
                <th className="px-4 py-3 label-uppercase">Família</th>
                <th className="px-4 py-3 label-uppercase">Resposta</th>
                <th className="px-4 py-3 label-uppercase">Quem</th>
                <th className="px-4 py-3 label-uppercase">Contato</th>
                <th className="px-4 py-3 label-uppercase">Comentário</th>
                <th className="px-4 py-3 label-uppercase">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const status = statusOf(r);
                return (
                  <tr
                    key={r.id}
                    className="border-b border-[var(--color-border-soft)] last:border-b-0 align-top"
                  >
                    <td className="px-4 py-3 text-xs whitespace-nowrap text-[var(--color-text-soft)]">
                      {fmtDate(r.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-medium text-[var(--color-ink)]">
                      {r.familyName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-medium"
                        style={{
                          background: status.bg,
                          color: "var(--color-ink)",
                        }}
                      >
                        {status.label}
                      </span>
                      <p className="mt-1 text-[10px] text-[var(--color-text-soft)]">
                        {r.attendingNames.length} de{" "}
                        {r.attendingNames.length + r.notAttendingNames.length}{" "}
                        vão
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs space-y-1.5">
                      {r.attendingNames.length > 0 && (
                        <div className="flex items-start gap-1.5">
                          <Check
                            size={12}
                            strokeWidth={2.5}
                            className="text-emerald-700 mt-0.5 shrink-0"
                          />
                          <span className="text-[var(--color-text)]">
                            {r.attendingNames.join(", ")}
                          </span>
                        </div>
                      )}
                      {r.notAttendingNames.length > 0 && (
                        <div className="flex items-start gap-1.5">
                          <XIcon
                            size={12}
                            strokeWidth={2.5}
                            className="text-red-700 mt-0.5 shrink-0"
                          />
                          <span className="text-[var(--color-text-soft)] line-through decoration-[var(--color-text-soft)]/40">
                            {r.notAttendingNames.join(", ")}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      <a
                        href={`tel:${r.phone}`}
                        className="block text-[var(--color-champagne-deep)] hover:underline"
                      >
                        {r.phone}
                      </a>
                      <a
                        href={`mailto:${r.email}`}
                        className="block text-[var(--color-text-soft)] hover:underline truncate max-w-[180px]"
                      >
                        {r.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-xs italic text-[var(--color-text-soft)] max-w-[260px]">
                      {r.comment || "·"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleDelete(r)}
                        disabled={busy === r.id}
                        title="Apagar resposta"
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
