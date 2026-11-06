"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  PRESENTES,
  VALOR_COTA,
  cotaNome,
  getPresenteDaCota,
  temDonoUnico,
} from "@/data/presentes";

export type CartItem = {
  id: string;
  nome: string;
  valor: number;
  qtd: number;
  isCustomValue?: boolean;
  isCota?: boolean;
  isUnico?: boolean;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "qtd">) => void;
  setItem: (item: Omit<CartItem, "qtd">, qtd: number) => void;
  updateValue: (id: string, valor: number) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  total: () => number;
  count: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, qtd: i.qtd + 1 } : i,
              ),
              isOpen: true,
            };
          }
          return {
            items: [...state.items, { ...item, qtd: 1 }],
            isOpen: true,
          };
        }),
      setItem: (item, qtd) =>
        set((state) => ({
          items: state.items.some((i) => i.id === item.id)
            ? state.items.map((i) => (i.id === item.id ? { ...i, qtd } : i))
            : [...state.items, { ...item, qtd }],
          isOpen: true,
        })),
      updateValue: (id, valor) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, valor: Math.max(0, valor) } : i,
          ),
        })),
      increment: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, qtd: i.qtd + 1 } : i,
          ),
        })),
      decrement: (id) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.id === id ? { ...i, qtd: Math.max(0, i.qtd - 1) } : i,
            )
            .filter((i) => i.qtd > 0),
        })),
      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      total: () => get().items.reduce((sum, i) => sum + i.valor * i.qtd, 0),
      count: () => get().items.reduce((sum, i) => sum + i.qtd, 0),
    }),
    {
      name: "samara-renan-cart",
      partialize: (state) => ({ items: state.items }),
      // O carrinho fica salvo no navegador: ao reabrir, a cota assume o nome e
      // o valor atuais, e os lotes do formato antigo saem do carrinho.
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<CartState>;
        return {
          ...current,
          ...saved,
          items: (saved.items ?? []).flatMap((it) => {
            if (it.id.includes("--lote-")) return [];
            const item = PRESENTES.find((p) => p.id === it.id);
            if (item && temDonoUnico(item)) {
              return [{ ...it, valor: item.valor, qtd: 1, isUnico: true }];
            }
            const presente = getPresenteDaCota(it.id);
            return presente
              ? [{ ...it, nome: cotaNome(presente), valor: VALOR_COTA }]
              : [it];
          }),
        };
      },
    },
  ),
);
