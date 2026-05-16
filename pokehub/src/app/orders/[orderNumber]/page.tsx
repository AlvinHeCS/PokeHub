import { notFound } from "next/navigation";

import { formatCents } from "~/lib/format";
import { api } from "~/trpc/server";
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
      <main className="mx-auto max-w-xl p-6">
        <h1 className="text-2xl font-bold">Order lookup</h1>
        <p className="mt-2 text-gray-600">
          Enter the email address used at checkout to view order {orderNumber}.
        </p>
        <form className="mt-4 flex gap-2">
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="flex-1 rounded border p-2"
          />
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            View order
          </button>
        </form>
      </main>
    );
  }

  let order;
  try {
    order = await api.checkout.byNumber({ orderNumber, email });
  } catch {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
      <div className="mt-1 text-sm text-gray-600">
        Status: <span className="font-medium">{order.status}</span>
      </div>

      {order.status === "PENDING_PAYMENT" ? (
        <>
          <PendingPaymentRefresher />
          <div className="mt-4 rounded border border-yellow-300 bg-yellow-50 p-3 text-sm">
            Your payment is being confirmed…
          </div>
        </>
      ) : null}
      {order.status === "PAID" || order.status === "FULFILLED" ? (
        <div className="mt-4 rounded border border-green-300 bg-green-50 p-3 text-sm">
          Thanks! We&apos;ve received your payment. You&apos;ll get a shipping
          notification when it&apos;s on the way.
        </div>
      ) : null}

      <h2 className="mt-6 mb-2 font-semibold">Items</h2>
      <ul className="space-y-2">
        {order.items.map((it) => {
          const snap = it.productSnapshotJson as {
            name?: string;
            condition?: string;
            grade?: string;
            gradingCompany?: string;
          };
          return (
            <li
              key={it.id}
              className="flex justify-between rounded border p-3 text-sm"
            >
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

      <div className="mt-6 space-y-1 border-t pt-4 text-sm">
        <Row label="Subtotal" value={formatCents(order.subtotalCents)} />
        <Row
          label="Shipping"
          value={
            order.shippingCents === 0
              ? "Free"
              : formatCents(order.shippingCents)
          }
        />
        {order.taxCents > 0 ? (
          <Row label="Tax" value={formatCents(order.taxCents)} />
        ) : null}
        <Row
          label="Total"
          value={formatCents(order.totalCents)}
          bold
        />
      </div>
    </main>
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
