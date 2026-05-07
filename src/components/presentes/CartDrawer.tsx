"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatBRL } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, close, increment, decrement, remove, total, count } =
    useCartStore();

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[110] bg-[rgba(46,34,24,0.45)]"
          onClick={close}
        >
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-[var(--color-cream)] shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between p-5 border-b border-[var(--color-border-soft)] bg-[var(--color-champagne-darker)] text-[var(--color-cream)]">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} />
                <h3 className="font-[var(--font-display)] text-xl">
                  Meu Carrinho
                </h3>
                <span className="text-xs tracking-[0.2em] uppercase opacity-80">
                  {count()} {count() === 1 ? "item" : "itens"}
                </span>
              </div>
              <button
                type="button"
                aria-label="Fechar carrinho"
                onClick={close}
                className="p-1 hover:opacity-80"
              >
                <X size={20} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-[var(--color-text-soft)] py-20">
                  <ShoppingBag size={42} strokeWidth={1.2} className="mb-4 opacity-40" />
                  <p className="font-[var(--font-display)] italic text-lg">
                    Seu carrinho está vazio
                  </p>
                  <p className="text-xs mt-1">
                    Escolha um presente para começar.
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {items.map((it) => (
                    <li
                      key={it.id}
                      className="card-soft p-4 flex items-center gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-[var(--font-display)] text-lg text-[var(--color-ink)] leading-tight truncate">
                          {it.nome}
                        </p>
                        <p className="text-sm text-[var(--color-champagne-deep)] mt-0.5">
                          {formatBRL(it.valor)}
                          {it.isCustomValue && (
                            <span className="ml-1 text-[10px] tracking-[0.2em] uppercase text-[var(--color-champagne-light)]">
                              valor livre
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          aria-label="Diminuir"
                          onClick={() => decrement(it.id)}
                          className="w-7 h-7 rounded-full border border-[var(--color-border-soft)] flex items-center justify-center text-[var(--color-champagne-deep)] hover:bg-[var(--color-cream-soft)]"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-6 text-center text-sm tabular-nums">
                          {it.qtd}
                        </span>
                        <button
                          type="button"
                          aria-label="Aumentar"
                          onClick={() => increment(it.id)}
                          className="w-7 h-7 rounded-full border border-[var(--color-border-soft)] flex items-center justify-center text-[var(--color-champagne-deep)] hover:bg-[var(--color-cream-soft)]"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <button
                        type="button"
                        aria-label="Remover"
                        onClick={() => remove(it.id)}
                        className="p-1.5 text-[var(--color-text-soft)] hover:text-red-700"
                      >
                        <Trash2 size={15} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <footer className="border-t border-[var(--color-border-soft)] p-5 bg-[var(--color-cream-soft)]">
              <div className="flex items-baseline justify-between mb-4">
                <span className="label-uppercase">Total</span>
                <span
                  className="font-[var(--font-display)] text-3xl"
                  style={{ color: "var(--color-champagne-deep)" }}
                >
                  {formatBRL(total())}
                </span>
              </div>
              <Link
                href="/presentes/resumo"
                onClick={close}
                className={`btn-cta w-full ${items.length === 0 ? "pointer-events-none opacity-40" : ""}`}
                aria-disabled={items.length === 0}
              >
                Finalizar Presente
              </Link>
              <button
                type="button"
                onClick={close}
                className="block w-full mt-2 py-3 text-[11px] tracking-[0.25em] uppercase text-[var(--color-text-soft)] hover:text-[var(--color-champagne-deep)] text-center"
              >
                Escolher mais itens
              </button>
            </footer>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
