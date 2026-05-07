"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useEffect, useState } from "react";

export function CartFab() {
  const { count, isOpen, open } = useCartStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const c = count();
  return (
    <AnimatePresence>
      {!isOpen && c > 0 && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          onClick={open}
          aria-label={`Abrir carrinho com ${c} item(ns)`}
          className="fixed bottom-5 right-5 z-[90] w-14 h-14 rounded-2xl bg-[var(--color-champagne-darker)] text-[var(--color-cream)] flex items-center justify-center shadow-[0_8px_24px_rgba(46,34,24,0.35)] hover:scale-105 transition-transform"
        >
          <ShoppingBag size={20} />
          <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] rounded-full bg-[var(--color-champagne)] text-[var(--color-champagne-darker)] text-[11px] font-medium flex items-center justify-center px-1.5 shadow">
            {c}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
