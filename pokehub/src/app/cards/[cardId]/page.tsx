import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { CardVariantPicker } from "~/app/cards/[cardId]/CardVariantPicker";
import { I, Icon, Pill } from "~/app/_components/editorial/placeholders";
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
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div
        style={{
          padding: "20px 32px 0",
          fontSize: 12,
          color: "var(--ink-mute)",
        }}
        className="card-breadcrumb"
      >
        <Link
          href="/shop"
          style={{ color: "var(--ink-mute)", textDecoration: "none" }}
        >
          Shop
        </Link>{" "}
        / <span>{card.set.era.name}</span> / <span>{card.set.name}</span> /{" "}
        <span style={{ color: "var(--ink)" }}>{card.name}</span>
      </div>
      <div
        style={{
          padding: "20px 32px 56px",
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 56,
        }}
        className="card-detail-grid"
      >
        {/* Hero */}
        <div>
          <div
            style={{
              position: "relative",
              background: "var(--bg-alt)",
              borderRadius: 8,
              padding: "56px 32px",
              overflow: "hidden",
              display: "grid",
              placeItems: "center",
              aspectRatio: "5/6",
            }}
          >
            {card.imageUrl ? (
              <div
                style={{
                  position: "relative",
                  width: "70%",
                  aspectRatio: "63 / 88",
                  filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.3))",
                }}
              >
                <Image
                  src={card.imageUrl}
                  alt={card.name}
                  fill
                  sizes="(min-width: 768px) 40vw, 80vw"
                  priority
                  style={{ objectFit: "contain" }}
                />
              </div>
            ) : null}
            <div
              style={{
                position: "absolute",
                top: 18,
                left: 18,
                display: "flex",
                gap: 8,
              }}
            >
              {card.rarity ? <Pill>{card.rarity}</Pill> : null}
              <Pill>
                {variants.length} variant{variants.length === 1 ? "" : "s"}
              </Pill>
            </div>
          </div>
        </div>

        {/* Variant section */}
        <div>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 14,
            }}
          >
            {card.rarity ? <Pill>{card.rarity}</Pill> : null}
            <Pill>{card.set.name}</Pill>
          </div>
          <h1
            className="serif"
            style={{
              fontSize: 56,
              fontWeight: 500,
              letterSpacing: "-0.035em",
              lineHeight: 1,
              margin: 0,
            }}
          >
            {card.name}
          </h1>
          <div
            style={{
              fontSize: 14,
              color: "var(--ink-soft)",
              marginTop: 12,
            }}
          >
            {card.set.era.name} · {card.set.name} · #{card.number}
            {card.artist ? (
              <>
                {" "}
                · Illustrated by{" "}
                <span style={{ color: "var(--ink)", fontWeight: 500 }}>
                  {card.artist.name}
                </span>
              </>
            ) : null}
          </div>

          <div
            style={{
              marginTop: 20,
              padding: "14px 16px",
              background: "var(--bg-alt)",
              border: "1px solid var(--line-soft)",
              borderRadius: 6,
              display: "flex",
              gap: 22,
              fontSize: 13,
              color: "var(--ink-soft)",
              flexWrap: "wrap",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon d={I.shield} size={14} color="var(--accent)" />{" "}
              Authenticated
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon d={I.truck} size={14} color="var(--accent)" /> Tracked &
              insured
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon d={I.refresh} size={14} color="var(--accent)" /> 30-day
              returns
            </span>
          </div>

          {variants.length === 0 ? (
            <div
              style={{
                marginTop: 22,
                padding: 20,
                border: "1px dashed var(--line)",
                borderRadius: 6,
                color: "var(--ink-mute)",
                fontSize: 13,
              }}
            >
              No variants in stock right now.
            </div>
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
    </div>
  );
}
