"use client";

import Link from "next/link";
import { useState } from "react";

import { formatCents } from "~/lib/format";
import { api } from "~/trpc/react";

const STATUSES = [
  "ALL",
  "PENDING_PAYMENT",
  "PAID",
  "FULFILLED",
  "CANCELED",
  "EXPIRED",
  "FAILED",
] as const;
type Status = (typeof STATUSES)[number];

const TAB_LABEL: Record<Status, string> = {
  ALL: "All",
  PENDING_PAYMENT: "Pending",
  PAID: "Paid",
  FULFILLED: "Shipped",
  CANCELED: "Cancelled",
  EXPIRED: "Expired",
  FAILED: "Failed",
};

export function AdminOrdersList() {
  const [status, setStatus] = useState<Status>("PAID");
  const list = api.order.adminList.useQuery({
    status: status === "ALL" ? undefined : status,
    limit: 100,
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
            Orders
          </h1>
          <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 4 }}>
            {items.length} {items.length === 1 ? "order" : "orders"} in this
            view
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 24,
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        {STATUSES.map((s) => {
          const active = status === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className="pill"
              style={{
                cursor: "pointer",
                fontFamily: "inherit",
                ...(active
                  ? {
                      background: "var(--ink)",
                      color: "var(--bg)",
                      borderColor: "var(--ink)",
                    }
                  : {}),
              }}
            >
              {TAB_LABEL[s]}
            </button>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 18,
          background: "var(--paper)",
          border: "1px solid var(--line)",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {list.isLoading ? (
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
        ) : items.length === 0 ? (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "var(--ink-mute)",
              fontSize: 13,
            }}
          >
            No orders for this filter.
          </div>
        ) : (
          items.map((o, i) => {
            const initials = initialsOf(o.email);
            return (
              <Link
                key={o.id}
                href={`/admin/orders/${o.id}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: 14,
                  padding: "16px 20px",
                  borderTop: i === 0 ? 0 : "1px solid var(--line-soft)",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "var(--ink)",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 999,
                    background: "var(--chip)",
                    color: "var(--ink)",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 500,
                    fontSize: 13,
                  }}
                >
                  {initials}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span
                      className="mono"
                      style={{ fontWeight: 500, fontSize: 13 }}
                    >
                      {o.orderNumber}
                    </span>
                    {o.totalCents >= 100000 ? (
                      <span
                        className="pill"
                        style={{
                          background: "var(--accent)",
                          color: "var(--ink-accent)",
                          border: 0,
                          fontSize: 10,
                        }}
                      >
                        HIGH-VALUE
                      </span>
                    ) : null}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--ink-soft)",
                      marginTop: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {o.email} · {o.items.length}{" "}
                    {o.items.length === 1 ? "item" : "items"} ·{" "}
                    {relativeTime(o.createdAt)}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    className="serif num"
                    style={{ fontSize: 16, fontWeight: 600 }}
                  >
                    {formatCents(o.totalCents)}
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <StatusBadge status={o.status} />
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
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
        padding: "3px 9px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.04em",
      }}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function initialsOf(email: string): string {
  const local = email.split("@")[0] ?? email;
  return local.slice(0, 2).toUpperCase();
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
