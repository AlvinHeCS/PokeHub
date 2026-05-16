"use client";

import { use, useState } from "react";

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

export default function AdminOrderDetail({
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

  if (order.isLoading || !order.data) return <div>Loading…</div>;
  const o = order.data;
  const addr = o.shippingAddressJson as unknown as ShippingAddress;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Order {o.orderNumber}</h1>
        <div className="text-sm text-gray-600">
          {new Date(o.createdAt).toLocaleString()} · Status:{" "}
          <span className="font-medium">{o.status}</span>
        </div>
      </div>

      <section>
        <h2 className="mb-2 font-semibold">Customer</h2>
        <div className="text-sm">{o.email}</div>
        <div className="mt-2 text-sm">
          {addr.name}
          <br />
          {addr.line1}
          {addr.line2 ? (
            <>
              <br />
              {addr.line2}
            </>
          ) : null}
          <br />
          {addr.city}, {addr.state} {addr.postalCode} {addr.country}
        </div>
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Items</h2>
        <ul className="divide-y rounded border">
          {o.items.map((it) => {
            const snap = it.productSnapshotJson as {
              name?: string;
              condition?: string;
              grade?: string;
              gradingCompany?: string;
            };
            return (
              <li key={it.id} className="flex justify-between p-3 text-sm">
                <div>
                  <div className="font-medium">{snap.name}</div>
                  <div className="text-xs text-gray-600">
                    {snap.condition ?? snap.gradingCompany ?? ""}{" "}
                    {snap.grade ?? ""}
                  </div>
                </div>
                <div>
                  {it.quantity} × {formatCents(it.priceAtPurchaseCents)}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Totals</h2>
        <div className="space-y-1 text-sm">
          <Row label="Subtotal" value={formatCents(o.subtotalCents)} />
          <Row
            label="Shipping"
            value={
              o.shippingCents === 0 ? "Free" : formatCents(o.shippingCents)
            }
          />
          {o.taxCents > 0 ? (
            <Row label="Tax" value={formatCents(o.taxCents)} />
          ) : null}
          <Row label="Total" value={formatCents(o.totalCents)} bold />
        </div>
      </section>

      {o.status === "PAID" ? (
        <section className="rounded border p-4">
          <h2 className="mb-2 font-semibold">Mark shipped</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Tracking number"
              className="flex-1 rounded border p-2"
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
            />
            <button
              type="button"
              disabled={!tracking || ship.isPending}
              onClick={() => ship.mutate({ id, trackingNumber: tracking })}
              className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
              {ship.isPending ? "Sending…" : "Mark shipped"}
            </button>
          </div>
          {ship.error ? (
            <div className="mt-2 text-sm text-red-600">
              {ship.error.message}
            </div>
          ) : null}
        </section>
      ) : null}

      {o.status === "FULFILLED" ? (
        <section className="rounded border bg-green-50 p-4 text-sm">
          Shipped with tracking <strong>{o.trackingNumber}</strong> on{" "}
          {o.fulfilledAt ? new Date(o.fulfilledAt).toLocaleString() : "—"}.
        </section>
      ) : null}
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex justify-between ${bold ? "border-t pt-1 font-bold" : ""}`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
