"use client";

import Link from "next/link";

import { I, Icon } from "~/app/_components/editorial/placeholders";
import { cartSubtotalCents, useCart } from "~/lib/cart";
import { formatCents } from "~/lib/format";

export function CartDrawer() {
  const { drawerOpen, lines, closeDrawer, setQuantity, remove } = useCart();
  const subtotal = cartSubtotalCents(lines);

  if (!drawerOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "flex-end",
        background: "rgba(26, 24, 20, 0.35)",
      }}
      onClick={closeDrawer}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          maxWidth: 440,
          background: "var(--paper)",
          borderLeft: "1px solid var(--line)",
          boxShadow: "-12px 0 30px rgba(0,0,0,0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 22px",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <h2
            className="serif"
            style={{
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: "-0.025em",
              margin: 0,
            }}
          >
            Your bag
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart"
            style={{
              background: "transparent",
              border: 0,
              color: "var(--ink-soft)",
              padding: 4,
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
            }}
          >
            <Icon d={I.x} size={18} />
          </button>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "18px 22px" }}>
          {lines.length === 0 ? (
            <div style={{ color: "var(--ink-mute)", fontSize: 14 }}>
              Your bag is empty.
            </div>
          ) : (
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {lines.map((l) => (
                <li
                  key={l.productId}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "64px 1fr auto",
                    gap: 14,
                    padding: 14,
                    background: "var(--bg-alt)",
                    border: "1px solid var(--line-soft)",
                    borderRadius: 6,
                    alignItems: "center",
                  }}
                >
                  {l.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={l.imageUrl}
                      alt=""
                      style={{
                        width: 64,
                        height: 88,
                        objectFit: "contain",
                        borderRadius: 4,
                        background: "var(--paper)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 64,
                        height: 88,
                        background: "var(--paper)",
                        borderRadius: 4,
                      }}
                    />
                  )}
                  <div>
                    <div
                      className="serif"
                      style={{ fontSize: 14, fontWeight: 500 }}
                    >
                      {l.name}
                    </div>
                    <div
                      className="mono"
                      style={{
                        fontSize: 10,
                        color: "var(--ink-mute)",
                        marginTop: 2,
                      }}
                    >
                      {l.variant}
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
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
                          onClick={() =>
                            setQuantity(l.productId, l.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                          style={{
                            padding: "2px 10px",
                            border: 0,
                            background: "transparent",
                            color: "var(--ink-soft)",
                          }}
                        >
                          −
                        </button>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 500,
                            padding: "0 6px",
                            minWidth: 18,
                            textAlign: "center",
                          }}
                        >
                          {l.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(l.productId, l.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          style={{
                            padding: "2px 10px",
                            border: 0,
                            background: "transparent",
                            color: "var(--ink-soft)",
                          }}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(l.productId)}
                        style={{
                          background: "transparent",
                          border: 0,
                          color: "var(--danger)",
                          fontSize: 11,
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div
                    className="serif num"
                    style={{ fontSize: 14, fontWeight: 600 }}
                  >
                    {formatCents(l.priceCents * l.quantity)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div
          style={{
            borderTop: "1px solid var(--line)",
            padding: "18px 22px 22px",
            background: "var(--paper)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 500 }}>Subtotal</span>
            <span
              className="serif num"
              style={{ fontSize: 22, fontWeight: 600 }}
            >
              {formatCents(subtotal)}
            </span>
          </div>
          <Link
            href="/checkout"
            onClick={closeDrawer}
            aria-disabled={lines.length === 0}
            className="btn"
            style={{
              display: "flex",
              width: "100%",
              padding: "14px 18px",
              fontSize: 15,
              textDecoration: "none",
              opacity: lines.length === 0 ? 0.5 : 1,
              pointerEvents: lines.length === 0 ? "none" : "auto",
            }}
          >
            Checkout securely →
          </Link>
        </div>
      </div>
    </div>
  );
}
