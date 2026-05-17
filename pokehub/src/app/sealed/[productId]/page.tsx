import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { Pill } from "~/app/_components/editorial/placeholders";
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

  const releaseDate = product.releaseDate
    ? new Date(product.releaseDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div
        style={{
          padding: "20px 32px 0",
          fontSize: 12,
          color: "var(--ink-mute)",
        }}
      >
        <Link
          href="/shop"
          style={{ color: "var(--ink-mute)", textDecoration: "none" }}
        >
          Shop
        </Link>{" "}
        / <span>Sealed</span> /{" "}
        <span style={{ color: "var(--ink)" }}>{product.name}</span>
      </div>
      <div
        style={{
          padding: "20px 32px 56px",
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 56,
        }}
        className="sealed-detail-grid"
      >
        <div>
          <div
            style={{
              background: "var(--bg-alt)",
              borderRadius: 8,
              padding: 48,
              display: "grid",
              placeItems: "center",
              aspectRatio: "5/4",
              position: "relative",
            }}
          >
            {product.imageUrl ? (
              <div
                style={{
                  position: "relative",
                  width: "70%",
                  height: "85%",
                  filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.25))",
                }}
              >
                <Image
                  src={product.imageUrl}
                  alt={product.name ?? ""}
                  fill
                  sizes="(min-width: 768px) 40vw, 80vw"
                  priority
                  style={{ objectFit: "contain" }}
                />
              </div>
            ) : null}
          </div>
        </div>
        <div>
          {product.sealedType ? <Pill>{product.sealedType}</Pill> : null}
          <h1
            className="serif"
            style={{
              fontSize: 52,
              fontWeight: 500,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
              margin: "12px 0 12px",
            }}
          >
            {product.name}
          </h1>
          <div style={{ fontSize: 14, color: "var(--ink-soft)" }}>
            {[
              releaseDate ? `Released ${releaseDate}` : null,
              product.region ? `${product.region} print` : null,
              product.sealedType,
            ]
              .filter(Boolean)
              .join(" · ")}
          </div>
          {product.description ? (
            <p
              style={{
                marginTop: 18,
                fontSize: 15,
                lineHeight: 1.7,
                color: "var(--ink-soft)",
                maxWidth: 480,
              }}
            >
              {product.description}
            </p>
          ) : null}

          <div
            style={{
              marginTop: 28,
              padding: 20,
              background: "var(--paper)",
              border: "1px solid var(--line)",
              borderRadius: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                className="serif num"
                style={{
                  fontSize: 42,
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                }}
              >
                {formatCents(product.priceCents)}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--positive)",
                  marginTop: 2,
                }}
              >
                Free shipping on orders $50+
              </div>
            </div>
            <div
              style={{
                textAlign: "right",
                fontSize: 12,
                color: "var(--ink-mute)",
              }}
            >
              <div className="eyebrow" style={{ fontSize: 10 }}>
                Supply
              </div>
              <div
                className="serif"
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: "var(--ink)",
                  marginTop: 4,
                }}
              >
                {product.quantity} in stock
              </div>
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
      </div>
    </div>
  );
}
