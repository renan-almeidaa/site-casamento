"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

// Frases do balãozinho dos itens já escolhidos. A escolha é determinística
// pelo id (evita mismatch de hidratação e cada item tem "sua" frase).
const TAKEN_PHRASES = [
  "Opa, alguém foi mais rápido! 🏃‍♀️",
  "Esse já tem dono 💛",
  "Já tá a caminho da casa nova 🏡",
  "Alguém chegou primeiro! Escolhe outro? 😉",
  "Esse já tá garantido ✨",
];

function phraseFor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return TAKEN_PHRASES[h % TAKEN_PHRASES.length]!;
}

type Props = {
  id: string;
  nome: string;
  selected: boolean;
  taken: boolean;
  onToggle: () => void;
};

export function ItemCard({ id, nome, selected, taken, onToggle }: Props) {
  // No celular não existe hover: tocar no item riscado mostra o balão.
  const [tapped, setTapped] = useState(false);
  useEffect(() => {
    if (!tapped) return;
    const t = setTimeout(() => setTapped(false), 2600);
    return () => clearTimeout(t);
  }, [tapped]);

  if (taken) {
    return (
      <div className="relative group">
        <button
          type="button"
          aria-disabled="true"
          aria-label={`${nome} — já escolhido por outra pessoa`}
          onClick={() => setTapped(true)}
          className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 rounded-2xl border border-dashed border-[var(--color-border-soft)] bg-[var(--color-cream-deep)]/40 text-left cursor-not-allowed"
        >
          <span className="text-lg shrink-0 grayscale opacity-70" aria-hidden>
            🎁
          </span>
          <span className="text-[15px] text-[var(--color-text-soft)]/70 line-through decoration-[var(--color-champagne-deep)] decoration-2">
            {nome}
          </span>
        </button>
        {/* Hover no desktop, toque no celular/tablet */}
        <div
          className={`pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 ${
            tapped ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
          }`}
        >
          <Bubble text={phraseFor(id)} />
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`w-full min-h-[56px] flex items-center gap-3 px-4 py-3 rounded-2xl border-[1.5px] text-left transition-all active:scale-[0.98] ${
        selected
          ? "border-[var(--color-champagne-deep)] bg-white shadow-[0_8px_24px_-14px_rgba(60,40,20,0.45)]"
          : "border-[var(--color-border-soft)] bg-[var(--color-cream-soft)] hover:border-[var(--color-champagne)] hover:bg-white"
      }`}
    >
      <span
        className={`w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-colors ${
          selected
            ? "bg-[var(--color-champagne-deep)] border-[var(--color-champagne-deep)]"
            : "border-[#d4c0a8] bg-white"
        }`}
        aria-hidden
      >
        {selected && <Check size={14} strokeWidth={3} className="text-white" />}
      </span>
      <span
        className={`text-[15px] ${
          selected ? "text-[var(--color-ink)] font-medium" : "text-[var(--color-text)]"
        }`}
      >
        {nome}
      </span>
    </button>
  );
}

function Bubble({ text }: { text: string }) {
  return (
    <div
      role="tooltip"
      className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-20 w-max max-w-[min(260px,85vw)] text-center rounded-2xl bg-[var(--color-champagne-darker)] px-4 py-2 text-[13px] text-[var(--color-cream)] shadow-lg"
    >
      {text}
      <span
        className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-[var(--color-champagne-darker)]"
        aria-hidden
      />
    </div>
  );
}
