import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { CardVariantPicker } from "~/app/cards/[cardId]/CardVariantPicker";
import { api } from "~/trpc/server";

export const revalidate = 60;

const getCardData = cache(async (cardId: string) => {
  try {
    return await api.product.cardVariants({ cardId });
  } catch {
    return null;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cardId: string }>;
}): Promise<Metadata> {
  const { cardId } = await params;
  const data = await getCardData(cardId);
  if (!data) return { title: "Card · PokeHub" };
  const { card } = data;
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
  const data = await getCardData(cardId);
  if (!data) notFound();

  const { card, variants } = data;

  return (
    <main className="mx-auto grid max-w-4xl gap-8 p-6 md:grid-cols-2">
      <div>
        {card.imageUrl ? (
          <div className="relative aspect-[5/7] w-full">
            <Image
              src={card.imageUrl}
              alt={card.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
              className="object-contain"
            />
          </div>
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
