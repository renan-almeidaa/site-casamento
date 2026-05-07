"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  nome: string;
  valor: number;
  qtd: number;
  isCustomValue?: boolean;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "qtd">) => void;
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
    },
  ),
);
