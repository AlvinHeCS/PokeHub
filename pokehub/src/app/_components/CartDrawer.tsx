"use client";

import Link from "next/link";

import { cartSubtotalCents, useCart } from "~/lib/cart";
import { formatCents } from "~/lib/format";

export function CartDrawer() {
  const { drawerOpen, lines, closeDrawer, setQuantity, remove } = useCart();
  const subtotal = cartSubtotalCents(lines);

  if (!drawerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/30"
      onClick={closeDrawer}
    >
      <div
        className="flex h-full w-full max-w-md flex-col bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold">Cart</h2>
          <button
            type="button"
            onClick={closeDrawer}
            className="text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {lines.length === 0 ? (
            <div className="text-gray-500">Your cart is empty.</div>
          ) : (
            <ul className="space-y-4">
              {lines.map((l) => (
                <li key={l.productId} className="flex gap-3">
                  {l.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={l.imageUrl} alt="" className="h-20 w-16 object-contain" />
                  ) : (
                    <div className="h-20 w-16 bg-gray-100" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-medium">{l.name}</div>
                    <div className="text-xs text-gray-600">{l.variant}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        value={l.quantity}
                        onChange={(e) =>
                          setQuantity(
                            l.productId,
                            parseInt(e.target.value, 10) || 1,
                          )
                        }
                        className="w-16 rounded border p-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => remove(l.productId)}
                        className="text-xs text-red-600 underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">
                    {formatCents(l.priceCents * l.quantity)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t p-4">
          <div className="mb-3 flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-bold">{formatCents(subtotal)}</span>
          </div>
          <Link
            href="/checkout"
            onClick={closeDrawer}
            aria-disabled={lines.length === 0}
            className={`block rounded bg-blue-600 px-4 py-3 text-center font-semibold text-white ${
              lines.length === 0 ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
