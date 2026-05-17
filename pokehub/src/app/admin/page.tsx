import Link from "next/link";

import { AdminShell } from "~/app/_components/editorial/AdminShell";
import { formatCents } from "~/lib/format";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

const DAY_MS = 24 * 60 * 60 * 1000;

export default async function AdminDashboard() {
  const session = await auth();
  const since30 = new Date(Date.now() - 30 * DAY_MS);
  const sinceToday = startOfToday();

  const [
    productCount,
    cardCount,
    pendingOrders,
    todaysOrders,
    last30Orders,
    recentOrders,
    recentProducts,
  ] = await Promise.all([
    db.product.count({ where: { quantity: { gt: 0 } } }),
    db.card.count(),
    db.order.count({ where: { status: "PAID" } }),
    db.order.findMany({
      where: {
        status: { in: ["PAID", "FULFILLED"] },
        createdAt: { gte: sinceToday },
      },
      select: { totalCents: true },
    }),
    db.order.findMany({
      where: {
        status: { in: ["PAID", "FULFILLED"] },
        createdAt: { gte: since30 },
      },
      select: { createdAt: true, totalCents: true },
    }),
    db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        orderNumber: true,
        email: true,
        totalCents: true,
        status: true,
        createdAt: true,
        items: { select: { id: true } },
      },
    }),
    db.product.findMany({
      where: { quantity: { gt: 0 } },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        type: true,
        name: true,
        priceCents: true,
        imageUrl: true,
        sealedType: true,
        condition: true,
        grade: true,
        gradingCompany: true,
        createdAt: true,
        card: {
          select: { name: true, number: true, set: { select: { name: true } } },
        },
      },
    }),
  ]);

  const todaysSales = todaysOrders.reduce((s, o) => s + o.totalCents, 0);

  return (
    <AdminShell
      active="dashboard"
      email={session?.user?.email ?? null}
      pendingOrders={pendingOrders}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 16,
        }}
      >
        <div>
          <div
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--ink-mute)",
              letterSpacing: "0.08em",
            }}
          >
            {formatToday()}
          </div>
          <h1
            className="serif"
            style={{
              fontSize: 38,
              fontWeight: 500,
              letterSpacing: "-0.03em",
              marginTop: 6,
              marginBottom: 0,
            }}
          >
            {greetingFor(
              session?.user?.name ?? session?.user?.email ?? "there",
            )}
          </h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link
            href="/admin/products"
            className="btn ghost"
            style={{
              padding: "9px 16px",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            View products
          </Link>
          <Link
            href="/admin/products/new/raw"
            className="btn"
            style={{
              padding: "9px 16px",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            + New product
          </Link>
        </div>
      </div>

      {/* Stat tiles */}
      <div
        style={{
          marginTop: 28,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
        }}
        className="admin-stats"
      >
        <StatTile
          label="Sales · today"
          value={formatCents(todaysSales)}
          sub={`${todaysOrders.length} paid order${todaysOrders.length === 1 ? "" : "s"}`}
          up
        />
        <StatTile
          label="Awaiting packing"
          value={pendingOrders.toLocaleString()}
          sub={pendingOrders === 0 ? "All caught up" : "Open orders queue"}
          up={pendingOrders === 0}
        />
        <StatTile
          label="In-stock products"
          value={productCount.toLocaleString()}
          sub="Across raw, graded, sealed"
          up
        />
        <StatTile
          label="Catalog cards"
          value={cardCount.toLocaleString()}
          sub="Distinct cards available to list"
          up
        />
      </div>

      <div
        style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: 18,
        }}
        className="admin-second-row"
      >
        <SalesChart
          days={salesByDay(last30Orders, 30)}
          total={last30Orders.reduce((s, o) => s + o.totalCents, 0)}
        />
        <RecentProducts
          items={recentProducts.map((p) => ({
            ...p,
            grade: p.grade ? Number(p.grade) : null,
            gradingCompany: p.gradingCompany ?? null,
            condition: p.condition ?? null,
            sealedType: p.sealedType ?? null,
          }))}
        />
      </div>

      <div
        style={{
          marginTop: 24,
          background: "var(--paper)",
          border: "1px solid var(--line)",
          borderRadius: 6,
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <h3
            className="serif"
            style={{ fontSize: 18, fontWeight: 500, margin: 0 }}
          >
            Recent orders
          </h3>
          <Link
            href="/admin/orders"
            style={{
              fontSize: 13,
              color: "var(--ink-soft)",
              textDecoration: "none",
            }}
          >
            View all →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div
            style={{
              marginTop: 20,
              padding: 24,
              border: "1px dashed var(--line)",
              borderRadius: 6,
              color: "var(--ink-mute)",
              fontSize: 13,
              textAlign: "center",
            }}
          >
            No orders yet.
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: 16,
              fontSize: 13,
            }}
          >
            <thead>
              <tr>
                {["Order", "Email", "Items", "Total", "Status", "Placed"].map(
                  (h) => (
                    <th
                      key={h}
                      className="eyebrow"
                      style={{
                        fontSize: 10,
                        padding: "10px 12px",
                        textAlign: "left",
                        borderBottom: "1px solid var(--line-soft)",
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr
                  key={o.id}
                  style={{ borderBottom: "1px solid var(--line-soft)" }}
                >
                  <td
                    className="mono"
                    style={{ padding: "14px 12px", fontWeight: 500 }}
                  >
                    <Link
                      href={`/admin/orders/${o.id}`}
                      style={{ color: "var(--ink)", textDecoration: "none" }}
                    >
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td
                    style={{
                      padding: "14px 12px",
                      color: "var(--ink-soft)",
                    }}
                  >
                    {o.email}
                  </td>
                  <td
                    style={{
                      padding: "14px 12px",
                      color: "var(--ink-soft)",
                    }}
                  >
                    {o.items.length} {o.items.length === 1 ? "item" : "items"}
                  </td>
                  <td
                    className="mono num"
                    style={{ padding: "14px 12px", fontWeight: 500 }}
                  >
                    {formatCents(o.totalCents)}
                  </td>
                  <td style={{ padding: "14px 12px" }}>
                    <StatusBadge status={o.status} />
                  </td>
                  <td
                    style={{ padding: "14px 12px", color: "var(--ink-mute)" }}
                  >
                    {relativeTime(o.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}

function StatTile({
  label,
  value,
  sub,
  up,
}: {
  label: string;
  value: string;
  sub: string;
  up?: boolean;
}) {
  return (
    <div
      style={{
        background: "var(--paper)",
        border: "1px solid var(--line)",
        borderRadius: 6,
        padding: 20,
      }}
    >
      <div className="eyebrow">{label}</div>
      <div
        className="serif num"
        style={{
          fontSize: 32,
          fontWeight: 500,
          letterSpacing: "-0.025em",
          marginTop: 8,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 11,
          color: up ? "var(--positive)" : "var(--ink-mute)",
          marginTop: 4,
        }}
      >
        {sub}
      </div>
    </div>
  );
}

function SalesChart({
  days,
  total,
}: {
  days: { date: string; cents: number }[];
  total: number;
}) {
  const max = Math.max(1, ...days.map((d) => d.cents));
  const points = days.map((d, i) => {
    const x = (i / Math.max(1, days.length - 1)) * 600;
    const y = 180 - (d.cents / max) * 160;
    return [x, y] as const;
  });
  const line =
    points.length === 0
      ? ""
      : "M " +
        points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ");
  const fill =
    points.length === 0
      ? ""
      : `${line} L ${points[points.length - 1]![0].toFixed(1)} 180 L ${points[0]![0].toFixed(1)} 180 Z`;

  return (
    <div
      style={{
        background: "var(--paper)",
        border: "1px solid var(--line)",
        borderRadius: 6,
        padding: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <div>
          <h3
            className="serif"
            style={{ fontSize: 18, fontWeight: 500, margin: 0 }}
          >
            Sales · last 30 days
          </h3>
          <div
            className="serif num"
            style={{
              fontSize: 26,
              fontWeight: 600,
              marginTop: 6,
              letterSpacing: "-0.02em",
            }}
          >
            {formatCents(total)}
          </div>
        </div>
        <span className="pill">30d</span>
      </div>
      <svg
        viewBox="0 0 600 180"
        style={{ width: "100%", height: 200, marginTop: 12 }}
      >
        <defs>
          <linearGradient id="adminSalesGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[40, 80, 120, 160].map((y) => (
          <line
            key={y}
            x1="0"
            x2="600"
            y1={y}
            y2={y}
            stroke="var(--line-soft)"
            strokeWidth="1"
          />
        ))}
        {fill ? <path d={fill} fill="url(#adminSalesGrad)" /> : null}
        {line ? (
          <path
            d={line}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}
      </svg>
    </div>
  );
}

function RecentProducts({
  items,
}: {
  items: {
    id: string;
    type: string;
    name: string | null;
    priceCents: number;
    imageUrl: string | null;
    sealedType: string | null;
    condition: string | null;
    grade: number | null;
    gradingCompany: string | null;
    createdAt: Date;
    card: { name: string; number: string; set: { name: string } } | null;
  }[];
}) {
  return (
    <div
      style={{
        background: "var(--paper)",
        border: "1px solid var(--line)",
        borderRadius: 6,
        padding: 24,
      }}
    >
      <h3
        className="serif"
        style={{ fontSize: 18, fontWeight: 500, margin: 0 }}
      >
        Recently listed
      </h3>
      {items.length === 0 ? (
        <div
          style={{
            marginTop: 14,
            padding: 16,
            border: "1px dashed var(--line)",
            borderRadius: 6,
            color: "var(--ink-mute)",
            fontSize: 13,
            textAlign: "center",
          }}
        >
          Nothing listed yet.
        </div>
      ) : (
        <div
          style={{
            marginTop: 14,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {items.map((p) => {
            const displayName = p.card?.name ?? p.name ?? "—";
            const meta =
              p.type === "RAW"
                ? p.condition
                : p.type === "GRADED"
                  ? `${p.gradingCompany ?? ""} ${p.grade ?? ""}`.trim()
                  : (p.sealedType ?? "");
            return (
              <div
                key={p.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "44px 1fr auto",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.imageUrl}
                    alt=""
                    style={{
                      width: 44,
                      height: 62,
                      objectFit: "contain",
                      background: "var(--bg-alt)",
                      borderRadius: 3,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 44,
                      height: 62,
                      background: "var(--bg-alt)",
                      borderRadius: 3,
                    }}
                  />
                )}
                <div style={{ minWidth: 0 }}>
                  <div
                    className="serif"
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {displayName}
                  </div>
                  <div
                    className="mono"
                    style={{
                      fontSize: 10,
                      color: "var(--ink-mute)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {meta?.length ? meta : p.type}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    className="serif num"
                    style={{ fontSize: 14, fontWeight: 600 }}
                  >
                    {formatCents(p.priceCents)}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--ink-mute)" }}>
                    {relativeTime(p.createdAt)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
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

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatToday(): string {
  const d = new Date();
  return d
    .toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      weekday: "long",
    })
    .toUpperCase();
}

function greetingFor(name: string): string {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const first = name.split(/[@\s]/)[0] ?? "there";
  return `${greeting}, ${first}.`;
}

function relativeTime(d: Date): string {
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

function salesByDay(
  orders: { createdAt: Date; totalCents: number }[],
  days: number,
): { date: string; cents: number }[] {
  const buckets: Record<string, number> = {};
  const now = startOfToday();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * DAY_MS);
    buckets[d.toISOString().slice(0, 10)] = 0;
  }
  for (const o of orders) {
    const key = new Date(o.createdAt).toISOString().slice(0, 10);
    if (buckets[key] !== undefined) buckets[key] += o.totalCents;
  }
  return Object.entries(buckets).map(([date, cents]) => ({ date, cents }));
}
