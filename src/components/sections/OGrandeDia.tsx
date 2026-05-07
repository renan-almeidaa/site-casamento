"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Shirt } from "lucide-react";
import { WEDDING } from "@/lib/wedding-data";
import { SectionHeader } from "./SectionHeader";
import { HorizontalDivider } from "@/components/ui/ornament";

const cards = [
  {
    icon: Calendar,
    eyebrow: "Cerimônia",
    title: WEDDING.ceremony.name,
    rows: [
      { label: "Data", value: WEDDING.dateLabel },
      { label: "Horário", value: WEDDING.ceremony.timeLabel },
      { label: "Endereço", value: WEDDING.ceremony.address },
    ],
    cta: { label: "Ver no mapa", href: WEDDING.ceremony.mapUrl },
    pastel: "var(--color-pastel-lavender)",
  },
  {
    icon: MapPin,
    eyebrow: "Recepção",
    title: WEDDING.reception.name,
    rows: [
      { label: "Quando", value: WEDDING.reception.timeLabel },
      { label: "Onde", value: WEDDING.reception.address },
    ],
    cta: { label: "Ver no mapa", href: WEDDING.reception.mapUrl },
    pastel: "var(--color-pastel-mint)",
  },
  {
    icon: Shirt,
    eyebrow: "Traje",
    title: WEDDING.dressCode.label,
    rows: [{ label: "Sugestão", value: WEDDING.dressCode.note }],
    pastel: "var(--color-pastel-rose)",
  },
];

export function OGrandeDia() {
  return (
    <section
      id="o-grande-dia"
      className="relative py-20 md:py-32 px-5 bg-[var(--color-cream-soft)]"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Save the date"
          title="O Grande Dia"
          subtitle="Tudo o que você precisa saber para celebrar com a gente."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.article
                key={c.eyebrow}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="card-soft p-7 md:p-8 flex flex-col relative overflow-hidden"
              >
                <div
                  className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-50 blur-2xl"
                  style={{ background: c.pastel }}
                  aria-hidden
                />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[var(--color-cream)] border border-[var(--color-border-soft)] text-[var(--color-champagne-deep)] mb-4">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <p className="label-uppercase mb-2">{c.eyebrow}</p>
                  <h3 className="font-[var(--font-display)] font-light text-2xl md:text-3xl text-[var(--color-ink)] leading-tight">
                    {c.title}
                  </h3>
                  <HorizontalDivider className="my-4 mx-0" />
                  <ul className="space-y-3">
                    {c.rows.map((r) => (
                      <li key={r.label}>
                        <p className="label-uppercase text-[10px] mb-0.5">
                          {r.label}
                        </p>
                        <p className="text-sm leading-relaxed text-[var(--color-text)]">
                          {r.label === "Horário" ? (
                            <span className="inline-flex items-center gap-1.5">
                              <Clock size={13} className="text-[var(--color-champagne-light)]" />
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
                      className="mt-6 inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[var(--color-champagne-deep)] hover:text-[var(--color-champagne)] transition-colors group"
                    >
                      <MapPin size={13} />
                      <span>{c.cta.label}</span>
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </a>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
