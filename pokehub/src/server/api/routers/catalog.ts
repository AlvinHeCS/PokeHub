import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const catalogRouter = createTRPCRouter({
  /**
   * Catalog card search by name (admin listing flow + customer search).
   * Uses pg_trgm similarity once the GIN index is in place; falls back to ILIKE.
   */
  searchCards: publicProcedure
    .input(
      z.object({
        q: z.string().min(1).max(100),
        limit: z.number().int().min(1).max(50).default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.card.findMany({
        where: {
          name: { contains: input.q, mode: "insensitive" },
        },
        include: { set: true },
        orderBy: [{ set: { id: "desc" } }, { number: "asc" }],
        take: input.limit,
      });
    }),

  listSets: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.cardSet.findMany({
      include: { era: true },
      orderBy: [{ era: { name: "asc" } }, { name: "asc" }],
    });
  }),
});
