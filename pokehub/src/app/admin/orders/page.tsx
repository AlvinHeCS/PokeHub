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

export default function AdminOrdersPage() {
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("PAID");
  const list = api.order.adminList.useQuery({
    status: status === "ALL" ? undefined : status,
    limit: 100,
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <select
          className="rounded border p-2"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as (typeof STATUSES)[number])
          }
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {list.isLoading ? <div>Loading…</div> : null}

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">Order #</th>
            <th className="p-2">Date</th>
            <th className="p-2">Email</th>
            <th className="p-2">Items</th>
            <th className="p-2">Total</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {list.data?.items.map((o) => (
            <tr key={o.id} className="border-b">
              <td className="p-2">
                <Link
                  href={`/admin/orders/${o.id}`}
                  className="text-blue-600 underline"
                >
                  {o.orderNumber}
                </Link>
              </td>
              <td className="p-2">{new Date(o.createdAt).toLocaleString()}</td>
              <td className="p-2">{o.email}</td>
              <td className="p-2">{o.items.length}</td>
              <td className="p-2">{formatCents(o.totalCents)}</td>
              <td className="p-2">{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {list.data?.items.length === 0 ? (
        <div className="mt-8 text-center text-gray-500">
          No orders for this filter.
        </div>
      ) : null}
    </div>
  );
}
