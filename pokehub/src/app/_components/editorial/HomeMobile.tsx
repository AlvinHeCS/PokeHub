import Link from "next/link";

import { fmt } from "~/app/_components/editorial/placeholders";
import { RealCardArt } from "~/app/_components/editorial/RealTiles";
import type { ShopCard, ShopSealed } from "~/app/_components/editorial/ShopLayout";

const SETS: [string, string, string, string][] = [
  ["Tides of Ember", "TOE · 2025", "#1a2a4a", "#c85838"],
  ["Hollowveil", "HLV · 2024", "#2a1a4a", "#7a4aa8"],
  ["Voltflux", "VFX · 2025", "#3a2a0a", "#c8a456"],
  ["Quietwood", "QWD · 2024", "#1a3a14", "#5a8a3a"],
];

export function HomeMobile({
  cards,
  sealed: _sealed,
}: {
  cards: ShopCard[];
  sealed: ShopSealed[];
}) {
  const featured = cards[0];
  const trending = cards.slice(0, 4);
  return (
    <div
      style={{
        background: "var(--bg)",
        minHeight: "100%",
        color: "var(--ink)",
      }}
      className="editorial-mobile-only"
    >
      {/* Hero */}
      <div style={{ padding: "8px 18px 22px" }}>
        <span className="eyebrow" style={{ fontSize: 10 }}>
          New drop · Tides of Ember
        </span>
        <h1
          className="serif"
          style={{
            fontSize: 38,
            fontWeight: 500,
            letterSpacing: "-0.035em",
            lineHeight: 1,
            margin: "10px 0 10px",
          }}
        >
          Authenticated
          <br />
          cards,{" "}
          <span style={{ fontStyle: "italic", color: "var(--ink-soft)" }}>
            shipped with care.
          </span>
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "var(--ink-soft)",
            lineHeight: 1.55,
          }}
        >
          Singles, slabs, and sealed product. Tracked &amp; insured.
        </p>
        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <Link
            href="/shop"
            className="btn"
            style={{
              padding: "12px 16px",
              flex: 1,
              fontSize: 14,
              textAlign: "center",
            }}
          >
            Browse shop
          </Link>
        </div>
      </div>

      {/* Featured hero card */}
      {featured ? (
        <div style={{ padding: "0 18px 22px" }}>
          <div
            style={{
              position: "relative",
              padding: 24,
              background: "var(--bg-alt)",
              borderRadius: 8,
              display: "grid",
              placeItems: "center",
              aspectRatio: "5/6",
            }}
          >
            <div
              style={{
                width: "62%",
                filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.25))",
              }}
            >
              <RealCardArt
                imageUrl={featured.imageUrl}
                alt={featured.name}
                full
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* Sets strip */}
      <div style={{ padding: "0 0 18px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 18px 10px",
          }}
        >
          <span className="eyebrow">By era</span>
          <a style={{ fontSize: 12, color: "var(--ink-soft)" }}>All →</a>
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            padding: "0 18px",
            overflowX: "auto",
          }}
          className="scrollbar-none"
        >
          {SETS.map(([n, m, a, b]) => (
            <div
              key={n}
              style={{
                flex: "0 0 132px",
                aspectRatio: "5/6",
                borderRadius: 6,
                background: `linear-gradient(160deg, ${a} 0%, ${b} 100%)`,
                padding: 12,
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.08) 55%, transparent 70%)",
                }}
              />
              <div
                className="mono"
                style={{
                  position: "relative",
                  fontSize: 9,
                  opacity: 0.75,
                  letterSpacing: "0.12em",
                }}
              >
                {m}
              </div>
              <div
                className="serif"
                style={{
                  position: "relative",
                  fontSize: 16,
                  fontWeight: 500,
                  lineHeight: 1.05,
                }}
              >
                {n}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending */}
      <div style={{ padding: "0 18px 32px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <span className="eyebrow">Trending</span>
          <a style={{ fontSize: 12, color: "var(--ink-soft)" }}>All →</a>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
          }}
        >
          {trending.map((c) => (
            <Link
              key={c.id}
              href={`/cards/${c.id}`}
              style={{ textDecoration: "none", color: "var(--ink)" }}
            >
              <RealCardArt imageUrl={c.imageUrl} alt={c.name} />
              <div style={{ marginTop: 8 }}>
                <div
                  className="serif"
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.name}
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    color: "var(--ink-mute)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.setName}
                </div>
                <div
                  className="serif num"
                  style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}
                >
                  from {fmt(c.fromPriceCents)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
