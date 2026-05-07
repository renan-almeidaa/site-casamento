"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Search, Check, Loader2 } from "lucide-react";
import { WEDDING } from "@/lib/wedding-data";
import { maskPhone } from "@/lib/utils";
import { Ornament, HorizontalDivider } from "@/components/ui/ornament";

type GuestSearchMember = { id: string; name: string; isChild: boolean };
type GuestSearchFamily = {
  id: string;
  name: string;
  members: GuestSearchMember[];
};
type SearchResp = { families: GuestSearchFamily[] };

type RsvpModalProps = {
  open: boolean;
  onClose: () => void;
};

export function RsvpModal({ open, onClose }: RsvpModalProps) {
  const [step, setStep] = useState<
    "form" | "submitting" | "success"
  >("form");
  const [confirmacao, setConfirmacao] = useState<"sim" | "nao" | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GuestSearchFamily[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [family, setFamily] = useState<GuestSearchFamily | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      // reset on close
      const t = setTimeout(() => {
        setStep("form");
        setConfirmacao(null);
        setQuery("");
        setResults([]);
        setShowResults(false);
        setFamily(null);
        setSelected(new Set());
        setPhone("");
        setEmail("");
        setComment("");
        setError(null);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    searchTimer.current = setTimeout(async () => {
      try {
        const r = await fetch(
          `/api/guests/search?q=${encodeURIComponent(query.trim())}`,
        );
        if (!r.ok) return;
        const data: SearchResp = await r.json();
        setResults(data.families ?? []);
        setShowResults(true);
      } catch {
        // silencioso
      }
    }, 240);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [query]);

  const pickFamily = (f: GuestSearchFamily) => {
    setFamily(f);
    setSelected(new Set(f.members.map((m) => m.id)));
    setQuery(f.name);
    setShowResults(false);
  };

  const toggleMember = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const submit = async () => {
    setError(null);
    if (!confirmacao) {
      setError("Selecione se você irá ao casamento.");
      return;
    }
    if (!family) {
      setError("Pesquise e selecione seu nome na lista.");
      return;
    }
    if (selected.size === 0) {
      setError("Selecione pelo menos uma pessoa.");
      return;
    }
    if (!phone.trim() || !email.trim()) {
      setError("Telefone e e-mail são obrigatórios.");
      return;
    }

    setStep("submitting");
    try {
      const r = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          familyId: family.id,
          confirmed: confirmacao === "sim",
          attendingGuestIds: Array.from(selected),
          phone,
          email,
          comment,
        }),
      });
      if (!r.ok) {
        const data = (await r.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Erro ao enviar resposta");
      }
      setStep("success");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Erro ao enviar resposta",
      );
      setStep("form");
    }
  };

  const isYes = confirmacao === "sim";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] bg-[rgba(46,34,24,0.55)] backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-5"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 60, opacity: 0.85 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[var(--color-cream)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="absolute top-4 right-4 p-2 text-[var(--color-champagne-deep)] hover:text-[var(--color-champagne-darker)] z-10"
            >
              <X size={20} />
            </button>

            {step === "success" ? (
              <SuccessPanel isYes={isYes} onClose={onClose} />
            ) : (
              <div className="p-6 sm:p-8">
                <header className="text-center mb-6">
                  <Ornament className="mb-3" />
                  <p className="label-uppercase">Confirmação de Presença</p>
                  <h2 className="heading-display text-3xl mt-2">
                    Nosso Grande Dia
                  </h2>
                  <p className="font-[var(--font-display)] italic text-[var(--color-champagne-deep)] mt-1">
                    {WEDDING.coupleName}
                  </p>
                  <HorizontalDivider className="my-4" />
                  <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-champagne-light)]">
                    {WEDDING.dateShort} · {WEDDING.timeLabel}
                  </p>
                </header>

                <div className="space-y-4">
                  <div className="card-soft p-5">
                    <p className="text-sm font-medium text-[var(--color-ink)] mb-3">
                      Você irá ao casamento?{" "}
                      <span className="text-[var(--color-champagne)]">*</span>
                    </p>
                    <div className="flex flex-col gap-2.5">
                      <RadioOption
                        label="Sim, estarei lá! 🎉"
                        checked={confirmacao === "sim"}
                        onChange={() => setConfirmacao("sim")}
                      />
                      <RadioOption
                        label="Infelizmente não poderei ir"
                        checked={confirmacao === "nao"}
                        onChange={() => setConfirmacao("nao")}
                      />
                    </div>
                  </div>

                  <div className="card-soft p-5">
                    <p className="text-sm font-medium text-[var(--color-ink)] mb-3">
                      Pesquise seu nome na lista{" "}
                      <span className="text-[var(--color-champagne)]">*</span>
                    </p>
                    <div className="relative">
                      <Search
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-champagne)]"
                      />
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => results.length > 0 && setShowResults(true)}
                        placeholder="Digite seu nome..."
                        className="input-soft"
                        style={{ paddingLeft: "2.5rem" }}
                        autoComplete="off"
                      />
                      {showResults && results.length > 0 && (
                        <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-xl border border-[var(--color-border-soft)] bg-white shadow-md overflow-hidden">
                          {results.slice(0, 6).map((f) => (
                            <button
                              type="button"
                              key={f.id}
                              onClick={() => pickFamily(f)}
                              className="w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--color-cream-soft)] border-b border-[var(--color-border-soft)] last:border-b-0"
                            >
                              <span className="text-[var(--color-text)]">
                                {f.name}
                              </span>
                              <span className="block text-xs text-[var(--color-text-soft)] truncate">
                                {f.members.map((m) => m.name).join(", ")}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {family && (
                      <div className="mt-4">
                        <p className="label-uppercase mb-2">
                          {isYes
                            ? "Quem vai ao casamento?"
                            : "Quem não poderá ir?"}
                        </p>
                        <div className="flex flex-col gap-2">
                          {family.members.map((m) => {
                            const isSel = selected.has(m.id);
                            return (
                              <button
                                type="button"
                                key={m.id}
                                onClick={() => toggleMember(m.id)}
                                className={`flex items-center gap-3 p-2.5 rounded-xl border-[1.5px] transition-all text-left ${
                                  isSel
                                    ? "border-[var(--color-champagne-light)] bg-[var(--color-cream-soft)]"
                                    : "border-[var(--color-border-soft)] bg-[var(--color-cream-soft)]"
                                }`}
                              >
                                <div
                                  className={`w-5 h-5 rounded-md border-[1.5px] flex items-center justify-center flex-shrink-0 ${
                                    isSel
                                      ? "bg-[var(--color-champagne-light)] border-[var(--color-champagne-light)]"
                                      : "border-[#d4c0a8]"
                                  }`}
                                >
                                  {isSel && (
                                    <Check
                                      size={12}
                                      strokeWidth={3}
                                      className="text-white"
                                    />
                                  )}
                                </div>
                                <span className="text-sm text-[var(--color-text)]">
                                  {m.name}
                                </span>
                                {m.isChild && (
                                  <span className="ml-auto text-[10px] tracking-[0.2em] uppercase text-[var(--color-champagne-light)]">
                                    Criança
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="card-soft p-5 grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-[var(--color-ink)] mb-2">
                        Telefone <span className="text-[var(--color-champagne)]">*</span>
                      </p>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(maskPhone(e.target.value))}
                        placeholder="(44) 99999-9999"
                        className="input-soft"
                        inputMode="tel"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-ink)] mb-2">
                        E-mail <span className="text-[var(--color-champagne)]">*</span>
                      </p>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="input-soft"
                      />
                    </div>
                  </div>

                  <div className="card-soft p-5">
                    <p className="text-sm font-medium text-[var(--color-ink)] mb-2">
                      Algum comentário?{" "}
                      <span className="text-xs font-normal text-[var(--color-text-soft)]">
                        (opcional)
                      </span>
                    </p>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={
                        isYes
                          ? "Mensagem, restrição alimentar ou observação..."
                          : "Deixe uma mensagem para os noivos..."
                      }
                      className="input-soft min-h-[80px] resize-none"
                    />
                  </div>

                  {error && (
                    <p className="text-center text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg py-2 px-3">
                      {error}
                    </p>
                  )}

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      disabled={step === "submitting"}
                      onClick={submit}
                      className="btn-cta"
                    >
                      {step === "submitting" ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Enviando...
                        </>
                      ) : isYes ? (
                        "Confirmar Presença"
                      ) : (
                        "Enviar Resposta"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RadioOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <span
        className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-colors ${
          checked
            ? "border-[var(--color-champagne-light)]"
            : "border-[#d4c0a8]"
        }`}
      >
        {checked && (
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-champagne-light)]" />
        )}
      </span>
      <input
        type="radio"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <span className="text-sm text-[var(--color-text)]">{label}</span>
    </label>
  );
}

function SuccessPanel({
  isYes,
  onClose,
}: {
  isYes: boolean;
  onClose: () => void;
}) {
  return (
    <div className="text-center px-6 py-12 sm:py-16">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="text-5xl mb-4"
      >
        {isYes ? "💍" : "🙏"}
      </motion.div>
      <h2 className="heading-display text-3xl mb-3">
        {isYes ? "Presença Confirmada!" : "Resposta Registrada!"}
      </h2>
      <p className="text-[var(--color-text-soft)] leading-relaxed">
        {isYes
          ? "Obrigado por responder! Estamos muito felizes em saber que você estará com a gente. Até o grande dia! 🌸"
          : "Agradecemos por nos avisar. Sentiremos muito a sua falta, mas estaremos juntos em espírito! 💛"}
      </p>
      <button
        type="button"
        onClick={onClose}
        className="btn-cta mt-8"
      >
        Fechar
      </button>
    </div>
  );
}
