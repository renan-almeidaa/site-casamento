"use client";

import { useEffect, useRef, useState } from "react";
import { Check, MessageCircle, Search, X, type LucideIcon } from "lucide-react";
import { maskPhone } from "@/lib/utils";
import { WEDDING } from "@/lib/wedding-data";

export type ChaFamily = {
  id: string;
  name: string;
  members: { id: string; name: string; isChild: boolean }[];
};

type Props = {
  family: ChaFamily | null;
  onPickFamily: (f: ChaFamily) => void;
  going: boolean | null;
  onGoing: (v: boolean) => void;
  selected: Set<string>;
  onToggleMember: (id: string) => void;
  whatsapp: string;
  onWhatsapp: (v: string) => void;
};

export function StepQuemVai({
  family,
  onPickFamily,
  going,
  onGoing,
  selected,
  onToggleMember,
  whatsapp,
  onWhatsapp,
}: Props) {
  const [query, setQuery] = useState(family?.name ?? "");
  const [results, setResults] = useState<ChaFamily[]>([]);
  const [searched, setSearched] = useState(false);
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);
  const [answeredNames, setAnsweredNames] = useState<string[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    const q = query.trim();
    if (q.length < 2 || q === family?.name) {
      setResults([]);
      setSearched(false);
      return;
    }
    timer.current = setTimeout(async () => {
      try {
        const r = await fetch(
          `/api/guests/search?for=cha&q=${encodeURIComponent(q)}`,
        );
        if (!r.ok) return;
        const data = (await r.json()) as {
          families: ChaFamily[];
          alreadyAnswered?: boolean;
          answeredNames?: string[];
        };
        setResults(data.families ?? []);
        setAlreadyAnswered(Boolean(data.alreadyAnswered));
        setAnsweredNames(data.answeredNames ?? []);
        setSearched(true);
      } catch {
        // silencioso — o convidado pode tentar de novo
      }
    }, 240);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query, family?.name]);

  return (
    <div className="space-y-4">
      <div className="card-soft p-5 sm:p-6">
        <label htmlFor="cha-busca" className="block text-base font-medium text-[var(--color-ink)] mb-3">
          Digite seu nome
        </label>
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-champagne)]"
          />
          <input
            id="cha-busca"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex.: Maria"
            className="input-soft text-base"
            style={{ paddingLeft: "2.75rem", minHeight: 52 }}
            autoComplete="off"
          />
        </div>

        {results.length > 0 && (
          <div className="mt-2 rounded-2xl border border-[var(--color-border-soft)] bg-white overflow-hidden">
            {results.slice(0, 6).map((f) => (
              <button
                type="button"
                key={f.id}
                onClick={() => {
                  onPickFamily(f);
                  setQuery(f.name);
                  setResults([]);
                }}
                className="w-full text-left px-4 py-3.5 hover:bg-[var(--color-cream-soft)] border-b border-[var(--color-border-soft)] last:border-b-0"
              >
                <span className="block text-[15px] text-[var(--color-ink)]">{f.name}</span>
                <span className="block text-[13px] text-[var(--color-text-soft)] truncate">
                  {f.members.map((m) => m.name).join(", ")}
                </span>
              </button>
            ))}
          </div>
        )}
        {searched && results.length === 0 && !alreadyAnswered && (
          <p className="mt-3 text-[14px] text-[var(--color-text-soft)]">
            Não achamos esse nome 🤔 Tente só o primeiro nome.
          </p>
        )}
        {searched && results.length === 0 && alreadyAnswered && (
          <div className="mt-3 rounded-2xl border border-[var(--color-border-soft)] bg-white p-4 text-center">
            <p className="text-[15px] text-[var(--color-ink)]">
              Sua família já respondeu 💛
            </p>
            <p className="text-[14px] text-[var(--color-text-soft)] mt-1">
              Quer mudar algo? Fale com a gente:
            </p>
            <a
              href={`https://wa.me/${WEDDING.whatsappNumber}?text=${encodeURIComponent(
                `Oi Renan! Sou da ${answeredNames[0] ?? "família"} e quero mudar minha resposta do chá de casa nova 😊`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center justify-center gap-2 min-h-[52px] w-full rounded-full bg-[#25D366] px-5 text-[15px] font-medium text-white hover:brightness-95"
            >
              <MessageCircle size={18} /> Chamar no WhatsApp
            </a>
          </div>
        )}

        {family && (
          <div className="mt-5">
            <p className="text-base font-medium text-[var(--color-ink)] mb-3">
              Vocês vão?
            </p>
            <div className="grid gap-2.5">
              <ChoiceButton
                active={going === true}
                onClick={() => onGoing(true)}
                icon={Check}
                label="Sim, nós vamos!"
              />
              <ChoiceButton
                active={going === false}
                onClick={() => onGoing(false)}
                icon={X}
                label="Não, infelizmente não poderemos ir"
              />
            </div>
          </div>
        )}

        {family && going === true && (
          <div className="mt-5">
            <p className="text-base font-medium text-[var(--color-ink)] mb-1">
              Quem vai?
            </p>
            <p className="text-[14px] text-[var(--color-text-soft)] mb-3">
              Toque no nome de quem vai 😊
            </p>
            <div className="flex flex-col gap-2">
              {family.members.map((m) => {
                const on = selected.has(m.id);
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => onToggleMember(m.id)}
                    aria-pressed={on}
                    className={`min-h-[52px] flex items-center gap-3 px-4 py-3 rounded-2xl border-[1.5px] text-left transition-all ${
                      on
                        ? "border-[var(--color-champagne-deep)] bg-white"
                        : "border-[var(--color-border-soft)] bg-[var(--color-cream-soft)]"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-md border-[1.5px] flex items-center justify-center shrink-0 ${
                        on
                          ? "bg-[var(--color-champagne-deep)] border-[var(--color-champagne-deep)]"
                          : "border-[#d4c0a8] bg-white"
                      }`}
                      aria-hidden
                    >
                      {on && <Check size={14} strokeWidth={3} className="text-white" />}
                    </span>
                    <span className="text-[15px] text-[var(--color-text)]">{m.name}</span>
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

      {family && going !== null && (
        <div className="card-soft p-5 sm:p-6">
          <label htmlFor="cha-whats" className="block text-base font-medium text-[var(--color-ink)] mb-3">
            Seu WhatsApp
          </label>
          <input
            id="cha-whats"
            type="tel"
            inputMode="tel"
            value={whatsapp}
            onChange={(e) => onWhatsapp(maskPhone(e.target.value))}
            placeholder="(43) 9 9999-9999"
            className="input-soft text-base"
            style={{ minHeight: 52 }}
          />
        </div>
      )}
    </div>
  );
}

function ChoiceButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-[60px] flex items-center gap-3 px-5 py-3.5 rounded-2xl border-[1.5px] text-left transition-all active:scale-[0.98] ${
        active
          ? "border-[var(--color-champagne-darker)] bg-[var(--color-champagne-darker)] text-[var(--color-cream)]"
          : "border-[var(--color-border-soft)] bg-white text-[var(--color-ink)] hover:border-[var(--color-champagne)]"
      }`}
    >
      <span
        className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${
          active
            ? "border-[var(--color-cream)]/40 text-[var(--color-cream)]"
            : "border-[var(--color-border-soft)] text-[var(--color-champagne-deep)]"
        }`}
        aria-hidden
      >
        <Icon size={16} strokeWidth={2} />
      </span>
      <span className="text-[16px] font-medium">{label}</span>
    </button>
  );
}
