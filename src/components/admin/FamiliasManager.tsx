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
  Pencil,
} from "lucide-react";
import type { AdminFamily } from "@/lib/admin-data";

type Props = { initial: AdminFamily[] };

type MemberDraft = {
  id?: string;
  name: string;
  isChild: boolean;
  /**
   * Apelidos como texto editável (separados por vírgula). Convertemos
   * para string[] no submit.
   */
  nicknamesText: string;
};

const parseNicknames = (s: string): string[] =>
  s
    .split(",")
    .map((n) => n.trim())
    .filter((n) => n.length > 0);

export function FamiliasManager({ initial }: Props) {
  const [families, setFamilies] = useState(initial);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [members, setMembers] = useState<MemberDraft[]>([
    { name: "", isChild: false, nicknamesText: "" },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = editingId !== null;

  const reset = () => {
    setEditingId(null);
    setName("");
    setMembers([{ name: "", isChild: false, nicknamesText: "" }]);
    setError(null);
  };

  const openCreate = () => {
    reset();
    setOpen(true);
  };

  const openEdit = (f: AdminFamily) => {
    setEditingId(f.id);
    setName(f.name);
    setMembers(
      f.members.length > 0
        ? f.members.map((m) => ({
            id: m.id,
            name: m.name,
            isChild: m.isChild,
            nicknamesText: m.nicknames.join(", "),
          }))
        : [{ name: "", isChild: false, nicknamesText: "" }],
    );
    setError(null);
    setOpen(true);
  };

  const addRow = () =>
    setMembers((m) => [
      ...m,
      { name: "", isChild: false, nicknamesText: "" },
    ]);
  const removeRow = (i: number) =>
    setMembers((m) => (m.length === 1 ? m : m.filter((_, idx) => idx !== i)));

  const submit = async () => {
    setError(null);
    if (name.trim().length < 2) {
      setError("Informe o nome da família.");
      return;
    }
    const cleaned = members
      .map((m) => ({
        id: m.id,
        name: m.name.trim(),
        isChild: m.isChild,
        nicknames: parseNicknames(m.nicknamesText),
      }))
      .filter((m) => m.name.length > 0);
    if (cleaned.length === 0) {
      setError("Adicione pelo menos um integrante.");
      return;
    }
    setSubmitting(true);
    try {
      if (isEditing && editingId) {
        const r = await fetch(`/api/admin/families/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), members: cleaned }),
        });
        const data = (await r.json().catch(() => ({}))) as {
          ok?: boolean;
          family?: AdminFamily;
          error?: string;
        };
        if (!r.ok || !data.family)
          throw new Error(data.error ?? "Erro ao salvar alterações");
        const updated = data.family;
        setFamilies((fs) =>
          fs.map((f) => (f.id === editingId ? updated : f)),
        );
      } else {
        const r = await fetch("/api/admin/families", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            members: cleaned.map((m) => ({
              name: m.name,
              isChild: m.isChild,
              nicknames: m.nicknames,
            })),
          }),
        });
        const data = (await r.json().catch(() => ({}))) as {
          ok?: boolean;
          family?: AdminFamily;
          error?: string;
        };
        if (!r.ok || !data.family)
          throw new Error(data.error ?? "Erro ao criar família");
        setFamilies((fs) => [...fs, data.family!]);
      }
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
          onClick={openCreate}
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
                <div className="flex items-center gap-0.5 -mr-1">
                  <button
                    type="button"
                    onClick={() => openEdit(f)}
                    className="p-1.5 text-[var(--color-text-soft)] hover:text-[var(--color-champagne-deep)]"
                    aria-label="Editar família"
                    title="Editar"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(f.id)}
                    className="p-1.5 text-[var(--color-text-soft)] hover:text-red-700"
                    aria-label="Remover família"
                    title="Remover"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </header>
              <ul className="space-y-1.5 mb-3 text-sm">
                {f.members.map((m) => {
                  const attending =
                    f.latestResponse?.attendingGuestIds.includes(m.id);
                  const responded = !!f.latestResponse;
                  return (
                    <li key={m.id} className="text-[var(--color-text)]">
                      <div className="flex items-center gap-2">
                        {responded ? (
                          attending && f.latestResponse?.confirmed ? (
                            <CheckCircle2
                              size={14}
                              className="text-emerald-700 shrink-0"
                            />
                          ) : (
                            <XCircle
                              size={14}
                              className="text-red-700 shrink-0"
                            />
                          )
                        ) : (
                          <Clock
                            size={14}
                            className="text-[var(--color-champagne-light)] shrink-0"
                          />
                        )}
                        <span>{m.name}</span>
                        {m.isChild && (
                          <span className="ml-auto text-[10px] tracking-[0.2em] uppercase text-[var(--color-champagne-light)]">
                            criança
                          </span>
                        )}
                      </div>
                      {m.nicknames.length > 0 && (
                        <p className="ml-6 text-[11px] italic text-[var(--color-text-soft)]">
                          também: {m.nicknames.join(", ")}
                        </p>
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
                  {isEditing ? "Editar Família" : "Nova Família"}
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
                  <div className="space-y-4">
                    {members.map((m, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-[var(--color-border-soft)] bg-white/40 p-2.5 space-y-1.5"
                      >
                        <div className="flex items-center gap-2">
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
                        <input
                          type="text"
                          value={m.nicknamesText}
                          onChange={(e) => {
                            const v = e.target.value;
                            setMembers((cur) =>
                              cur.map((x, idx) =>
                                idx === i ? { ...x, nicknamesText: v } : x,
                              ),
                            );
                          }}
                          placeholder="Apelidos (opcional, separe por vírgula)"
                          className="input-soft text-xs"
                          style={{ fontSize: "12px", padding: "8px 12px" }}
                        />
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
                    ) : isEditing ? (
                      "Salvar alterações"
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
