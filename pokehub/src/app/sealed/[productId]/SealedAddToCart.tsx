"use client";

import { useState } from "react";

import { fmt, I, Icon } from "~/app/_components/editorial/placeholders";
import { useCart } from "~/lib/cart";

export function SealedAddToCart({
  product,
}: {
  product: {
    id: string;
    name: string;
    sealedType: string;
    priceCents: number;
    imageUrl: string | null;
    quantity: number;
  };
}) {
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);

  if (product.quantity === 0) {
    return (
      <div
        style={{
          marginTop: 18,
          padding: 18,
          background: "var(--bg-alt)",
          border: "1px solid var(--line)",
          borderRadius: 6,
          fontSize: 14,
          color: "var(--ink-mute)",
        }}
      >
        Out of stock.
      </div>
    );
  }

  function changeQty(next: number) {
    setQty(Math.max(1, Math.min(product.quantity, next)));
  }

  return (
    <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: "1px solid var(--line)",
          borderRadius: 4,
          background: "var(--paper)",
        }}
      >
        <button
          type="button"
          onClick={() => changeQty(qty - 1)}
          aria-label="Decrease quantity"
          style={{
            padding: "12px 14px",
            background: "transparent",
            border: 0,
            color: "var(--ink)",
            cursor: "pointer",
          }}
        >
          −
        </button>
        <span style={{ padding: "0 14px", fontWeight: 500, fontSize: 15 }}>
          {qty}
        </span>
        <button
          type="button"
          onClick={() => changeQty(qty + 1)}
          aria-label="Increase quantity"
          style={{
            padding: "12px 14px",
            background: "transparent",
            border: 0,
            color: "var(--ink)",
            cursor: "pointer",
          }}
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={() =>
          add({
            productId: product.id,
            name: product.name,
            variant: product.sealedType,
            imageUrl: product.imageUrl,
            priceCents: product.priceCents,
            quantity: qty,
          })
        }
        className="btn"
        style={{ flex: 1, padding: "12px 20px", fontSize: 15 }}
      >
        <Icon d={I.bag} size={15} /> Add to bag ·{" "}
        {fmt(product.priceCents * qty)}
      </button>
    </div>
  );
}
