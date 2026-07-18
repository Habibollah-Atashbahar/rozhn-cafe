"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartLine, CartLineOption } from "@/types";

type AddLineInput = {
  itemId: string;
  name: string;
  unitPrice: number;
  selectedOptions: CartLineOption[];
  note?: string;
};

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  addLine: (input: AddLineInput) => void;
  incrementLine: (lineId: string) => void;
  decrementLine: (lineId: string) => void;
  removeLine: (lineId: string) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalAmount: () => number;
  totalCount: () => number;
};

function buildLineKey(itemId: string, options: CartLineOption[]) {
  return `${itemId}::${options
    .map((o) => o.choiceLabel)
    .sort()
    .join("|")}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,

      addLine: (input) => {
        const key = buildLineKey(input.itemId, input.selectedOptions);
        set((state) => {
          const existing = state.lines.find(
            (l) =>
              buildLineKey(l.itemId, l.selectedOptions) === key &&
              l.note === input.note
          );
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.lineId === existing.lineId
                  ? { ...l, quantity: l.quantity + 1 }
                  : l
              ),
            };
          }
          const newLine: CartLine = {
            lineId: `${key}::${Date.now()}`,
            itemId: input.itemId,
            name: input.name,
            unitPrice: input.unitPrice,
            quantity: 1,
            selectedOptions: input.selectedOptions,
            note: input.note,
          };
          return { lines: [...state.lines, newLine] };
        });
      },

      incrementLine: (lineId) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            l.lineId === lineId ? { ...l, quantity: l.quantity + 1 } : l
          ),
        })),

      decrementLine: (lineId) =>
        set((state) => ({
          lines: state.lines
            .map((l) =>
              l.lineId === lineId ? { ...l, quantity: l.quantity - 1 } : l
            )
            .filter((l) => l.quantity > 0),
        })),

      removeLine: (lineId) =>
        set((state) => ({
          lines: state.lines.filter((l) => l.lineId !== lineId),
        })),

      clear: () => set({ lines: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      totalAmount: () => {
        const lineTotal = (l: CartLine) =>
          (l.unitPrice +
            l.selectedOptions.reduce((s, o) => s + o.priceDelta, 0)) *
          l.quantity;
        return get().lines.reduce((sum, l) => sum + lineTotal(l), 0);
      },

      totalCount: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
    }),
    {
      name: "rozhn-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines }),
      skipHydration: true,
    }
  )
);
