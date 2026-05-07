import { WEDDING } from "@/lib/wedding-data";
import { HorizontalDivider } from "@/components/ui/ornament";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border-soft)] py-10 px-5 text-center bg-[var(--color-cream)]">
      <p className="font-[var(--font-display)] italic text-2xl text-[var(--color-ink)]">
        {WEDDING.coupleName}
      </p>
      <HorizontalDivider className="my-3" />
      <p className="label-uppercase">{WEDDING.dateShort}</p>
      <p className="mt-2 text-sm text-[var(--color-text-soft)]">
        Apucarana – PR · {WEDDING.timeLabel}
      </p>
      <p className="mt-6 text-[10px] tracking-[0.3em] uppercase text-[var(--color-champagne-light)]">
        © 2026 · feito com amor
      </p>
    </footer>
  );
}
