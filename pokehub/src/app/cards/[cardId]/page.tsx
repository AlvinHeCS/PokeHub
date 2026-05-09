import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CardVariantPicker } from "~/app/cards/[cardId]/CardVariantPicker";
import { db } from "~/server/db";
import { api } from "~/trpc/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cardId: string }>;
}): Promise<Metadata> {
  const { cardId } = await params;
  const card = await db.card.findUnique({
    where: { id: cardId },
    include: { set: true },
  });
  if (!card) return { title: "Card · PokeHub" };
  return {
    title: `${card.name} · ${card.set.name} · PokeHub`,
    description: `${card.name} (${card.set.name} #${card.number}) — buy raw or graded singles at PokeHub.`,
    openGraph: {
      title: `${card.name} · ${card.set.name}`,
      images: card.imageUrl ? [{ url: card.imageUrl }] : [],
    },
  };
}

export default async function CardDetailPage({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  const { cardId } = await params;

  let data;
  try {
    data = await api.product.cardVariants({ cardId });
  } catch {
    notFound();
  }

  const { card, variants } = data;

  return (
    <main className="mx-auto grid max-w-4xl gap-8 p-6 md:grid-cols-2">
      <div>
        {card.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={card.imageUrl} alt={card.name} className="w-full" />
        ) : null}
      </div>
      <div>
        <Link href="/shop" className="text-sm underline">
          ← Back to shop
        </Link>
        <h1 className="mt-2 text-3xl font-bold">{card.name}</h1>
        <div className="mt-1 text-sm text-gray-600">
          {card.set.era.name} · {card.set.name} · #{card.number}
          {card.rarity ? ` · ${card.rarity}` : ""}
        </div>
        <div className="mt-1 text-sm text-gray-600">
          Illustrated by {card.artist.name}
        </div>

        <div className="mt-6">
          <h2 className="mb-3 font-semibold">Available</h2>
          {variants.length === 0 ? (
            <div className="text-gray-500">No variants in stock right now.</div>
          ) : (
            <CardVariantPicker
              card={{ name: card.name, imageUrl: card.imageUrl }}
              variants={variants.map((v) => ({
                id: v.id,
                type: v.type,
                priceCents: v.priceCents,
                quantity: v.quantity,
                condition: v.condition ?? null,
                gradingCompany: v.gradingCompany ?? null,
                grade: v.grade?.toString() ?? null,
                certNumber: v.certNumber ?? null,
                imageUrl: v.imageUrl ?? null,
              }))}
            />
          )}
        </div>
      </div>
    </main>
  );
}
