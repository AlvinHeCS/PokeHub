"use client";

import { useState } from "react";

import { fmt, I, Icon } from "~/app/_components/editorial/placeholders";
import { useCart } from "~/lib/cart";

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
  if (v.type === "RAW") return v.condition ?? "Raw";
  if (v.type === "GRADED") {
    const parts: string[] = [];
    if (v.gradingCompany) parts.push(v.gradingCompany);
    if (v.grade) parts.push(v.grade);
    return parts.join(" ") || "Graded";
  }
  return v.type;
}

function variantSub(v: Variant): string {
  if (v.type === "RAW") return `${v.condition ?? ""} · ${v.quantity} in stock`;
  if (v.type === "GRADED")
    return v.certNumber ? `Cert ${v.certNumber}` : "Graded";
  return `${v.quantity} in stock`;
}

const FILTERS = ["All", "Raw", "Graded"] as const;
type Filter = (typeof FILTERS)[number];

export function CardVariantPicker({
  card,
  variants,
}: {
  card: { name: string; imageUrl: string | null };
  variants: Variant[];
}) {
  const [filter, setFilter] = useState<Filter>("All");
  const [selected, setSelected] = useState<string>(variants[0]?.id ?? "");
  const add = useCart((s) => s.add);

  const filtered = variants.filter((v) => {
    if (filter === "All") return true;
    if (filter === "Raw") return v.type === "RAW";
    return v.type === "GRADED";
  });
  const selectedVariant =
    filtered.find((v) => v.id === selected) ?? filtered[0];

  return (
    <div>
      <div
        style={{
          marginTop: 28,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <h2
          className="serif"
          style={{ fontSize: 22, fontWeight: 500, margin: 0 }}
        >
          Choose a variant
        </h2>
        <div
          style={{
            display: "flex",
            background: "var(--bg-alt)",
            borderRadius: 6,
            padding: 3,
            fontSize: 12,
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              style={{
                padding: "5px 12px",
                borderRadius: 4,
                background: filter === f ? "var(--paper)" : "transparent",
                fontWeight: filter === f ? 500 : 400,
                color: filter === f ? "var(--ink)" : "var(--ink-soft)",
                boxShadow: filter === f ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
                cursor: "pointer",
                border: 0,
                fontFamily: "inherit",
                fontSize: 12,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <div
          style={{
            marginTop: 14,
            padding: 20,
            border: "1px dashed var(--line)",
            borderRadius: 6,
            color: "var(--ink-mute)",
            fontSize: 13,
          }}
        >
          No {filter.toLowerCase()} variants in stock right now.
        </div>
      ) : (
        <div
          style={{
            marginTop: 14,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {filtered.map((v) => {
            const isSelected = v.id === selectedVariant?.id;
            return (
              <label
                key={v.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: 14,
                  padding: "14px 16px",
                  alignItems: "center",
                  border: `1px solid ${isSelected ? "var(--ink)" : "var(--line)"}`,
                  background: isSelected ? "var(--paper)" : "transparent",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="variant"
                  value={v.id}
                  checked={isSelected}
                  onChange={() => setSelected(v.id)}
                  style={{ display: "none" }}
                />
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 999,
                    border: `1.5px solid ${isSelected ? "var(--ink)" : "var(--line)"}`,
                    background: isSelected ? "var(--ink)" : "transparent",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {isSelected ? (
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        background: "var(--bg)",
                        borderRadius: 999,
                      }}
                    />
                  ) : null}
                </span>
                <div>
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <span
                      className="serif"
                      style={{ fontSize: 16, fontWeight: 500 }}
                    >
                      {variantLabel(v)}
                    </span>
                    {v.type === "GRADED" && v.certNumber ? (
                      <span
                        className="mono"
                        style={{
                          fontSize: 10,
                          color: "var(--accent)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        Verify cert <Icon d={I.external} size={9} />
                      </span>
                    ) : null}
                  </div>
                  <div
                    className="mono"
                    style={{
                      fontSize: 11,
                      color: "var(--ink-mute)",
                      marginTop: 2,
                    }}
                  >
                    {variantSub(v)}
                  </div>
                </div>
                <div
                  className="serif num"
                  style={{ fontSize: 20, fontWeight: 600 }}
                >
                  {fmt(v.priceCents)}
                </div>
              </label>
            );
          })}
        </div>
      )}

      <button
        type="button"
        disabled={!selectedVariant}
        onClick={() => {
          const v = selectedVariant;
          if (!v) return;
          add({
            productId: v.id,
            name: card.name,
            variant: variantLabel(v),
            imageUrl: v.imageUrl ?? card.imageUrl,
            priceCents: v.priceCents,
          });
        }}
        className="btn"
        style={{
          marginTop: 18,
          width: "100%",
          padding: "14px 18px",
          fontSize: 15,
          opacity: selectedVariant ? 1 : 0.5,
        }}
      >
        <Icon d={I.bag} size={15} /> Add to bag
        {selectedVariant ? ` · ${fmt(selectedVariant.priceCents)}` : ""}
      </button>
    </div>
  );
}
