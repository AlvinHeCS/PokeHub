"use client";

import { use, useState } from "react";

import {
  adminInputStyle,
  SubmitErrorRow,
} from "~/app/_components/editorial/AdminFormPrimitives";
import { formatCents } from "~/lib/format";
import { api } from "~/trpc/react";

interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export function AdminOrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const utils = api.useUtils();
  const order = api.order.adminGet.useQuery({ id });
  const [tracking, setTracking] = useState("");
  const ship = api.order.adminMarkShipped.useMutation({
    onSuccess: () => {
      void utils.order.adminGet.invalidate({ id });
      void utils.order.adminList.invalidate();
    },
  });

  if (order.isLoading || !order.data) {
    return (
      <div
        style={{
          padding: 32,
          textAlign: "center",
          color: "var(--ink-mute)",
          fontSize: 13,
        }}
      >
        Loading…
      </div>
    );
  }
  const o = order.data;
  const addr = o.shippingAddressJson as unknown as ShippingAddress;
  const placedAt = new Date(o.createdAt).toLocaleString();

  return (
    <div style={{ maxWidth: 920 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        <div>
          {o.totalCents >= 100000 ? (
            <span
              className="pill"
              style={{
                background: "var(--accent)",
                color: "var(--ink-accent)",
                border: 0,
              }}
            >
              HIGH-VALUE
            </span>
          ) : null}
          <h1
            className="serif"
            style={{
              fontSize: 32,
              fontWeight: 500,
              letterSpacing: "-0.03em",
              marginTop: 8,
              marginBottom: 0,
            }}
          >
            Order <span className="mono">{o.orderNumber}</span>
          </h1>
          <div
            style={{
              fontSize: 13,
              color: "var(--ink-soft)",
              marginTop: 4,
            }}
          >
            Placed {placedAt} · {o.email}
          </div>
        </div>
        <StatusBadge status={o.status} />
      </div>

      <div
        style={{
          marginTop: 28,
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 18,
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            background: "var(--paper)",
            border: "1px solid var(--line)",
            borderRadius: 8,
            padding: 24,
          }}
        >
          <h3
            className="serif"
            style={{ fontSize: 16, fontWeight: 500, marginTop: 0 }}
          >
            Items ({o.items.length})
          </h3>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {o.items.map((it) => {
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
                    gap: 14,
                    padding: 14,
                    background: "var(--bg-alt)",
                    border: "1px solid var(--line-soft)",
                    borderRadius: 6,
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
                        background: "var(--paper)",
                        borderRadius: 3,
                        padding: 4,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 60,
                        height: 84,
                        background: "var(--paper)",
                        borderRadius: 3,
                      }}
                    />
                  )}
                  <div>
                    <div
                      className="serif"
                      style={{ fontSize: 15, fontWeight: 500 }}
                    >
                      {snap.name ?? "—"}
                    </div>
                    {variant ? (
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
                    ) : null}
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

          {o.status === "PAID" ? (
            <div
              style={{
                marginTop: 24,
                padding: 18,
                background: "var(--bg-alt)",
                borderRadius: 6,
                border: "1px solid var(--line-soft)",
              }}
            >
              <h3
                className="serif"
                style={{ fontSize: 16, fontWeight: 500, marginTop: 0 }}
              >
                Mark shipped
              </h3>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--ink-soft)",
                  marginTop: 4,
                  marginBottom: 14,
                }}
              >
                Enter the tracking number to fulfil this order and email the
                customer.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  placeholder="Tracking number"
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                  style={{ ...adminInputStyle, background: "var(--paper)" }}
                />
                <button
                  type="button"
                  disabled={!tracking || ship.isPending}
                  onClick={() => ship.mutate({ id, trackingNumber: tracking })}
                  className="btn"
                  style={{
                    padding: "10px 18px",
                    fontSize: 13,
                    opacity: !tracking || ship.isPending ? 0.6 : 1,
                  }}
                >
                  {ship.isPending ? "Sending…" : "Mark shipped"}
                </button>
              </div>
              <SubmitErrorRow error={ship.error?.message} />
            </div>
          ) : null}

          {o.status === "FULFILLED" ? (
            <div
              style={{
                marginTop: 24,
                padding: 18,
                background: "rgba(74,122,74,0.08)",
                border: "1px solid var(--positive)",
                borderRadius: 6,
                fontSize: 13,
                color: "var(--ink)",
              }}
            >
              Shipped with tracking{" "}
              <strong className="mono">{o.trackingNumber}</strong>
              {o.fulfilledAt
                ? ` on ${new Date(o.fulfilledAt).toLocaleString()}`
                : ""}
              .
            </div>
          ) : null}
        </div>

        <aside
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            position: "sticky",
            top: 16,
          }}
        >
          <div
            style={{
              background: "var(--paper)",
              border: "1px solid var(--line)",
              borderRadius: 8,
              padding: 20,
            }}
          >
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              Ship to
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.6 }}>
              {addr?.name}
              <br />
              {addr?.line1}
              {addr?.line2 ? (
                <>
                  <br />
                  {addr.line2}
                </>
              ) : null}
              <br />
              {addr?.city}
              {addr?.state ? `, ${addr.state}` : ""} {addr?.postalCode}{" "}
              {addr?.country ? `· ${addr.country}` : ""}
            </div>
          </div>

          <div
            style={{
              background: "var(--paper)",
              border: "1px solid var(--line)",
              borderRadius: 8,
              padding: 20,
              fontSize: 13,
            }}
          >
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              Totals
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <Row label="Subtotal" value={formatCents(o.subtotalCents)} />
              <Row
                label="Shipping"
                value={
                  o.shippingCents === 0 ? "Free" : formatCents(o.shippingCents)
                }
                positive={o.shippingCents === 0}
              />
              {o.taxCents > 0 ? (
                <Row label="Tax" value={formatCents(o.taxCents)} />
              ) : null}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: 10,
                marginTop: 8,
                borderTop: "1px solid var(--line-soft)",
                alignItems: "baseline",
              }}
            >
              <span style={{ fontWeight: 500 }}>Total</span>
              <span
                className="serif num"
                style={{ fontSize: 20, fontWeight: 600 }}
              >
                {formatCents(o.totalCents)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({
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

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    PAID: { bg: "rgba(74,122,74,0.12)", color: "var(--positive)" },
    FULFILLED: { bg: "rgba(74,122,74,0.12)", color: "var(--positive)" },
    PENDING_PAYMENT: { bg: "rgba(200,132,58,0.14)", color: "var(--warn)" },
    EXPIRED: { bg: "var(--bg-alt)", color: "var(--ink-soft)" },
    CANCELED: { bg: "var(--bg-alt)", color: "var(--ink-soft)" },
    FAILED: { bg: "rgba(168,58,42,0.14)", color: "var(--danger)" },
  };
  const s = map[status] ?? { bg: "var(--bg-alt)", color: "var(--ink-soft)" };
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: "5px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.04em",
      }}
    >
      {status.replace("_", " ")}
    </span>
  );
}
