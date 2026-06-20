"use client";

import { useEffect, useState } from "react";
import { WEDDING } from "@/lib/wedding-data";

function diff(target: Date) {
  const now = new Date();
  const ms = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const seconds = Math.floor((ms / 1000) % 60);
  return { days, hours, minutes, seconds };
}

const ZERO = { days: 0, hours: 0, minutes: 0, seconds: 0 };

type CountdownProps = {
  variant?: "card" | "inline";
  tone?: "light" | "dark";
};

export function Countdown({
  variant = "inline",
  tone = "light",
}: CountdownProps) {
  const [d, setD] = useState(ZERO);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setD(diff(WEDDING.date));
    const id = setInterval(() => setD(diff(WEDDING.date)), 1000);
    return () => clearInterval(id);
  }, []);

  const items = [
    { v: d.days, l: "Dias" },
    { v: d.hours, l: "Horas" },
    { v: d.minutes, l: "Minutos" },
    { v: d.seconds, l: "Segundos" },
  ];

  const numberColor =
    tone === "light" ? "rgba(255,255,255,0.96)" : "var(--color-ink)";
  const labelColor =
    tone === "light" ? "rgba(255,255,255,0.7)" : "var(--color-champagne-light)";
  const dividerColor =
    tone === "light" ? "rgba(255,255,255,0.25)" : "var(--color-border-soft)";

  if (variant === "card") {
    return (
      <div className="flex justify-center gap-2 sm:gap-3 flex-wrap" suppressHydrationWarning>
        {items.map((it) => (
          <div
            key={it.l}
            className="flex flex-col items-center min-w-[72px] sm:min-w-[92px] bg-[var(--color-cream-soft)] backdrop-blur px-4 py-3.5 sm:px-5 sm:py-4 border border-[var(--color-border-soft)]"
            style={{ borderRadius: "2px" }}
          >
            <span
              className="font-[var(--font-display)] text-3xl sm:text-4xl font-extralight leading-none tabular-nums tracking-[-0.04em]"
              style={{ color: "var(--color-ink)" }}
              suppressHydrationWarning
            >
              {mounted ? String(it.v).padStart(2, "0") : "··"}
            </span>
            <span className="mt-2 text-[9px] tracking-[0.32em] uppercase text-[var(--color-champagne-deep)] font-medium">
              {it.l}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="flex items-stretch justify-center gap-3 sm:gap-7"
      suppressHydrationWarning
    >
      {items.map((it, i) => (
        <div key={it.l} className="flex items-stretch">
          <div className="flex flex-col items-center min-w-[60px] sm:min-w-[88px] px-2">
            <span
              className="font-[var(--font-display)] text-4xl sm:text-6xl font-extralight leading-none tabular-nums tracking-[-0.04em]"
              style={{
                color: numberColor,
                textShadow:
                  tone === "light" ? "0 1px 12px rgba(0,0,0,0.25)" : undefined,
              }}
              suppressHydrationWarning
            >
              {mounted ? String(it.v).padStart(2, "0") : "··"}
            </span>
            <span
              className="mt-3 sm:mt-4 text-[9px] sm:text-[10px] tracking-[0.42em] uppercase font-medium"
              style={{ color: labelColor }}
            >
              {it.l}
            </span>
          </div>
          {i < items.length - 1 && (
            <div
              className="w-px self-stretch mx-0 sm:mx-1"
              style={{ background: dividerColor }}
              aria-hidden
            />
          )}
        </div>
      ))}
    </div>
  );
}
