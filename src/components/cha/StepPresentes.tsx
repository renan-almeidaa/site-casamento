"use client";

import { Check, HandCoins } from "lucide-react";
import { CHA_COMODOS, CHA_ITENS } from "@/data/cha-itens";
import { ItemCard } from "@/components/cha/ItemCard";
import { PixInfo } from "@/components/cha/PixInfo";
import { COMODO_ICONS } from "@/components/cha/comodo-icons";

type Props = {
  chosen: Set<string>;
  onToggle: (id: string) => void;
  taken: Set<string>;
  givesPix: boolean;
  onTogglePix: () => void;
};

const itemsOf = (comodoId: string, grupo: string) =>
  CHA_ITENS.filter((i) => i.comodoId === comodoId && i.grupo === grupo);

export function StepPresentes({ chosen, onToggle, taken, givesPix, onTogglePix }: Props) {
  const goTo = (id: string) =>
    document.getElementById(`comodo-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="space-y-6">
      {/* Pix em destaque — pode ser combinado com itens */}
      <div
        className={`rounded-3xl border-[1.5px] p-5 sm:p-6 transition-colors ${
          givesPix
            ? "border-[var(--color-champagne-deep)] bg-white"
            : "border-[var(--color-border-soft)] bg-[var(--color-cream-soft)]"
        }`}
      >
        <button
          type="button"
          onClick={onTogglePix}
          aria-pressed={givesPix}
          className="w-full flex items-center gap-3 text-left"
        >
          <span
            className="w-11 h-11 rounded-full border border-[var(--color-border-soft)] bg-white flex items-center justify-center shrink-0 text-[var(--color-champagne-deep)]"
            aria-hidden
          >
            <HandCoins size={20} strokeWidth={1.5} />
          </span>
          <span className="flex-1">
            <span className="block text-base font-medium text-[var(--color-ink)]">
              Prefiro mandar via Pix ou cartão
            </span>
            <span className="block text-[14px] text-[var(--color-text-soft)]">
              Qualquer valor, sem comprovante
            </span>
          </span>
          <span
            className={`w-7 h-7 rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${
              givesPix
                ? "bg-[var(--color-champagne-deep)] border-[var(--color-champagne-deep)]"
                : "border-[#d4c0a8] bg-white"
            }`}
            aria-hidden
          >
            {givesPix && <Check size={15} strokeWidth={3} className="text-white" />}
          </span>
        </button>
        {givesPix && (
          <div className="mt-5">
            <PixInfo />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 text-[var(--color-text-soft)]">
        <span className="flex-1 h-px bg-[var(--color-border-soft)]" />
        <span className="text-[13px]">ou escolha itens para a casa</span>
        <span className="flex-1 h-px bg-[var(--color-border-soft)]" />
      </div>

      {/* Atalhos por cômodo */}
      <div className="sticky top-0 z-30 -mx-5 px-5 py-2.5 bg-[var(--color-cream)]/95 backdrop-blur border-b border-[var(--color-border-soft)]">
        <div className="flex flex-wrap justify-center gap-2">
          {CHA_COMODOS.map((c) => {
            const Icon = COMODO_ICONS[c.id]!;
            return (
            <button
              key={c.id}
              type="button"
              onClick={() => goTo(c.id)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-soft)] bg-white px-3.5 py-2 text-[13px] text-[var(--color-text)] hover:border-[var(--color-champagne)]"
            >
              <Icon size={14} strokeWidth={1.6} className="text-[var(--color-champagne-deep)]" aria-hidden />
              {c.short}
            </button>
            );
          })}
        </div>
      </div>

      {CHA_COMODOS.map((c) => {
        const Icon = COMODO_ICONS[c.id]!;
        return (
        <section key={c.id} id={`comodo-${c.id}`} className="scroll-mt-32">
          <h3 className="heading-display text-2xl mb-4 flex items-center gap-3">
            <span
              className="w-10 h-10 rounded-full border border-[var(--color-border-soft)] bg-white flex items-center justify-center text-[var(--color-champagne-deep)]"
              aria-hidden
            >
              <Icon size={18} strokeWidth={1.5} />
            </span>
            {c.label}
          </h3>
          <div className="space-y-5">
            {c.grupos.map((g) => (
              <div key={g.label}>
                <p className="label-uppercase mb-2.5">{g.label}</p>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {itemsOf(c.id, g.label).map((it) => (
                    <ItemCard
                      key={it.id}
                      id={it.id}
                      nome={it.nome}
                      selected={chosen.has(it.id)}
                      taken={taken.has(it.id)}
                      onToggle={() => onToggle(it.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        );
      })}
    </div>
  );
}
