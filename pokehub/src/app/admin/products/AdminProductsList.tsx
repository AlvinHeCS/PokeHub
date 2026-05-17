"use client";

import { useState } from "react";

import { fmt, I, Icon } from "~/app/_components/editorial/placeholders";
import { api } from "~/trpc/react";

type Type = "ALL" | "RAW" | "GRADED" | "SEALED";

const TABS: Type[] = ["ALL", "RAW", "GRADED", "SEALED"];
const TAB_LABEL: Record<Type, string> = {
  ALL: "All",
  RAW: "Raw",
  GRADED: "Graded",
  SEALED: "Sealed",
};

export function AdminProductsList() {
  const [type, setType] = useState<Type>("ALL");
  const list = api.product.adminList.useQuery({
    type: type === "ALL" ? undefined : type,
    limit: 100,
  });

  const utils = api.useUtils();
  const update = api.product.update.useMutation({
    onSuccess: () => utils.product.adminList.invalidate(),
  });
  const delist = api.product.delist.useMutation({
    onSuccess: () => utils.product.adminList.invalidate(),
  });

  const items = list.data?.items ?? [];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 16,
        }}
      >
        <div>
          <h1
            className="serif"
            style={{
              fontSize: 32,
              fontWeight: 500,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Products
          </h1>
          <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 4 }}>
            {items.length} in current view
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a
            href="/admin/products/new/raw"
            className="btn ghost"
            style={{
              padding: "9px 16px",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            + New product
          </a>
        </div>
      </div>

      <div
        style={{
          marginTop: 24,
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            background: "var(--paper)",
            border: "1px solid var(--line)",
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          {TABS.map((t, i) => {
            const active = type === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                style={{
                  padding: "9px 16px",
                  fontSize: 13,
                  background: active ? "var(--bg-alt)" : "transparent",
                  color: active ? "var(--ink)" : "var(--ink-soft)",
                  fontWeight: active ? 500 : 400,
                  border: 0,
                  borderRight:
                    i < TABS.length - 1 ? "1px solid var(--line)" : 0,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {TAB_LABEL[t]}
              </button>
            );
          })}
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--paper)",
            border: "1px solid var(--line)",
            borderRadius: 6,
            padding: "9px 12px",
            maxWidth: 320,
            color: "var(--ink-mute)",
          }}
        >
          <Icon d={I.search} size={14} />
          <span style={{ fontSize: 13 }}>Search product, card, cert…</span>
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          background: "var(--paper)",
          border: "1px solid var(--line)",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 13,
          }}
        >
          <thead>
            <tr style={{ background: "var(--bg-alt)" }}>
              {[
                "Type",
                "Product",
                "Variant",
                "Price",
                "Qty",
                "Updated",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="eyebrow"
                  style={{
                    fontSize: 10,
                    padding: "12px 14px",
                    textAlign: "left",
                    fontWeight: 600,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.isLoading ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    padding: 32,
                    textAlign: "center",
                    color: "var(--ink-mute)",
                    fontSize: 13,
                  }}
                >
                  Loading…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    padding: 40,
                    textAlign: "center",
                    color: "var(--ink-mute)",
                    fontSize: 13,
                  }}
                >
                  No products in this view. Use the sidebar quick-list to add
                  one.
                </td>
              </tr>
            ) : (
              items.map((p) => {
                const displayName = p.card?.name ?? p.name ?? "—";
                const variant =
                  p.type === "RAW"
                    ? (p.condition ?? "Raw")
                    : p.type === "GRADED"
                      ? `${p.gradingCompany ?? ""} ${p.grade?.toString() ?? ""}`.trim()
                      : (p.sealedType ?? "");
                return (
                  <tr
                    key={p.id}
                    style={{ borderTop: "1px solid var(--line-soft)" }}
                  >
                    <td style={{ padding: "12px 14px" }}>
                      <span className="pill" style={{ fontSize: 10 }}>
                        {p.type}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        {p.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.imageUrl}
                            alt=""
                            style={{
                              width: 32,
                              height: 44,
                              objectFit: "contain",
                              background: "var(--bg-alt)",
                              borderRadius: 3,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 32,
                              height: 44,
                              background: "var(--bg-alt)",
                              borderRadius: 3,
                            }}
                          />
                        )}
                        <div>
                          <div
                            className="serif"
                            style={{ fontSize: 14, fontWeight: 500 }}
                          >
                            {displayName}
                          </div>
                          {p.card ? (
                            <div
                              className="mono"
                              style={{
                                fontSize: 10,
                                color: "var(--ink-mute)",
                              }}
                            >
                              {p.card.set.name} · #{p.card.number}
                            </div>
                          ) : (
                            <div
                              className="mono"
                              style={{
                                fontSize: 10,
                                color: "var(--ink-mute)",
                              }}
                            >
                              {p.sealedType ?? ""}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        color: "var(--ink-soft)",
                      }}
                    >
                      {variant || "—"}
                    </td>
                    <td
                      className="mono num"
                      style={{ padding: "12px 14px", fontWeight: 500 }}
                    >
                      {fmt(p.priceCents)}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <input
                        type="number"
                        min={0}
                        defaultValue={p.quantity}
                        onBlur={(e) => {
                          const newQty = parseInt(e.target.value, 10);
                          if (!Number.isNaN(newQty) && newQty !== p.quantity) {
                            update.mutate({ id: p.id, quantity: newQty });
                          }
                        }}
                        style={{
                          width: 64,
                          background: "var(--bg)",
                          border: "1px solid var(--line)",
                          borderRadius: 4,
                          padding: "5px 8px",
                          fontFamily: "var(--mono)",
                          fontSize: 12,
                          textAlign: "center",
                          color: "var(--ink)",
                          outline: "none",
                        }}
                      />
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        color: "var(--ink-mute)",
                      }}
                    >
                      {relativeTime(p.updatedAt ?? p.createdAt)}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Delist this product?")) {
                            delist.mutate({ id: p.id });
                          }
                        }}
                        style={{
                          background: "transparent",
                          border: 0,
                          color: "var(--danger)",
                          fontSize: 12,
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        Delist
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function relativeTime(d: Date | string): string {
  const ms = Date.now() - new Date(d).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  const days = Math.floor(hr / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(d).toLocaleDateString();
}
