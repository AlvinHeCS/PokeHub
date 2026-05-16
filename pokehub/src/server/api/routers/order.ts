import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { OrderStatus } from "../../../../generated/prisma";
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";
import { sendShippingNotification } from "~/server/email/send";

export const orderRouter = createTRPCRouter({
  adminList: adminProcedure
    .input(
      z.object({
        status: z.nativeEnum(OrderStatus).optional(),
        cursor: z.string().optional(),
        limit: z.number().int().min(1).max(100).default(50),
      }),
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.order.findMany({
        where: input.status ? { status: input.status } : undefined,
        include: { items: true },
        orderBy: { createdAt: "desc" },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        skip: input.cursor ? 1 : 0,
      });
      const nextCursor = items.length > input.limit ? items.pop()?.id : null;
      return { items, nextCursor };
    }),

  adminGet: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: { id: input.id },
        include: { items: true },
      });
      if (!order) throw new TRPCError({ code: "NOT_FOUND" });
      return order;
    }),

  adminMarkShipped: adminProcedure
    .input(
      z.object({
        id: z.string(),
        trackingNumber: z.string().min(1).max(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({ where: { id: input.id } });
      if (!order) throw new TRPCError({ code: "NOT_FOUND" });
      if (order.status !== "PAID") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Cannot ship order in status ${order.status}`,
        });
      }
      const updated = await ctx.db.order.update({
        where: { id: input.id },
        data: {
          status: "FULFILLED",
          trackingNumber: input.trackingNumber,
          fulfilledAt: new Date(),
        },
      });
      sendShippingNotification({
        to: updated.email,
        orderNumber: updated.orderNumber,
        trackingNumber: input.trackingNumber,
      }).catch((err) => console.error("Failed to send shipping email", err));
      return updated;
    }),
});
