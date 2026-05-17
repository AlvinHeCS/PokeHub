import { HomeDesktop } from "~/app/_components/editorial/HomeDesktop";
import { HomeMobile } from "~/app/_components/editorial/HomeMobile";
import type {
  ShopCard,
  ShopSealed,
} from "~/app/_components/editorial/ShopLayout";
import { api, HydrateClient } from "~/trpc/server";

export const revalidate = 60;

export default async function Home() {
  const [featured, shopData] = await Promise.all([
    api.product.featured({ limit: 8 }),
    api.product.shop({ limit: 24, type: "sealed" }),
  ]);

  const cards: ShopCard[] = featured.map(({ card, fromPriceCents }) => ({
    id: card.id,
    name: card.name,
    number: card.number,
    setName: card.set.name,
    imageUrl: card.imageUrl,
    fromPriceCents,
  }));
  const sealed: ShopSealed[] = shopData.sealed.map((p) => ({
    id: p.id,
    name: p.name ?? "Sealed product",
    sealedType: p.sealedType ?? "",
    priceCents: p.priceCents,
    imageUrl: p.imageUrl,
  }));

  return (
    <HydrateClient>
      <HomeDesktop cards={cards} sealed={sealed} />
      <HomeMobile cards={cards} sealed={sealed} />
    </HydrateClient>
  );
}
