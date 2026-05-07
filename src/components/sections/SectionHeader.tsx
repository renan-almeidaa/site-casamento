"use client";

import { motion } from "framer-motion";
import { Ornament, HorizontalDivider } from "@/components/ui/ornament";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

export function SectionHeader({ eyebrow, title, subtitle }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
      className="text-center max-w-2xl mx-auto"
    >
      <p className="label-uppercase mb-4">{eyebrow}</p>
      <Ornament className="mb-4" />
      <h2 className="heading-display text-4xl sm:text-5xl md:text-6xl">
        {title}
      </h2>
      <HorizontalDivider className="my-5" />
      {subtitle && (
        <p
          className="font-[var(--font-display)] italic text-lg leading-relaxed"
          style={{ color: "var(--color-text-soft)" }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
