import { TRPCError } from "@trpc/server";
import { customAlphabet } from "nanoid";
import { z } from "zod";

import { Prisma } from "../../../../generated/prisma";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { stripe } from "~/server/stripe";

const orderNumberId = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZ", 6);
function makeOrderNumber() {
  return `PHB-${orderNumberId()}`;
}

const addressSchema = z.object({
  name: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().length(2),
});

const cartLineInputSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
});

function shippingCentsFor(subtotalCents: number): number {
  if (subtotalCents === 0) return 0;
  if (subtotalCents >= 5000) return 0;
  return 500;
}

export const checkoutRouter = createTRPCRouter({
  /**
   * Creates a PENDING_PAYMENT order, decrements inventory in a serializable
   * transaction, and creates a Stripe PaymentIntent. Returns the PI client_secret.
   *
   * Race-safe: concurrent attempts on the same one-of-one (graded) row will
   * have one succeed and the other rolled back with an out-of-stock error.
   */
  createPaymentIntent: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        shippingAddress: addressSchema,
        items: z.array(cartLineInputSchema).min(1).max(50),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { order, paymentIntentClientSecret } = await ctx.db.$transaction(
        async (tx) => {
          // Lock + fetch each product. Note: Prisma Postgres `$transaction`
          // with Serializable isolation handles concurrency at commit time.
          const products = await tx.product.findMany({
            where: { id: { in: input.items.map((i) => i.productId) } },
            include: { card: true },
          });
          const byId = new Map(products.map((p) => [p.id, p]));

          let subtotal = 0;
          const itemsForOrder: {
            productId: string;
            quantity: number;
            priceAtPurchaseCents: number;
            productSnapshotJson: Prisma.InputJsonValue;
          }[] = [];

          for (const line of input.items) {
            const p = byId.get(line.productId);
            if (!p) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: `Product ${line.productId} not found`,
              });
            }
            if (p.quantity < line.quantity) {
              throw new TRPCError({
                code: "CONFLICT",
                message: `${p.card?.name ?? p.name ?? "Item"} is no longer available in the requested quantity`,
              });
            }
            subtotal += p.priceCents * line.quantity;
            itemsForOrder.push({
              productId: p.id,
              quantity: line.quantity,
              priceAtPurchaseCents: p.priceCents,
              productSnapshotJson: {
                type: p.type,
                name: p.card?.name ?? p.name,
                condition: p.condition,
                grade: p.grade?.toString() ?? null,
                gradingCompany: p.gradingCompany,
                certNumber: p.certNumber,
                sealedType: p.sealedType,
                imageUrl: p.imageUrl ?? p.card?.imageUrl ?? null,
              },
            });

            await tx.product.update({
              where: { id: p.id },
              data: { quantity: p.quantity - line.quantity },
            });
          }

          const shipping = shippingCentsFor(subtotal);
          const total = subtotal + shipping;

          const created = await tx.order.create({
            data: {
              orderNumber: makeOrderNumber(),
              email: input.email,
              status: "PENDING_PAYMENT",
              subtotalCents: subtotal,
              shippingCents: shipping,
              taxCents: 0,
              totalCents: total,
              shippingAddressJson: input.shippingAddress,
              items: { create: itemsForOrder },
              userId: ctx.session?.user?.id ?? null,
            },
          });

          const pi = await stripe.paymentIntents.create({
            amount: total,
            currency: "usd",
            metadata: { orderId: created.id, orderNumber: created.orderNumber },
            automatic_payment_methods: { enabled: true },
          });

          await tx.order.update({
            where: { id: created.id },
            data: { stripePaymentIntentId: pi.id },
          });

          return {
            order: created,
            paymentIntentClientSecret: pi.client_secret,
          };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );

      if (!paymentIntentClientSecret) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Stripe did not return a client secret",
        });
      }

      return {
        orderId: order.id,
        orderNumber: order.orderNumber,
        clientSecret: paymentIntentClientSecret,
        totalCents: order.totalCents,
        shippingCents: order.shippingCents,
        subtotalCents: order.subtotalCents,
      };
    }),

  /** Public order lookup by orderNumber + email. */
  byNumber: publicProcedure
    .input(z.object({ orderNumber: z.string(), email: z.string().email() }))
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.order.findFirst({
        where: { orderNumber: input.orderNumber, email: input.email },
        include: { items: true },
      });
      if (!order) throw new TRPCError({ code: "NOT_FOUND" });
      return order;
    }),
});
