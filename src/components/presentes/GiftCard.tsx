"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Plus, Sparkles } from "lucide-react";
import type { Presente } from "@/data/presentes";
import { useCartStore } from "@/lib/cart-store";
import { formatBRL } from "@/lib/utils";
import { PresenteIcon } from "./PresenteIcon";

const pastelMap = {
  rose: "var(--color-pastel-rose)",
  salmon: "var(--color-pastel-salmon)",
  lavender: "var(--color-pastel-lavender)",
  mint: "var(--color-pastel-mint)",
  sky: "var(--color-pastel-sky)",
  yellow: "var(--color-pastel-yellow)",
} as const;

export function GiftCard({ presente }: { presente: Presente }) {
  const addItem = useCartStore((s) => s.addItem);
  const inCart = useCartStore((s) =>
    s.items.find((i) => i.id === presente.id),
  );
  const [customOpen, setCustomOpen] = useState(false);
  const [customValue, setCustomValue] = useState("100");

  const isCustom = presente.valor === 0;
  const isInCart = !!inCart;

  const handleCardClick = () => {
    if (customOpen) return;
    if (isCustom) {
      setCustomOpen(true);
      return;
    }
    addItem({ id: presente.id, nome: presente.nome, valor: presente.valor });
  };

  const confirmCustom = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = Number(customValue.replace(",", "."));
    if (!Number.isFinite(v) || v <= 0) return;
    addItem({
      id: presente.id,
      nome: presente.nome,
      valor: v,
      isCustomValue: true,
    });
    setCustomOpen(false);
    setCustomValue("100");
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`Adicionar ${presente.nome} ao carrinho`}
      className="card-soft overflow-hidden flex flex-col h-full relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-champagne)] focus:ring-offset-2"
    >
      {presente.destaque && (
        <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-[var(--color-champagne-deep)] text-white px-3 py-1 text-[10px] tracking-[0.2em] uppercase">
          <Sparkles size={11} /> Especial
        </span>
      )}

      <div
        className="relative aspect-[4/3] overflow-hidden"
        style={
          presente.imagem
            ? undefined
            : {
                background: `linear-gradient(135deg, ${pastelMap[presente.pastel]} 0%, var(--color-cream-soft) 100%)`,
              }
        }
      >
        {presente.imagem ? (
          <Image
            src={presente.imagem}
            alt={presente.nome}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <>
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.6)_0%,_transparent_70%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <PresenteIcon
                type={presente.icon}
                className="w-20 h-20 text-[var(--color-champagne-deep)]"
              />
            </div>
          </>
        )}
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <h3 className="font-[var(--font-display)] font-light text-xl text-[var(--color-ink)] leading-tight">
          {presente.nome}
        </h3>
        {presente.descricao && (
          <p className="text-xs text-[var(--color-text-soft)] mt-1.5 italic leading-relaxed">
            {presente.descricao}
          </p>
        )}
        <div className="mt-3 flex-1 flex items-end">
          <span
            className="font-[var(--font-display)] text-xl"
            style={{ color: "var(--color-champagne-deep)" }}
          >
            {isCustom ? "Qualquer valor" : formatBRL(presente.valor)}
          </span>
        </div>
        <div
          className={`mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-full py-2.5 px-4 text-[11px] tracking-[0.25em] uppercase font-medium transition-colors ${
            isInCart
              ? "bg-[var(--color-pastel-yellow)] text-[var(--color-ink)]"
              : "bg-[var(--color-champagne-darker)] text-white group-hover:bg-[var(--color-champagne-deep)]"
          }`}
        >
          {isInCart ? (
            <>
              <Check size={14} /> Adicionado
              {inCart && inCart.qtd > 1 ? ` · ${inCart.qtd}` : ""}
            </>
          ) : (
            <>
              <Plus size={14} /> Adicionar
            </>
          )}
        </div>
      </div>

      {customOpen && (
        <div
          className="absolute inset-0 bg-[rgba(46,34,24,0.55)] backdrop-blur-sm flex items-center justify-center p-4 z-20"
          onClick={(e) => {
            e.stopPropagation();
            setCustomOpen(false);
          }}
        >
          <div
            className="card-soft p-5 w-full max-w-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="label-uppercase mb-2">Quanto você quer presentear?</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-[var(--font-display)] text-2xl text-[var(--color-champagne-deep)]">
                R$
              </span>
              <input
                type="number"
                inputMode="decimal"
                step="10"
                min="1"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="input-soft text-lg font-medium"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="flex gap-2 mb-3">
              {[50, 100, 200, 500].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCustomValue(String(v));
                  }}
                  className="flex-1 rounded-full border border-[var(--color-border-soft)] py-1.5 text-xs text-[var(--color-text-soft)] hover:bg-[var(--color-cream-soft)]"
                >
                  R${v}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCustomOpen(false);
                }}
                className="flex-1 rounded-full border border-[var(--color-border-soft)] py-2 text-[11px] tracking-[0.25em] uppercase text-[var(--color-text-soft)]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmCustom}
                className="flex-1 rounded-full bg-[var(--color-champagne-darker)] text-white py-2 text-[11px] tracking-[0.25em] uppercase font-medium"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
