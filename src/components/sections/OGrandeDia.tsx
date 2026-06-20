"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Shirt } from "lucide-react";
import { WEDDING } from "@/lib/wedding-data";
import { SectionHeader } from "./SectionHeader";

const cards = [
  {
    icon: Calendar,
    eyebrow: "Cerimônia",
    number: "I",
    title: WEDDING.ceremony.name,
    rows: [
      { label: "Data", value: WEDDING.dateLabel },
      { label: "Horário", value: WEDDING.ceremony.timeLabel },
      { label: "Endereço", value: WEDDING.ceremony.address },
    ],
    cta: { label: "Ver no mapa", href: WEDDING.ceremony.mapUrl },
  },
  {
    icon: MapPin,
    eyebrow: "Recepção",
    number: "II",
    title: WEDDING.reception.name,
    rows: [
      { label: "Quando", value: WEDDING.reception.timeLabel },
      { label: "Onde", value: WEDDING.reception.address },
    ],
    cta: { label: "Ver no mapa", href: WEDDING.reception.mapUrl },
  },
  {
    icon: Shirt,
    eyebrow: "Traje",
    number: "III",
    title: WEDDING.dressCode.label,
    rows: [{ label: "Sugestão", value: WEDDING.dressCode.note }],
  },
];

export function OGrandeDia() {
  return (
    <section
      id="o-grande-dia"
      className="relative py-24 md:py-36 px-5 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--color-cream) 0%, var(--color-cream-soft) 50%, var(--color-cream) 100%)",
      }}
    >
      {/* Faixa horizontal champagne sutil, decorativa */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px opacity-30"
        style={{ background: "var(--color-champagne-deep)" }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-px opacity-30"
        style={{ background: "var(--color-champagne-deep)" }}
      />

      <div className="relative max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Save the date"
          title="O Grande Dia"
          subtitle="Tudo o que você precisa saber para celebrar com a gente."
        />

        <div className="mt-20 md:mt-24 grid gap-7 md:grid-cols-3">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.article
                key={c.eyebrow}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.1,
                  ease: [0.2, 0.8, 0.2, 1],
                }}
                className="card-envelope p-8 md:p-9 flex flex-col relative group"
              >
                {/* Número romano em escala grande no canto superior direito */}
                <span
                  aria-hidden
                  className="absolute top-5 right-6 font-[var(--font-display)] font-extralight text-[2.5rem] leading-none opacity-15 select-none"
                  style={{ color: "var(--color-champagne-deep)" }}
                >
                  {c.number}
                </span>

                <div
                  className="inline-flex items-center justify-center w-10 h-10 mb-5 text-[var(--color-champagne-deep)]"
                  style={{
                    border: "1px solid var(--color-champagne-deep)",
                    borderRadius: "999px",
                  }}
                >
                  <Icon size={17} strokeWidth={1.4} />
                </div>

                <p className="label-uppercase mb-3">{c.eyebrow}</p>
                <h3
                  className="font-[var(--font-display)] font-light text-2xl md:text-[1.75rem] leading-[1.1] tracking-[-0.02em]"
                  style={{ color: "var(--color-ink)" }}
                >
                  {c.title}
                </h3>

                <div
                  aria-hidden
                  className="my-6 h-px w-10"
                  style={{ background: "var(--color-champagne-deep)" }}
                />

                <ul className="space-y-4">
                  {c.rows.map((r) => (
                    <li key={r.label}>
                      <p className="label-uppercase-soft mb-1">{r.label}</p>
                      <p className="text-[15px] leading-relaxed text-[var(--color-text)]">
                        {r.label === "Horário" ? (
                          <span className="inline-flex items-center gap-2">
                            <Clock
                              size={13}
                              className="text-[var(--color-champagne-deep)]"
                            />
                            {r.value}
                          </span>
                        ) : (
                          r.value
                        )}
                      </p>
                    </li>
                  ))}
                </ul>

                {c.cta && (
                  <a
                    href={c.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center gap-3 text-[10px] tracking-[0.4em] uppercase font-medium text-[var(--color-champagne-darker)] hover:text-[var(--color-champagne-deep)] transition-colors group/cta self-start"
                  >
                    <span>{c.cta.label}</span>
                    <span
                      className="inline-block w-6 h-px transition-transform group-hover/cta:w-10"
                      style={{ background: "currentColor" }}
                      aria-hidden
                    />
                  </a>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
