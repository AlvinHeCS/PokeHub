"use client";

import { useState } from "react";

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
    return <div className="mt-6 text-gray-500">Out of stock.</div>;
  }

  return (
    <div className="mt-6 flex items-center gap-3">
      <input
        type="number"
        min={1}
        max={product.quantity}
        value={qty}
        onChange={(e) =>
          setQty(Math.max(1, Math.min(product.quantity, parseInt(e.target.value, 10) || 1)))
        }
        className="w-20 rounded border p-2"
      />
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
        className="flex-1 rounded bg-blue-600 px-4 py-3 font-semibold text-white"
      >
        Add to cart
      </button>
    </div>
  );
}
