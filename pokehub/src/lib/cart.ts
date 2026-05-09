"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  productId: string;
  // Snapshot for display only — re-priced at /checkout against DB
  name: string;
  variant: string; // e.g. "NM", "PSA 10", or sealed type
  imageUrl: string | null;
  priceCents: number;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  drawerOpen: boolean;

  add: (line: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
  setQuantity: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      drawerOpen: false,

      add: (line) =>
        set((state) => {
          const existing = state.lines.find(
            (l) => l.productId === line.productId,
          );
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.productId === line.productId
                  ? { ...l, quantity: l.quantity + (line.quantity ?? 1) }
                  : l,
              ),
              drawerOpen: true,
            };
          }
          return {
            lines: [...state.lines, { ...line, quantity: line.quantity ?? 1 }],
            drawerOpen: true,
          };
        }),

      setQuantity: (productId, qty) =>
        set((state) => ({
          lines:
            qty <= 0
              ? state.lines.filter((l) => l.productId !== productId)
              : state.lines.map((l) =>
                  l.productId === productId ? { ...l, quantity: qty } : l,
                ),
        })),

      remove: (productId) =>
        set((state) => ({
          lines: state.lines.filter((l) => l.productId !== productId),
        })),

      clear: () => set({ lines: [] }),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
    }),
    { name: "pokehub-cart" },
  ),
);

export function cartSubtotalCents(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.priceCents * l.quantity, 0);
}

export function shippingCents(subtotalCents: number): number {
  if (subtotalCents === 0) return 0;
  if (subtotalCents >= 5000) return 0;
  return 500;
}
