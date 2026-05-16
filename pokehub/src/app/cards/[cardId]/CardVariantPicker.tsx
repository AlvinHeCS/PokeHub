"use client";

import { useState } from "react";

import { useCart } from "~/lib/cart";
import { formatCents } from "~/lib/format";

interface Variant {
  id: string;
  type: "RAW" | "GRADED" | "SEALED";
  priceCents: number;
  quantity: number;
  condition: string | null;
  gradingCompany: string | null;
  grade: string | null;
  certNumber: string | null;
  imageUrl: string | null;
}

function variantLabel(v: Variant): string {
  if (v.type === "RAW") return `Raw · ${v.condition}`;
  if (v.type === "GRADED")
    return `${v.gradingCompany} ${v.grade} (${v.certNumber})`;
  return v.type;
}

export function CardVariantPicker({
  card,
  variants,
}: {
  card: { name: string; imageUrl: string | null };
  variants: Variant[];
}) {
  const [selected, setSelected] = useState<string>(variants[0]?.id ?? "");
  const add = useCart((s) => s.add);
  const v = variants.find((x) => x.id === selected);

  return (
    <div>
      <ul className="space-y-2">
        {variants.map((variant) => (
          <li key={variant.id}>
            <label
              className={`flex cursor-pointer items-center gap-3 rounded border p-3 ${
                selected === variant.id ? "border-blue-600 bg-blue-50" : ""
              }`}
            >
              <input
                type="radio"
                name="variant"
                value={variant.id}
                checked={selected === variant.id}
                onChange={() => setSelected(variant.id)}
              />
              <div className="flex-1">
                <div className="font-medium">{variantLabel(variant)}</div>
                <div className="text-xs text-gray-600">
                  {variant.quantity} in stock
                </div>
              </div>
              <div className="font-bold">{formatCents(variant.priceCents)}</div>
            </label>
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled={!v}
        onClick={() => {
          if (!v) return;
          add({
            productId: v.id,
            name: card.name,
            variant: variantLabel(v),
            imageUrl: v.imageUrl ?? card.imageUrl,
            priceCents: v.priceCents,
          });
        }}
        className="mt-4 w-full rounded bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
      >
        Add to cart
      </button>
    </div>
  );
}
