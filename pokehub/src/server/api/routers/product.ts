import { TRPCError } from "@trpc/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  CardCondition,
  GradingCompany,
  Language,
  ProductType,
  SealedType,
} from "../../../../generated/prisma";
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

const conditionSchema = z.nativeEnum(CardCondition);
const gradingCompanySchema = z.nativeEnum(GradingCompany);
const sealedTypeSchema = z.nativeEnum(SealedType);
const languageSchema = z.nativeEnum(Language).default(Language.ENGLISH);

const baseProductInput = {
  priceCents: z.number().int().positive(),
  quantity: z.number().int().nonnegative(),
  description: z.string().max(2000).optional(),
  language: languageSchema,
  imageUrl: z.string().url().optional(),
};

function revalidateProduct(opts: {
  cardId?: string | null;
  productId?: string | null;
  type?: ProductType;
}) {
  revalidatePath("/shop");
  if (opts.cardId) revalidatePath(`/cards/${opts.cardId}`);
  if (opts.productId && opts.type === ProductType.SEALED) {
    revalidatePath(`/sealed/${opts.productId}`);
  }
}

export const productRouter = createTRPCRouter({
  // ============= ADMIN: create =============

  createRaw: adminProcedure
    .input(
      z.object({
        ...baseProductInput,
        cardId: z.string(),
        condition: conditionSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Raw cards merge by (cardId, condition). If a row already exists, increment qty.
      const existing = await ctx.db.product.findUnique({
        where: {
          uk_raw_card_identity: {
            cardId: input.cardId,
            condition: input.condition,
          },
        },
      });
      const product = existing
        ? await ctx.db.product.update({
            where: { id: existing.id },
            data: {
              quantity: existing.quantity + input.quantity,
              priceCents: input.priceCents,
              description: input.description ?? existing.description,
            },
          })
        : await ctx.db.product.create({
            data: {
              type: ProductType.RAW,
              cardId: input.cardId,
              condition: input.condition,
              priceCents: input.priceCents,
              quantity: input.quantity,
              description: input.description,
              language: input.language,
              imageUrl: input.imageUrl,
            },
          });
      revalidateProduct({ cardId: input.cardId });
      return product;
    }),

  createGraded: adminProcedure
    .input(
      z.object({
        ...baseProductInput,
        cardId: z.string(),
        gradingCompany: gradingCompanySchema,
        grade: z.number().min(1).max(10),
        certNumber: z.string().min(1).max(40),
        caseCondition: z.string().max(200).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Each graded card is one-of-one. quantity must be 1.
      if (input.quantity !== 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Graded cards must have quantity = 1",
        });
      }
      const product = await ctx.db.product.create({
        data: {
          type: ProductType.GRADED,
          cardId: input.cardId,
          gradingCompany: input.gradingCompany,
          grade: input.grade,
          certNumber: input.certNumber,
          caseCondition: input.caseCondition,
          priceCents: input.priceCents,
          quantity: 1,
          description: input.description,
          language: input.language,
          imageUrl: input.imageUrl,
        },
      });
      revalidateProduct({ cardId: input.cardId });
      return product;
    }),

  createSealed: adminProcedure
    .input(
      z.object({
        ...baseProductInput,
        name: z.string().min(1).max(200),
        sealedType: sealedTypeSchema,
        releaseDate: z.string().optional(), // ISO date
        region: z.string().max(50).optional(),
        cardSetIds: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.product.create({
        data: {
          type: ProductType.SEALED,
          name: input.name,
          sealedType: input.sealedType,
          releaseDate: input.releaseDate ? new Date(input.releaseDate) : null,
          region: input.region,
          priceCents: input.priceCents,
          quantity: input.quantity,
          description: input.description,
          language: input.language,
          imageUrl: input.imageUrl,
          sealedSets: input.cardSetIds
            ? {
                create: input.cardSetIds.map((cardSetId) => ({ cardSetId })),
              }
            : undefined,
        },
      });
      revalidateProduct({ productId: product.id, type: ProductType.SEALED });
      return product;
    }),

  // ============= ADMIN: edit / delist =============

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        priceCents: z.number().int().positive().optional(),
        quantity: z.number().int().nonnegative().optional(),
        description: z.string().max(2000).optional(),
        imageUrl: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;
      const product = await ctx.db.product.update({
        where: { id },
        data: rest,
      });
      revalidateProduct({
        cardId: product.cardId,
        productId: product.id,
        type: product.type,
      });
      return product;
    }),

  delist: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.product.update({
        where: { id: input.id },
        data: { quantity: 0 },
      });
      revalidateProduct({
        cardId: product.cardId,
        productId: product.id,
        type: product.type,
      });
      return product;
    }),

  // ============= ADMIN: list everything (incl. delisted) =============

  adminList: adminProcedure
    .input(
      z.object({
        type: z.nativeEnum(ProductType).optional(),
        cursor: z.string().optional(),
        limit: z.number().int().min(1).max(100).default(50),
      }),
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.product.findMany({
        where: input.type ? { type: input.type } : undefined,
        include: { card: { include: { set: true } } },
        orderBy: { createdAt: "desc" },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        skip: input.cursor ? 1 : 0,
      });
      const nextCursor = items.length > input.limit ? items.pop()?.id : null;
      return { items, nextCursor };
    }),

  // ============= PUBLIC: list / detail =============

  /**
   * Storefront grid. Returns one tile per Card (with at least one in-stock product),
   * plus all in-stock SEALED products as separate tiles.
   * For v1 we keep this simple — paginated, optional type filter.
   */
  shop: publicProcedure
    .input(
      z.object({
        cursor: z.string().optional(),
        limit: z.number().int().min(1).max(60).default(24),
      }),
    )
    .query(async ({ ctx, input: _input }) => {
      const [cardAggregates, sealedTiles] = await Promise.all([
        ctx.db.product.groupBy({
          by: ["cardId"],
          where: {
            type: { in: [ProductType.RAW, ProductType.GRADED] },
            quantity: { gt: 0 },
            cardId: { not: null },
          },
          _min: { priceCents: true },
        }),
        ctx.db.product.findMany({
          where: { type: ProductType.SEALED, quantity: { gt: 0 } },
          select: {
            id: true,
            name: true,
            sealedType: true,
            priceCents: true,
            imageUrl: true,
          },
          orderBy: { createdAt: "desc" },
        }),
      ]);

      const cardIds = cardAggregates
        .map((row) => row.cardId)
        .filter((id): id is string => Boolean(id));

      const cards = cardIds.length
        ? await ctx.db.card.findMany({
            where: { id: { in: cardIds } },
            include: { set: true },
          })
        : [];

      const minByCard = new Map(
        cardAggregates.map((row) => [row.cardId, row._min.priceCents ?? 0]),
      );

      const cardTiles = cards
        .map((card) => ({
          card,
          fromPriceCents: minByCard.get(card.id) ?? 0,
        }))
        .sort((a, b) => a.fromPriceCents - b.fromPriceCents);

      return {
        cards: cardTiles,
        sealed: sealedTiles,
      };
    }),

  /** Card detail page: all in-stock variants for a single card. */
  cardVariants: publicProcedure
    .input(z.object({ cardId: z.string() }))
    .query(async ({ ctx, input }) => {
      const [card, variants] = await Promise.all([
        ctx.db.card.findUnique({
          where: { id: input.cardId },
          include: { set: { include: { era: true } }, artist: true },
        }),
        ctx.db.product.findMany({
          where: {
            cardId: input.cardId,
            quantity: { gt: 0 },
          },
          orderBy: [{ type: "asc" }, { priceCents: "asc" }],
        }),
      ]);
      if (!card) throw new TRPCError({ code: "NOT_FOUND" });
      return { card, variants };
    }),

  /** Sealed product detail. */
  sealedDetail: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findFirst({
        where: { id: input.id, type: ProductType.SEALED },
        include: { sealedSets: { include: { cardSet: true } } },
      });
      if (!product) throw new TRPCError({ code: "NOT_FOUND" });
      return product;
    }),

  /** Used by the cart to refresh prices/availability before checkout. */
  byIds: publicProcedure
    .input(z.object({ ids: z.array(z.string()).max(100) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.product.findMany({
        where: { id: { in: input.ids } },
        include: { card: true },
      });
    }),
});
