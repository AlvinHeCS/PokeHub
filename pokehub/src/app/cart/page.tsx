"use client";

import Link from "next/link";

import { I, Icon } from "~/app/_components/editorial/placeholders";
import { cartSubtotalCents, shippingCents, useCart } from "~/lib/cart";
import { formatCents } from "~/lib/format";

export default function CartPage() {
  const { lines, setQuantity, remove } = useCart();
  const subtotal = cartSubtotalCents(lines);
  const shipping = shippingCents(subtotal);
  const total = subtotal + shipping;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: 1040,
          margin: "0 auto",
          padding: "36px 32px 56px",
        }}
        className="cart-page"
      >
        <span className="eyebrow">Your bag</span>
        <h1
          className="serif"
          style={{
            fontSize: 44,
            fontWeight: 500,
            letterSpacing: "-0.035em",
            margin: "8px 0 24px",
          }}
        >
          {lines.length === 0
            ? "Empty for now."
            : `${lines.length} ${lines.length === 1 ? "item" : "items"} in your bag`}
        </h1>

        {lines.length === 0 ? (
          <div
            style={{
              padding: 40,
              background: "var(--paper)",
              border: "1px solid var(--line)",
              borderRadius: 8,
              fontSize: 14,
              color: "var(--ink-soft)",
            }}
          >
            Your bag is empty.{" "}
            <Link
              href="/shop"
              style={{
                color: "var(--accent)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Browse the shop
            </Link>
            .
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 380px",
              gap: 32,
              alignItems: "flex-start",
            }}
            className="cart-grid"
          >
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
              {lines.map((l, i) => (
                <li
                  key={l.productId}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "92px 1fr auto",
                    gap: 18,
                    padding: 18,
                    background: "var(--paper)",
                    border: "1px solid var(--line)",
                    borderRadius: 8,
                    alignItems: "center",
                  }}
                >
                  {l.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={l.imageUrl}
                      alt=""
                      style={{
                        width: 92,
                        height: 128,
                        objectFit: "contain",
                        background: "var(--bg-alt)",
                        borderRadius: 4,
                        padding: 6,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 92,
                        height: 128,
                        background: "var(--bg-alt)",
                        borderRadius: 4,
                      }}
                    />
                  )}
                  <div>
                    <div
                      className="serif"
                      style={{
                        fontSize: 17,
                        fontWeight: 500,
                        lineHeight: 1.2,
                      }}
                    >
                      {l.name}
                    </div>
                    <div
                      className="mono"
                      style={{
                        fontSize: 11,
                        color: "var(--ink-mute)",
                        marginTop: 4,
                      }}
                    >
                      {l.variant}
                    </div>
                    <div
                      style={{
                        marginTop: 14,
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid var(--line)",
                          borderRadius: 4,
                          background: "var(--bg)",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(l.productId, l.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                          style={{
                            padding: "4px 12px",
                            background: "transparent",
                            border: 0,
                            color: "var(--ink-soft)",
                            cursor: "pointer",
                            fontSize: 14,
                          }}
                        >
                          −
                        </button>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            padding: "0 8px",
                            minWidth: 22,
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
                            padding: "4px 12px",
                            background: "transparent",
                            border: 0,
                            color: "var(--ink-soft)",
                            cursor: "pointer",
                            fontSize: 14,
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
                          fontSize: 12,
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
                    style={{ fontSize: 18, fontWeight: 600 }}
                  >
                    {formatCents(l.priceCents * l.quantity)}
                  </div>
                  {/* explicit i for ts unused-suppression */}
                  <span style={{ display: "none" }}>{i}</span>
                </li>
              ))}
            </ul>

            <aside
              style={{
                background: "var(--paper)",
                border: "1px solid var(--line)",
                borderRadius: 8,
                padding: 24,
                position: "sticky",
                top: 16,
              }}
            >
              <h3
                className="serif"
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  marginTop: 0,
                  marginBottom: 14,
                }}
              >
                Summary
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  paddingBottom: 14,
                  borderBottom: "1px solid var(--line-soft)",
                  fontSize: 13,
                }}
              >
                <SummaryRow label="Subtotal" value={formatCents(subtotal)} />
                <SummaryRow
                  label="Shipping (tracked + insured)"
                  value={shipping === 0 ? "Free" : formatCents(shipping)}
                  positive={shipping === 0}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: 14,
                  alignItems: "baseline",
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 500 }}>Total</span>
                <span
                  className="serif num"
                  style={{
                    fontSize: 26,
                    fontWeight: 600,
                    letterSpacing: "-0.025em",
                  }}
                >
                  {formatCents(total)}
                </span>
              </div>
              <Link
                href="/checkout"
                className="btn"
                style={{
                  display: "flex",
                  width: "100%",
                  marginTop: 18,
                  padding: "14px 18px",
                  fontSize: 15,
                  textDecoration: "none",
                }}
              >
                Checkout securely <Icon d={I.arrowR} size={15} />
              </Link>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 16,
                  marginTop: 14,
                  fontSize: 11,
                  color: "var(--ink-mute)",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Icon d={I.shield} size={11} /> Stripe-secured
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Icon d={I.truck} size={11} /> Tracked & insured
                </span>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: "var(--ink-soft)" }}>{label}</span>
      <span
        className="mono num"
        style={{
          fontWeight: 500,
          color: positive ? "var(--positive)" : "var(--ink)",
        }}
      >
        {value}
      </span>
    </div>
  );
}
