import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SealedAddToCart } from "~/app/sealed/[productId]/SealedAddToCart";
import { formatCents } from "~/lib/format";
import { db } from "~/server/db";
import { api } from "~/trpc/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  const { productId } = await params;
  const p = await db.product.findUnique({
    where: { id: productId },
    select: { name: true, imageUrl: true, description: true },
  });
  if (!p) return { title: "Sealed product · PokeHub" };
  return {
    title: `${p.name ?? "Sealed product"} · PokeHub`,
    description: p.description ?? `Buy ${p.name} sealed at PokeHub.`,
    openGraph: {
      title: p.name ?? "Sealed product",
      images: p.imageUrl ? [{ url: p.imageUrl }] : [],
    },
  };
}

export default async function SealedDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  let product;
  try {
    product = await api.product.sealedDetail({ id: productId });
  } catch {
    notFound();
  }

  return (
    <main className="mx-auto grid max-w-4xl gap-8 p-6 md:grid-cols-2">
      <div>
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name ?? ""}
            className="w-full"
          />
        ) : (
          <div className="aspect-square bg-gray-100" />
        )}
      </div>
      <div>
        <Link href="/shop" className="text-sm underline">
          ← Back to shop
        </Link>
        <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
        <div className="mt-1 text-sm text-gray-600">
          {product.sealedType}
          {product.region ? ` · ${product.region}` : ""}
          {product.releaseDate
            ? ` · Released ${new Date(product.releaseDate).toLocaleDateString()}`
            : ""}
        </div>
        {product.description ? (
          <p className="mt-4 text-gray-700">{product.description}</p>
        ) : null}

        <div className="mt-6 flex items-center justify-between">
          <div className="text-3xl font-bold">
            {formatCents(product.priceCents)}
          </div>
          <div className="text-sm text-gray-600">
            {product.quantity} in stock
          </div>
        </div>

        <SealedAddToCart
          product={{
            id: product.id,
            name: product.name ?? "Sealed product",
            sealedType: product.sealedType ?? "",
            priceCents: product.priceCents,
            imageUrl: product.imageUrl,
            quantity: product.quantity,
          }}
        />
      </div>
    </main>
  );
}
