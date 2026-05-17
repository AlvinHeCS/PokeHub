import Link from "next/link";
import { notFound } from "next/navigation";

import { I, Icon } from "~/app/_components/editorial/placeholders";
import { formatCents } from "~/lib/format";
import { api } from "~/trpc/server";
import { ClearCartOnMount } from "./ClearCartOnMount";
import { PendingPaymentRefresher } from "./PendingPaymentRefresher";

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const { orderNumber } = await params;
  const { email } = await searchParams;

  if (!email) {
    return (
      <div
        style={{
          background: "var(--bg)",
          minHeight: "100vh",
          padding: "60px 32px",
        }}
      >
        <main
          style={{
            maxWidth: 520,
            margin: "0 auto",
            background: "var(--paper)",
            border: "1px solid var(--line)",
            borderRadius: 8,
            padding: 32,
          }}
        >
          <span className="eyebrow">Lookup</span>
          <h1
            className="serif"
            style={{
              fontSize: 34,
              fontWeight: 500,
              letterSpacing: "-0.03em",
              margin: "8px 0 8px",
            }}
          >
            Find your order
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "var(--ink-soft)",
              marginTop: 0,
              marginBottom: 22,
            }}
          >
            Enter the email used at checkout to view order{" "}
            <span
              className="mono"
              style={{ color: "var(--ink)", fontWeight: 500 }}
            >
              {orderNumber}
            </span>
            .
          </p>
          <form style={{ display: "flex", gap: 8 }}>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              style={{
                flex: 1,
                background: "var(--bg)",
                border: "1px solid var(--line)",
                borderRadius: 4,
                padding: "11px 14px",
                fontSize: 14,
                fontFamily: "inherit",
                color: "var(--ink)",
                outline: "none",
              }}
            />
            <button
              type="submit"
              className="btn"
              style={{ padding: "11px 22px" }}
            >
              View order
            </button>
          </form>
        </main>
      </div>
    );
  }

  let order;
  try {
    order = await api.checkout.byNumber({ orderNumber, email });
  } catch {
    notFound();
  }

  const paid = order.status === "PAID" || order.status === "FULFILLED";
  const pending = order.status === "PENDING_PAYMENT";
  const placedAt = new Date(order.createdAt).toLocaleString();
  const ship = order.shippingAddressJson as {
    name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  } | null;

  const timeline = [
    { label: "Placed", date: placedAt, done: true },
    {
      label: "Paid",
      date: paid ? placedAt : pending ? "Awaiting…" : "—",
      done: paid,
      active: pending,
    },
    {
      label: "Packed",
      date: "—",
      done: order.status === "FULFILLED",
      active: paid && order.status !== "FULFILLED",
    },
    { label: "Shipped", date: "—", done: order.status === "FULFILLED" },
  ];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <main
        style={{
          maxWidth: 920,
          margin: "0 auto",
          padding: "60px 32px 56px",
        }}
        className="order-confirm"
      >
        <ClearCartOnMount />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 999,
              background: paid
                ? "var(--positive)"
                : pending
                  ? "var(--accent)"
                  : "var(--bg-alt)",
              color: "#fff",
              display: "grid",
              placeItems: "center",
              flex: "0 0 auto",
            }}
          >
            <Icon
              d={paid ? I.check : pending ? I.refresh : I.bag}
              size={28}
              stroke={2.5}
            />
          </div>
          <div>
            <span
              className="pill"
              style={{
                color: paid
                  ? "var(--positive)"
                  : pending
                    ? "var(--accent-dk)"
                    : "var(--ink-soft)",
                borderColor: paid
                  ? "var(--positive)"
                  : pending
                    ? "var(--accent-dk)"
                    : "var(--line)",
              }}
            >
              {order.status.replace("_", " ")} · {placedAt}
            </span>
            <h1
              className="serif"
              style={{
                fontSize: 44,
                fontWeight: 500,
                letterSpacing: "-0.035em",
                margin: "8px 0 0",
                lineHeight: 1,
              }}
            >
              {paid ? (
                <>
                  Thanks.{" "}
                  <span
                    style={{ fontStyle: "italic", color: "var(--ink-soft)" }}
                  >
                    Your order&apos;s in.
                  </span>
                </>
              ) : pending ? (
                <>Payment processing…</>
              ) : (
                <>Order received</>
              )}
            </h1>
          </div>
        </div>
        <p
          style={{
            fontSize: 15,
            color: "var(--ink-soft)",
            lineHeight: 1.65,
            maxWidth: 640,
          }}
        >
          {paid ? (
            <>
              We&apos;ve received your payment for order{" "}
              <span
                className="mono"
                style={{ color: "var(--ink)", fontWeight: 500 }}
              >
                {order.orderNumber}
              </span>
              . We&apos;ll email you a tracking number as soon as it ships —
              usually within one business day.
            </>
          ) : pending ? (
            <>
              Your payment for order{" "}
              <span
                className="mono"
                style={{ color: "var(--ink)", fontWeight: 500 }}
              >
                {order.orderNumber}
              </span>{" "}
              is being confirmed. This page will refresh on its own once Stripe
              hands off the result.
            </>
          ) : (
            <>
              Order{" "}
              <span
                className="mono"
                style={{ color: "var(--ink)", fontWeight: 500 }}
              >
                {order.orderNumber}
              </span>{" "}
              · status{" "}
              <span style={{ color: "var(--ink)", fontWeight: 500 }}>
                {order.status}
              </span>
              .
            </>
          )}
        </p>

        {pending ? <PendingPaymentRefresher /> : null}

        {/* Timeline */}
        <div
          style={{
            marginTop: 32,
            background: "var(--paper)",
            border: "1px solid var(--line)",
            borderRadius: 8,
            padding: 28,
          }}
        >
          <h3
            className="serif"
            style={{ fontSize: 18, fontWeight: 500, marginTop: 0 }}
          >
            Order timeline
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              marginTop: 20,
            }}
          >
            {timeline.map((s, i, arr) => (
              <div key={s.label}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 999,
                      background: s.done
                        ? "var(--positive)"
                        : s.active
                          ? "var(--accent)"
                          : "var(--bg-alt)",
                      border: s.active
                        ? "2px solid var(--accent)"
                        : "1px solid var(--line)",
                      color: "#fff",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 11,
                      flex: "0 0 auto",
                    }}
                  >
                    {s.done ? <Icon d={I.check} size={12} stroke={3} /> : ""}
                  </span>
                  {i < arr.length - 1 ? (
                    <div
                      style={{
                        flex: 1,
                        height: 2,
                        background: s.done ? "var(--positive)" : "var(--line)",
                      }}
                    />
                  ) : null}
                </div>
                <div
                  className="serif"
                  style={{ fontSize: 14, fontWeight: 500, marginTop: 12 }}
                >
                  {s.label}
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: 11,
                    color: "var(--ink-mute)",
                    marginTop: 2,
                  }}
                >
                  {s.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Items + Summary */}
        <div
          style={{
            marginTop: 28,
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 24,
            alignItems: "flex-start",
          }}
          className="order-grid"
        >
          <div
            style={{
              background: "var(--paper)",
              border: "1px solid var(--line)",
              borderRadius: 8,
              padding: 28,
            }}
          >
            <h3
              className="serif"
              style={{ fontSize: 18, fontWeight: 500, marginTop: 0 }}
            >
              Items
            </h3>
            <div style={{ marginTop: 14 }}>
              {order.items.map((it, i) => {
                const snap = it.productSnapshotJson as {
                  name?: string;
                  condition?: string;
                  grade?: string;
                  gradingCompany?: string;
                  imageUrl?: string | null;
                };
                const variant =
                  snap.condition ??
                  [snap.gradingCompany, snap.grade].filter(Boolean).join(" ") ??
                  "";
                return (
                  <div
                    key={it.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "60px 1fr auto",
                      gap: 16,
                      padding: "14px 0",
                      borderTop: i === 0 ? "0" : "1px solid var(--line-soft)",
                      alignItems: "center",
                    }}
                  >
                    {snap.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={snap.imageUrl}
                        alt=""
                        style={{
                          width: 60,
                          height: 84,
                          objectFit: "contain",
                          background: "var(--bg-alt)",
                          borderRadius: 3,
                          padding: 4,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 60,
                          height: 84,
                          background: "var(--bg-alt)",
                          borderRadius: 3,
                        }}
                      />
                    )}
                    <div>
                      <div
                        className="serif"
                        style={{ fontSize: 16, fontWeight: 500 }}
                      >
                        {snap.name}
                      </div>
                      <div
                        className="mono"
                        style={{
                          fontSize: 11,
                          color: "var(--ink-mute)",
                          marginTop: 4,
                        }}
                      >
                        {variant}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        className="mono"
                        style={{ fontSize: 11, color: "var(--ink-mute)" }}
                      >
                        ×{it.quantity}
                      </div>
                      <div
                        className="serif num"
                        style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}
                      >
                        {formatCents(it.priceAtPurchaseCents * it.quantity)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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
              style={{ fontSize: 16, fontWeight: 500, marginTop: 0 }}
            >
              Summary
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginTop: 14,
                fontSize: 13,
              }}
            >
              <SummaryRow
                label="Subtotal"
                value={formatCents(order.subtotalCents)}
              />
              <SummaryRow
                label="Shipping"
                value={
                  order.shippingCents === 0
                    ? "Free"
                    : formatCents(order.shippingCents)
                }
                positive={order.shippingCents === 0}
              />
              {order.taxCents > 0 ? (
                <SummaryRow label="Tax" value={formatCents(order.taxCents)} />
              ) : null}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 14,
                paddingTop: 14,
                borderTop: "1px solid var(--line-soft)",
                alignItems: "baseline",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 500 }}>Total</span>
              <span
                className="serif num"
                style={{ fontSize: 20, fontWeight: 600 }}
              >
                {formatCents(order.totalCents)}
              </span>
            </div>
            {ship ? (
              <>
                <h4
                  className="serif"
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    marginTop: 22,
                    marginBottom: 6,
                  }}
                >
                  Ship to
                </h4>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--ink-soft)",
                    lineHeight: 1.6,
                  }}
                >
                  {ship.name}
                  <br />
                  {ship.line1}
                  {ship.line2 ? `, ${ship.line2}` : ""}
                  <br />
                  {ship.city}
                  {ship.state ? `, ${ship.state}` : ""} {ship.postalCode}{" "}
                  {ship.country ? `· ${ship.country}` : ""}
                </div>
              </>
            ) : null}
          </aside>
        </div>

        <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
          <Link
            href="/shop"
            className="btn"
            style={{ padding: "12px 22px", textDecoration: "none" }}
          >
            Back to shop
          </Link>
        </div>
      </main>
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
