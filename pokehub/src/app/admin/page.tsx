import Link from "next/link";

import { db } from "~/server/db";

export default async function AdminDashboard() {
  const [productCount, cardCount, pendingOrders] = await Promise.all([
    db.product.count({ where: { quantity: { gt: 0 } } }),
    db.card.count(),
    db.order.count({ where: { status: "PAID" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin</h1>
      <div className="mt-6 grid grid-cols-3 gap-4">
        <Stat label="In-stock products" value={productCount} />
        <Stat label="Catalog cards" value={cardCount} />
        <Stat label="Paid orders" value={pendingOrders} />
      </div>
      <div className="mt-8 flex gap-4">
        <Link
          href="/admin/products/new/raw"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          List raw card
        </Link>
        <Link
          href="/admin/products/new/graded"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          List graded card
        </Link>
        <Link
          href="/admin/products/new/sealed"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          List sealed product
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border p-4">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
