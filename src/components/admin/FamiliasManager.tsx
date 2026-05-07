"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  X,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  UserPlus,
} from "lucide-react";
import type { AdminFamily } from "@/lib/admin-data";

type Props = { initial: AdminFamily[] };

export function FamiliasManager({ initial }: Props) {
  const [families, setFamilies] = useState(initial);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [members, setMembers] = useState<{ name: string; isChild: boolean }[]>([
    { name: "", isChild: false },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName("");
    setMembers([{ name: "", isChild: false }]);
    setError(null);
  };

  const addRow = () =>
    setMembers((m) => [...m, { name: "", isChild: false }]);
  const removeRow = (i: number) =>
    setMembers((m) => (m.length === 1 ? m : m.filter((_, idx) => idx !== i)));

  const submit = async () => {
    setError(null);
    if (name.trim().length < 2) {
      setError("Informe o nome da família.");
      return;
    }
    const cleaned = members
      .map((m) => ({ name: m.name.trim(), isChild: m.isChild }))
      .filter((m) => m.name.length > 0);
    if (cleaned.length === 0) {
      setError("Adicione pelo menos um integrante.");
      return;
    }
    setSubmitting(true);
    try {
      const r = await fetch("/api/admin/families", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), members: cleaned }),
      });
      const data = (await r.json().catch(() => ({}))) as { ok?: boolean; id?: string; error?: string };
      if (!r.ok) throw new Error(data.error ?? "Erro ao criar família");
      const id = data.id ?? "temp";
      const newFamily: AdminFamily = {
        id,
        name: name.trim(),
        members: cleaned.map((m, idx) => ({
          id: `temp-${idx}`,
          name: m.name,
          isChild: m.isChild,
        })),
        latestResponse: null,
      };
      setFamilies((fs) => [...fs, newFamily]);
      setOpen(false);
      reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Remover esta família e todos os seus integrantes?")) return;
    const r = await fetch(`/api/admin/families/${id}`, { method: "DELETE" });
    if (r.ok) {
      setFamilies((fs) => fs.filter((f) => f.id !== id));
    }
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-[var(--color-text-soft)]">
          {families.length} família(s) ·{" "}
          {families.reduce((s, f) => s + f.members.length, 0)} convidado(s)
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-champagne-darker)] hover:bg-[var(--color-champagne-deep)] text-white py-2 px-4 text-[11px] tracking-[0.25em] uppercase font-medium"
        >
          <UserPlus size={13} /> Adicionar Família
        </button>
      </div>

      {families.length === 0 ? (
        <div className="card-soft p-10 text-center">
          <p className="font-[var(--font-display)] italic text-[var(--color-text-soft)]">
            Nenhuma família cadastrada ainda.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {families.map((f) => (
            <article
              key={f.id}
              className="card-soft p-5 flex flex-col"
            >
              <header className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-[var(--font-display)] text-xl text-[var(--color-ink)] leading-tight">
                  {f.name}
                </h3>
                <button
                  type="button"
                  onClick={() => remove(f.id)}
                  className="p-1.5 text-[var(--color-text-soft)] hover:text-red-700"
                  aria-label="Remover família"
                >
                  <Trash2 size={14} />
                </button>
              </header>
              <ul className="space-y-1 mb-3 text-sm">
                {f.members.map((m) => {
                  const attending =
                    f.latestResponse?.attendingGuestIds.includes(m.id);
                  const responded = !!f.latestResponse;
                  return (
                    <li
                      key={m.id}
                      className="flex items-center gap-2 text-[var(--color-text)]"
                    >
                      {responded ? (
                        attending && f.latestResponse?.confirmed ? (
                          <CheckCircle2 size={14} className="text-emerald-700" />
                        ) : (
                          <XCircle size={14} className="text-red-700" />
                        )
                      ) : (
                        <Clock size={14} className="text-[var(--color-champagne-light)]" />
                      )}
                      <span>{m.name}</span>
                      {m.isChild && (
                        <span className="ml-auto text-[10px] tracking-[0.2em] uppercase text-[var(--color-champagne-light)]">
                          criança
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
              <p
                className="mt-auto text-[10px] tracking-[0.25em] uppercase font-medium px-2 py-1 rounded-full text-center"
                style={{
                  background: f.latestResponse
                    ? f.latestResponse.confirmed
                      ? "var(--color-pastel-mint)"
                      : "var(--color-pastel-rose)"
                    : "var(--color-pastel-yellow)",
                  color: "var(--color-ink)",
                }}
              >
                {f.latestResponse
                  ? f.latestResponse.confirmed
                    ? "Confirmado"
                    : "Não vai"
                  : "Pendente"}
              </p>
            </article>
          ))}
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[rgba(46,34,24,0.55)] flex items-center justify-center p-5"
            onClick={() => !submitting && setOpen(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="card-soft w-full max-w-md max-h-[90vh] overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-[var(--font-display)] text-xl text-[var(--color-ink)]">
                  Nova Família
                </h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-1 text-[var(--color-text-soft)]"
                  aria-label="Fechar"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="label-uppercase block mb-1.5">
                    Nome da família
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Família Silva"
                    className="input-soft"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="label-uppercase block mb-1.5">
                    Integrantes
                  </label>
                  <div className="space-y-2">
                    {members.map((m, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={m.name}
                          onChange={(e) => {
                            const v = e.target.value;
                            setMembers((cur) =>
                              cur.map((x, idx) =>
                                idx === i ? { ...x, name: v } : x,
                              ),
                            );
                          }}
                          placeholder={`Integrante ${i + 1}`}
                          className="input-soft flex-1"
                        />
                        <label className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-soft)] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={m.isChild}
                            onChange={(e) => {
                              const v = e.target.checked;
                              setMembers((cur) =>
                                cur.map((x, idx) =>
                                  idx === i ? { ...x, isChild: v } : x,
                                ),
                              );
                            }}
                          />
                          criança
                        </label>
                        {members.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRow(i)}
                            className="p-1.5 text-[var(--color-text-soft)] hover:text-red-700"
                            aria-label="Remover linha"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addRow}
                      className="inline-flex items-center gap-1.5 text-xs text-[var(--color-champagne-deep)] hover:underline"
                    >
                      <Plus size={12} /> Adicionar integrante
                    </button>
                  </div>
                </div>
                {error && (
                  <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg py-2 px-3">
                    {error}
                  </p>
                )}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    disabled={submitting}
                    className="flex-1 rounded-full border border-[var(--color-border-soft)] py-2.5 text-[11px] tracking-[0.25em] uppercase text-[var(--color-text-soft)]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={submit}
                    disabled={submitting}
                    className="flex-1 rounded-full bg-[var(--color-champagne-darker)] hover:bg-[var(--color-champagne-deep)] text-white py-2.5 px-4 text-[11px] tracking-[0.25em] uppercase font-medium inline-flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      "Salvar família"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
