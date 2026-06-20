"use client";

import { motion } from "framer-motion";
import { Ornament, HorizontalDivider } from "@/components/ui/ornament";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: Props) {
  const isCenter = align === "center";
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: 0.12, delayChildren: 0.05 },
        },
      }}
      className={`max-w-3xl ${isCenter ? "mx-auto text-center" : "text-left"}`}
    >
      <motion.p
        variants={{
          hidden: { opacity: 0, y: 12 },
          show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
        }}
        className="label-uppercase mb-5"
      >
        {eyebrow}
      </motion.p>

      <motion.div
        variants={{
          hidden: { opacity: 0, scaleX: 0 },
          show: {
            opacity: 1,
            scaleX: 1,
            transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] },
          },
        }}
        className={`mb-7 ${isCenter ? "" : "origin-left"}`}
        style={{ transformOrigin: isCenter ? "center" : "left" }}
      >
        {isCenter ? (
          <Ornament width={50} />
        ) : (
          <HorizontalDivider width={48} />
        )}
      </motion.div>

      <motion.h2
        variants={{
          hidden: { opacity: 0, y: 18 },
          show: { opacity: 1, y: 0, transition: { duration: 0.85 } },
        }}
        className="heading-hairline text-[clamp(2.4rem,6.5vw,4.8rem)]"
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
          }}
          className={`italic-romance text-lg sm:text-xl leading-[1.55] mt-7 ${
            isCenter ? "mx-auto max-w-xl" : "max-w-xl"
          }`}
          style={{ color: "var(--color-text-soft)" }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
