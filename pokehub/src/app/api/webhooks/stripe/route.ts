import { type NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";

import { env } from "~/env";
import { db } from "~/server/db";
import { sendOrderConfirmation } from "~/server/email/send";
import { stripe } from "~/server/stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new NextResponse("Missing signature", { status: 400 });

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature failed", err);
    return new NextResponse("Bad signature", { status: 400 });
  }

  // Idempotency
  try {
    await db.processedWebhook.create({ data: { stripeEventId: event.id } });
  } catch {
    // Already processed
    return NextResponse.json({ ok: true, deduped: true });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const pi = event.data.object;
      const updated = await db.order.updateMany({
        where: {
          stripePaymentIntentId: pi.id,
          status: "PENDING_PAYMENT",
        },
        data: { status: "PAID", paidAt: new Date() },
      });
      if (updated.count > 0) {
        const order = await db.order.findUnique({
          where: { stripePaymentIntentId: pi.id },
          include: { items: true },
        });
        if (order) {
          await sendOrderConfirmation({
            to: order.email,
            orderNumber: order.orderNumber,
            items: order.items.map((it) => {
              const snap = it.productSnapshotJson as {
                name?: string;
                condition?: string;
                grade?: string;
                gradingCompany?: string;
                sealedType?: string;
              };
              const variant =
                snap.condition ??
                (snap.gradingCompany ? `${snap.gradingCompany} ${snap.grade ?? ""}` : null) ??
                snap.sealedType ??
                "";
              return {
                name: snap.name ?? "Item",
                variant,
                quantity: it.quantity,
                priceCents: it.priceAtPurchaseCents,
              };
            }),
            subtotalCents: order.subtotalCents,
            shippingCents: order.shippingCents,
            totalCents: order.totalCents,
          }).catch((err) => console.error("Failed to send order email", err));
        }
      }
      break;
    }
    case "payment_intent.payment_failed":
    case "payment_intent.canceled": {
      const pi = event.data.object;
      await releaseStockAndCancel(pi.id, event.type === "payment_intent.canceled" ? "CANCELED" : "FAILED");
      break;
    }
    default:
      // Unhandled event types are fine; we just ack.
      break;
  }

  return NextResponse.json({ ok: true });
}

async function releaseStockAndCancel(
  paymentIntentId: string,
  newStatus: "CANCELED" | "FAILED",
) {
  await db.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { stripePaymentIntentId: paymentIntentId },
      include: { items: true },
    });
    if (order?.status !== "PENDING_PAYMENT") return;
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { quantity: { increment: item.quantity } },
      });
    }
    await tx.order.update({
      where: { id: order.id },
      data: { status: newStatus },
    });
  });
}
