import { type NextRequest, NextResponse } from "next/server";

import { env } from "~/env";
import { db } from "~/server/db";
import { stripe } from "~/server/stripe";

export const runtime = "nodejs";

/**
 * Sweeps PENDING_PAYMENT orders older than 30 minutes:
 *   - cancel the Stripe PaymentIntent (so further payment attempts fail)
 *   - mark order EXPIRED
 *   - restore inventory for each line item
 *
 * Called by Vercel Cron with `Authorization: Bearer ${CRON_SECRET}`.
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const cutoff = new Date(Date.now() - 30 * 60 * 1000);
  const stale = await db.order.findMany({
    where: {
      status: "PENDING_PAYMENT",
      createdAt: { lt: cutoff },
    },
    include: { items: true },
    take: 100,
  });

  for (const order of stale) {
    try {
      if (order.stripePaymentIntentId) {
        await stripe.paymentIntents.cancel(order.stripePaymentIntentId).catch(() => {
          // PI may already be canceled / succeeded; ignore.
        });
      }
      await db.$transaction(async (tx) => {
        const fresh = await tx.order.findUnique({ where: { id: order.id } });
        if (fresh?.status !== "PENDING_PAYMENT") return;
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { quantity: { increment: item.quantity } },
          });
        }
        await tx.order.update({
          where: { id: order.id },
          data: { status: "EXPIRED" },
        });
      });
    } catch (err) {
      console.error(`Failed to expire order ${order.orderNumber}`, err);
    }
  }

  return NextResponse.json({ expired: stale.length });
}
