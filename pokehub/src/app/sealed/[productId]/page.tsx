import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { SealedAddToCart } from "~/app/sealed/[productId]/SealedAddToCart";
import { formatCents } from "~/lib/format";
import { api } from "~/trpc/server";

export const revalidate = 60;

const getSealedProduct = cache(async (id: string) => {
  try {
    return await api.product.sealedDetail({ id });
  } catch {
    return null;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  const { productId } = await params;
  const p = await getSealedProduct(productId);
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
  const product = await getSealedProduct(productId);
  if (!product) notFound();

  return (
    <main className="mx-auto grid max-w-4xl gap-8 p-6 md:grid-cols-2">
      <div>
        {product.imageUrl ? (
          <div className="relative aspect-square w-full">
            <Image
              src={product.imageUrl}
              alt={product.name ?? ""}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
              className="object-contain"
            />
          </div>
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
