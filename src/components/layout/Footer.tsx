import { WEDDING } from "@/lib/wedding-data";
import { Ornament } from "@/components/ui/ornament";

export function Footer() {
  return (
    <footer
      className="relative py-16 px-5 text-center overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--color-cream) 0%, var(--color-cream-deep) 100%)",
        borderTop: "1px solid var(--color-border-soft)",
      }}
    >
      {/* Linha fina champagne no topo, simulando dourado */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px opacity-50"
        style={{ background: "var(--color-champagne-deep)" }}
      />

      <div className="max-w-md mx-auto">
        <p
          className="font-[var(--font-display)] font-extralight text-3xl tracking-[-0.02em]"
          style={{ color: "var(--color-ink)" }}
        >
          Samara <span className="italic-romance text-[var(--color-champagne-deep)]">&amp;</span> Renan
        </p>

        <div className="mt-5 mb-5">
          <Ornament width={40} />
        </div>

        <p
          className="text-[10px] tracking-[0.5em] uppercase font-medium"
          style={{ color: "var(--color-champagne-deep)" }}
        >
          {WEDDING.dateShort}
        </p>

        <p className="mt-3 text-sm text-[var(--color-text-soft)]">
          Apucarana, PR · {WEDDING.timeLabel}
        </p>

        <p
          className="mt-10 text-[9px] tracking-[0.4em] uppercase"
          style={{ color: "var(--color-champagne-light)" }}
        >
          © 2026 · feito com amor
        </p>
      </div>
    </footer>
  );
}
