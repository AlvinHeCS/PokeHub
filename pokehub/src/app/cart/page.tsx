"use client";

import Link from "next/link";

import { cartSubtotalCents, useCart } from "~/lib/cart";
import { formatCents } from "~/lib/format";

export default function CartPage() {
  const { lines, setQuantity, remove } = useCart();
  const subtotal = cartSubtotalCents(lines);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Cart</h1>

      {lines.length === 0 ? (
        <div className="text-gray-500">
          Your cart is empty.{" "}
          <Link href="/shop" className="underline">
            Browse the shop
          </Link>
          .
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {lines.map((l) => (
              <li
                key={l.productId}
                className="flex gap-4 rounded border p-4"
              >
                {l.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={l.imageUrl}
                    alt=""
                    className="h-24 w-20 object-contain"
                  />
                ) : (
                  <div className="h-24 w-20 bg-gray-100" />
                )}
                <div className="flex-1">
                  <div className="font-medium">{l.name}</div>
                  <div className="text-sm text-gray-600">{l.variant}</div>
                  <div className="mt-2 flex items-center gap-3">
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
                      className="w-20 rounded border p-1"
                    />
                    <button
                      type="button"
                      onClick={() => remove(l.productId)}
                      className="text-sm text-red-600 underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="font-semibold">
                  {formatCents(l.priceCents * l.quantity)}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <div className="text-lg">
              Subtotal:{" "}
              <span className="font-bold">{formatCents(subtotal)}</span>
            </div>
            <Link
              href="/checkout"
              className="rounded bg-blue-600 px-6 py-3 font-semibold text-white"
            >
              Checkout →
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
