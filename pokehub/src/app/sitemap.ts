import { type MetadataRoute } from "next";

import { env } from "~/env";
import { db } from "~/server/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

  const [cardIds, sealedIds] = await Promise.all([
    db.product.findMany({
      where: {
        type: { in: ["RAW", "GRADED"] },
        quantity: { gt: 0 },
        cardId: { not: null },
      },
      select: { cardId: true },
      distinct: ["cardId"],
    }),
    db.product.findMany({
      where: { type: "SEALED", quantity: { gt: 0 } },
      select: { id: true },
    }),
  ]);

  return [
    { url: `${base}/`, changeFrequency: "weekly" },
    { url: `${base}/shop`, changeFrequency: "daily" },
    ...cardIds
      .filter((c): c is { cardId: string } => Boolean(c.cardId))
      .map((c) => ({
        url: `${base}/cards/${c.cardId}`,
        changeFrequency: "weekly" as const,
      })),
    ...sealedIds.map((p) => ({
      url: `${base}/sealed/${p.id}`,
      changeFrequency: "weekly" as const,
    })),
  ];
}
