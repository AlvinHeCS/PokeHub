import Link from "next/link";

import { Footer } from "~/app/_components/editorial/Footer";
import {
  fmt,
  I,
  Icon,
} from "~/app/_components/editorial/placeholders";
import {
  RealCardArt,
  RealSealedFrame,
  RealSlabFrame,
} from "~/app/_components/editorial/RealTiles";
import type {
  ShopCard,
  ShopSealed,
} from "~/app/_components/editorial/ShopLayout";

const ERAS: { name: string; meta: string; a: string; b: string }[] = [
  { name: "Tides of Ember", meta: "TOE · 2025", a: "#1a2a4a", b: "#c85838" },
  { name: "Hollowveil", meta: "HLV · 2024", a: "#2a1a4a", b: "#7a4aa8" },
  { name: "Voltflux", meta: "VFX · 2025", a: "#3a2a0a", b: "#c8a456" },
  { name: "Quietwood", meta: "QWD · 2024", a: "#1a3a14", b: "#5a8a3a" },
  { name: "Stormrise", meta: "STR · 2024", a: "#0a1a2a", b: "#3a6a9a" },
  { name: "Embercrest", meta: "EMC · 2023", a: "#2a0f0a", b: "#a8543a" },
];

const TRUST: [readonly string[] | string, string][] = [
  [I.shield, "Authenticated by hand"],
  [I.truck, "Tracked & insured"],
  [I.refresh, "30-day returns"],
];

const MISSION: { ic: readonly string[] | string; t: string; d: string }[] = [
  {
    ic: I.shield,
    t: "Authenticated by hand",
    d: "Every slab cert is independently looked up. Every raw card is photographed and graded before listing.",
  },
  {
    ic: I.truck,
    t: "Tracked, signed, insured",
    d: "Cards ship in toploaders, team bags, and waterproof mailers. Slabs ship in foam-lined boxes with signature confirmation.",
  },
  {
    ic: I.refresh,
    t: "30-day returns, no drama",
    d: "Receive your card and feel it's not what we described? Send it back within 30 days for a full refund.",
  },
];

export function HomeDesktop({
  cards,
  sealed,
}: {
  cards: ShopCard[];
  sealed: ShopSealed[];
}) {
  const featured = cards[0];
  const heroSide1 = cards[1];
  const heroSide2 = cards[2];
  const featuredSingles = cards.slice(0, 5);
  const slabCards = cards.slice(0, 4);
  const sealedTiles = sealed.slice(0, 3);
  return (
    <div
      style={{ background: "var(--bg)", minHeight: "100%" }}
      className="editorial-desktop-only"
    >
      {/* ===== Hero ===== */}
      <section
        style={{
          padding: "72px 32px 56px",
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 56,
          alignItems: "center",
        }}
      >
        <div>
          <span className="eyebrow">New drop · Tides of Ember</span>
          <h1
            className="serif"
            style={{
              fontSize: 84,
              lineHeight: 0.94,
              fontWeight: 500,
              letterSpacing: "-0.04em",
              margin: "20px 0 20px",
            }}
          >
            Authenticated cards,
            <br />
            <span style={{ fontStyle: "italic", color: "var(--ink-soft)" }}>
              shipped with care.
            </span>
          </h1>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.55,
              color: "var(--ink-soft)",
              maxWidth: 480,
              margin: 0,
            }}
          >
            Raw singles in five condition grades. Graded slabs from PSA, BGS,
            CGC and SGC. Sealed product from every modern set — all in one
            quiet, curated shop.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
            <button
              type="button"
              className="btn"
              style={{ padding: "13px 22px", fontSize: 15 }}
            >
              Browse the shop <Icon d={I.arrowR} size={15} />
            </button>
            <button
              type="button"
              className="btn ghost"
              style={{ padding: "13px 22px", fontSize: 15 }}
            >
              Sell to us
            </button>
          </div>
          <div
            style={{
              display: "flex",
              gap: 28,
              marginTop: 36,
              fontSize: 13,
              color: "var(--ink-soft)",
            }}
          >
            {TRUST.map(([icon, label]) => (
              <span
                key={label}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <Icon d={icon} size={15} color="var(--accent)" /> {label}
              </span>
            ))}
          </div>
        </div>
        <div
          style={{
            position: "relative",
            display: "grid",
            placeItems: "center",
            minHeight: 480,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "5% -10% 5% 5%",
              background:
                "radial-gradient(ellipse at 30% 30%, var(--accent) 0%, var(--accent-dk) 60%, transparent 100%)",
              opacity: 0.12,
              borderRadius: 40,
            }}
          />
          {featured ? (
            <div
              style={{
                width: 300,
                transform: "rotate(-5deg)",
                filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.2))",
              }}
            >
              <RealCardArt
                imageUrl={featured.imageUrl}
                alt={featured.name}
                full
              />
            </div>
          ) : null}
          {heroSide1 ? (
            <div
              style={{
                position: "absolute",
                top: 10,
                right: 20,
                width: 160,
                transform: "rotate(8deg)",
                opacity: 0.95,
                filter: "drop-shadow(0 16px 30px rgba(0,0,0,0.18))",
              }}
            >
              <RealCardArt
                imageUrl={heroSide1.imageUrl}
                alt={heroSide1.name}
              />
            </div>
          ) : null}
          {heroSide2 ? (
            <div
              style={{
                position: "absolute",
                bottom: 30,
                left: 10,
                width: 150,
                transform: "rotate(-13deg)",
                opacity: 0.9,
                filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.15))",
              }}
            >
              <RealCardArt
                imageUrl={heroSide2.imageUrl}
                alt={heroSide2.name}
              />
            </div>
          ) : null}
        </div>
      </section>

      {/* ===== Featured singles ===== */}
      <section style={{ padding: "32px 32px 56px" }}>
        <div className="hairline" />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            margin: "36px 0 28px",
          }}
        >
          <div>
            <span className="eyebrow">Trending now</span>
            <h2
              className="serif"
              style={{
                fontSize: 36,
                fontWeight: 500,
                letterSpacing: "-0.03em",
                margin: "8px 0 0",
              }}
            >
              Featured singles
            </h2>
          </div>
          <a
            style={{
              fontSize: 13,
              color: "var(--ink-soft)",
              textDecoration: "none",
            }}
          >
            View all 1,247 →
          </a>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 28,
          }}
        >
          {featuredSingles.map((c) => (
            <ProductTile key={c.id} card={c} />
          ))}
        </div>
      </section>

      {/* ===== Sets / Eras ===== */}
      <section
        style={{
          padding: "32px 32px 48px",
          background: "var(--bg-alt)",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            margin: "28px 0 28px",
          }}
        >
          <div>
            <span className="eyebrow">By Era</span>
            <h2
              className="serif"
              style={{
                fontSize: 36,
                fontWeight: 500,
                letterSpacing: "-0.03em",
                margin: "8px 0 0",
              }}
            >
              Explore the catalog
            </h2>
          </div>
          <a
            style={{
              fontSize: 13,
              color: "var(--ink-soft)",
              textDecoration: "none",
            }}
          >
            All 412 sets →
          </a>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 16,
          }}
        >
          {ERAS.map((s) => (
            <div
              key={s.name}
              style={{
                aspectRatio: "5 / 6",
                borderRadius: 6,
                background: `linear-gradient(160deg, ${s.a} 0%, ${s.b} 100%)`,
                padding: 18,
                color: "#fff",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
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
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  opacity: 0.75,
                  position: "relative",
                }}
              >
                {s.meta}
              </div>
              <div style={{ position: "relative" }}>
                <div
                  className="serif"
                  style={{
                    fontSize: 22,
                    fontWeight: 500,
                    lineHeight: 1.05,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.name}
                </div>
                <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>
                  178 cards in stock
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Graded slabs ===== */}
      <section
        style={{
          padding: "56px 32px",
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: 48,
          alignItems: "center",
        }}
      >
        <div>
          <span className="eyebrow" style={{ color: "var(--accent-dk)" }}>
            The Vault
          </span>
          <h2
            className="serif"
            style={{
              fontSize: 44,
              fontWeight: 500,
              letterSpacing: "-0.03em",
              lineHeight: 1.02,
              margin: "12px 0 16px",
            }}
          >
            Graded slabs,
            <br />
            <span style={{ fontStyle: "italic" }}>cert-verified.</span>
          </h2>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.65,
              color: "var(--ink-soft)",
              marginBottom: 28,
            }}
          >
            Slabs from PSA, BGS, CGC and SGC. Each cert is independently
            verified before listing and again before ship. Crystal-locked
            storage in our climate-controlled vault.
          </p>
          <button type="button" className="btn ghost">
            Browse 312 slabs
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 18,
          }}
        >
          {slabCards.map((c, i) => {
            const grade = [10, 9, 10, 8.5][i]!;
            const company = (["PSA", "BGS", "PSA", "CGC"] as const)[i]!;
            const label = ["PSA 10", "BGS 9", "PSA 10", "CGC 8.5"][i]!;
            return (
              <Link
                key={c.id}
                href={`/cards/${c.id}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  textDecoration: "none",
                  color: "var(--ink)",
                }}
              >
                <RealSlabFrame
                  imageUrl={c.imageUrl}
                  alt={c.name}
                  name={c.name}
                  grade={grade}
                  company={company}
                  small
                />
                <div style={{ fontSize: 12 }}>
                  <div style={{ fontWeight: 500 }}>{c.name}</div>
                  <div
                    className="mono"
                    style={{
                      color: "var(--ink-mute)",
                      fontSize: 10,
                      marginTop: 2,
                    }}
                  >
                    {label} · {c.setName}
                  </div>
                  <div
                    className="serif num"
                    style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}
                  >
                    {fmt(c.fromPriceCents + i * 4200)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===== Sealed banner ===== */}
      <section
        style={{
          background: "var(--ink)",
          color: "var(--bg)",
          padding: "64px 32px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: 56,
            alignItems: "center",
          }}
        >
          <div>
            <span className="eyebrow" style={{ color: "var(--accent-hi)" }}>
              Sealed product
            </span>
            <h2
              className="serif"
              style={{
                fontSize: 48,
                fontWeight: 500,
                letterSpacing: "-0.03em",
                lineHeight: 1.02,
                margin: "12px 0 18px",
                color: "var(--bg)",
              }}
            >
              Booster boxes and ETBs,
              <br />
              <span style={{ fontStyle: "italic", color: "var(--accent-hi)" }}>
                case-fresh seals.
              </span>
            </h2>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.7)",
                marginBottom: 28,
                maxWidth: 440,
              }}
            >
              Every sealed item is stored in a climate-controlled vault and
              photographed before it ships. Every seal verified against
              case-mate batch records.
            </p>
            <button type="button" className="btn accent">
              Shop 86 sealed →
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 18,
            }}
          >
            {sealedTiles.map((s) => (
              <Link
                key={s.id}
                href={`/sealed/${s.id}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  textDecoration: "none",
                }}
              >
                <RealSealedFrame imageUrl={s.imageUrl} alt={s.name} />
                <div style={{ fontSize: 12 }}>
                  <div style={{ fontWeight: 500, color: "var(--bg)" }}>
                    {s.name.split("—")[0]?.trim()}
                  </div>
                  <div
                    className="mono"
                    style={{
                      color: "rgba(255,255,255,0.55)",
                      fontSize: 10,
                      marginTop: 2,
                    }}
                  >
                    {s.sealedType}
                  </div>
                  <div
                    className="serif num"
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      marginTop: 4,
                      color: "var(--accent-hi)",
                    }}
                  >
                    {fmt(s.priceCents)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Mission ===== */}
      <section style={{ padding: "72px 32px 56px", textAlign: "center" }}>
        <span className="eyebrow">Why PokéHub</span>
        <h2
          className="serif"
          style={{
            fontSize: 40,
            fontWeight: 500,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            margin: "16px auto 22px",
            maxWidth: 640,
          }}
        >
          Built by collectors, for collectors who hate guessing.
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 28,
            marginTop: 48,
            maxWidth: 1000,
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "left",
          }}
        >
          {MISSION.map((b) => (
            <div key={b.t}>
              <Icon d={b.ic} size={28} color="var(--accent)" stroke={1.4} />
              <div
                className="serif"
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  letterSpacing: "-0.02em",
                  margin: "14px 0 8px",
                }}
              >
                {b.t}
              </div>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: "var(--ink-soft)",
                  margin: 0,
                }}
              >
                {b.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ProductTile({ card }: { card: ShopCard }) {
  return (
    <Link
      href={`/cards/${card.id}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        textDecoration: "none",
        color: "var(--ink)",
      }}
    >
      <div style={{ position: "relative" }}>
        <RealCardArt imageUrl={card.imageUrl} alt={card.name} />
        <button
          type="button"
          aria-label="Save"
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 30,
            height: 30,
            borderRadius: 999,
            background: "rgba(255,255,255,0.92)",
            border: 0,
            color: "var(--ink)",
            display: "grid",
            placeItems: "center",
            backdropFilter: "blur(4px)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
            cursor: "pointer",
          }}
        >
          <Icon d={I.heart} size={14} />
        </button>
      </div>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 8,
          }}
        >
          <span
            className="serif"
            style={{
              fontSize: 17,
              fontWeight: 500,
              letterSpacing: "-0.015em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {card.name}
          </span>
          <span
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--ink-mute)",
              flexShrink: 0,
            }}
          >
            #{card.number}
          </span>
        </div>
        <div
          style={{
            fontSize: 11,
            color: "var(--ink-mute)",
            marginTop: 4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {card.setName}
        </div>
        <div
          style={{
            marginTop: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <span
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--ink-mute)",
              letterSpacing: "0.06em",
            }}
          >
            FROM
          </span>
          <span className="serif num" style={{ fontSize: 18, fontWeight: 600 }}>
            {fmt(card.fromPriceCents)}
          </span>
        </div>
      </div>
    </Link>
  );
}
