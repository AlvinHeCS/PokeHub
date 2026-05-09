import Link from "next/link";

import { formatCents } from "~/lib/format";
import { api, HydrateClient } from "~/trpc/server";

export const metadata = {
  title: "Shop · PokeHub",
};

export default async function ShopPage() {
  const data = await api.product.shop({ limit: 60 });

  return (
    <HydrateClient>
      <main className="mx-auto max-w-6xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Shop</h1>
          <Link href="/" className="text-sm underline">
            Home
          </Link>
        </div>

        {data.cards.length === 0 && data.sealed.length === 0 ? (
          <div className="text-gray-500">Nothing in stock yet.</div>
        ) : null}

        {data.cards.length > 0 ? (
          <section className="mb-10">
            <h2 className="mb-3 text-lg font-semibold">Singles</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {data.cards.map(({ card, fromPriceCents }) => (
                <Link
                  key={card.id}
                  href={`/cards/${card.id}`}
                  className="rounded border p-3 hover:bg-gray-50"
                >
                  {card.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={card.imageUrl}
                      alt={card.name}
                      className="mb-2 aspect-[5/7] w-full object-contain"
                    />
                  ) : (
                    <div className="mb-2 aspect-[5/7] bg-gray-100" />
                  )}
                  <div className="truncate text-sm font-medium">
                    {card.name}
                  </div>
                  <div className="truncate text-xs text-gray-600">
                    {card.set.name} · #{card.number}
                  </div>
                  <div className="mt-1 text-sm font-semibold">
                    from {formatCents(fromPriceCents)}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {data.sealed.length > 0 ? (
          <section>
            <h2 className="mb-3 text-lg font-semibold">Sealed</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {data.sealed.map((p) => (
                <Link
                  key={p.id}
                  href={`/sealed/${p.id}`}
                  className="rounded border p-3 hover:bg-gray-50"
                >
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.imageUrl}
                      alt={p.name ?? ""}
                      className="mb-2 aspect-square w-full object-contain"
                    />
                  ) : (
                    <div className="mb-2 aspect-square bg-gray-100" />
                  )}
                  <div className="truncate text-sm font-medium">{p.name}</div>
                  <div className="truncate text-xs text-gray-600">
                    {p.sealedType}
                  </div>
                  <div className="mt-1 text-sm font-semibold">
                    {formatCents(p.priceCents)}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </HydrateClient>
  );
}
