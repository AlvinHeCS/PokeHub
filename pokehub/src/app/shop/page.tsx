import {
  ShopDesktop,
  ShopMobile,
  type ShopCard,
  type ShopSealed,
  type ShopType,
} from "~/app/_components/editorial/ShopLayout";
import { api, HydrateClient } from "~/trpc/server";

export const metadata = {
  title: "Shop · PokeHub",
};

export const revalidate = 60;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type: typeParam } = await searchParams;
  const type: ShopType | undefined =
    typeParam === "singles" || typeParam === "graded" || typeParam === "sealed"
      ? typeParam
      : undefined;
  const data = await api.product.shop({ limit: 60, type });

  const cards: ShopCard[] = data.cards.map(({ card, fromPriceCents }) => ({
    id: card.id,
    name: card.name,
    number: card.number,
    setName: card.set.name,
    imageUrl: card.imageUrl,
    fromPriceCents,
  }));
  const sealed: ShopSealed[] = data.sealed.map((p) => ({
    id: p.id,
    name: p.name ?? "Sealed product",
    sealedType: p.sealedType ?? "",
    priceCents: p.priceCents,
    imageUrl: p.imageUrl,
  }));

  return (
    <HydrateClient>
      <ShopDesktop cards={cards} sealed={sealed} type={type} />
      <ShopMobile cards={cards} sealed={sealed} type={type} />
    </HydrateClient>
  );
}
