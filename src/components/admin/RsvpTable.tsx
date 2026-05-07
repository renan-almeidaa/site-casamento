"use client";

import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import type { AdminRsvp } from "@/lib/admin-data";

type Filter = "todos" | "sim" | "nao";

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

export function RsvpTable({ rsvps }: { rsvps: AdminRsvp[] }) {
  const [filter, setFilter] = useState<Filter>("todos");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let list = rsvps;
    if (filter === "sim") list = list.filter((r) => r.confirmed);
    if (filter === "nao") list = list.filter((r) => !r.confirmed);
    if (q.trim().length >= 2) {
      const qq = q.toLowerCase();
      list = list.filter(
        (r) =>
          r.familyName.toLowerCase().includes(qq) ||
          r.email.toLowerCase().includes(qq) ||
          r.attendingNames.some((n) => n.toLowerCase().includes(qq)),
      );
    }
    return list;
  }, [rsvps, filter, q]);

  const exportCsv = () => {
    const header = [
      "Data",
      "Família",
      "Confirmado",
      "Quem vem",
      "Telefone",
      "Email",
      "Comentário",
    ];
    const rows = filtered.map((r) => [
      fmtDate(r.createdAt),
      r.familyName,
      r.confirmed ? "Sim" : "Não",
      r.attendingNames.join("; "),
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
          {(["todos", "sim", "nao"] as Filter[]).map((f) => (
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
              {f === "todos" ? "Todos" : f === "sim" ? "Confirmados" : "Não vão"}
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
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-[var(--color-border-soft)] last:border-b-0"
                >
                  <td className="px-4 py-3 text-xs whitespace-nowrap text-[var(--color-text-soft)]">
                    {fmtDate(r.createdAt)}
                  </td>
                  <td className="px-4 py-3 font-medium text-[var(--color-ink)]">
                    {r.familyName}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-medium"
                      style={{
                        background: r.confirmed
                          ? "var(--color-pastel-mint)"
                          : "var(--color-pastel-rose)",
                        color: "var(--color-ink)",
                      }}
                    >
                      {r.confirmed ? "Vai" : "Não vai"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{r.attendingNames.join(", ")}</td>
                  <td className="px-4 py-3 text-xs">
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
                    {r.comment || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
