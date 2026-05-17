/* PokéHub — Editorial direction · catalog + clean card placeholders.
 * Ported verbatim from the editorial redesign bundle. Inline styles + CSS
 * variables from edit-tokens.css are intentional — see Q2 of the design
 * grill. Future PRs will rewrite to Tailwind utilities if it ever helps. */

import type { CSSProperties, ReactNode } from "react";

// ------- Catalog -------
export interface TypeStyle {
  hex: string;
  ink: string;
  accent: string;
}

export const TYPES: Record<string, TypeStyle> = {
  Grass: { hex: "#6a8a4a", ink: "#1a2814", accent: "var(--moss)" },
  Fire: { hex: "#c8632a", ink: "#3a1408", accent: "var(--terra)" },
  Water: { hex: "#3a6a9a", ink: "#10204a", accent: "var(--slate)" },
  Bolt: { hex: "#d4a456", ink: "#3a2a08", accent: "var(--gold)" },
  Rock: { hex: "#8a6a4a", ink: "#2a1f06", accent: "#8a6a4a" },
  Psy: { hex: "#9a5a82", ink: "#3a1428", accent: "var(--plum)" },
  Bug: { hex: "#8a9a3a", ink: "#222a06", accent: "var(--moss)" },
  Ice: { hex: "#7aa8b8", ink: "#10282a", accent: "var(--slate)" },
};

export interface PlaceholderCard {
  id: string;
  name: string;
  number: string;
  type: keyof typeof TYPES;
  hp: number;
  set: string;
  setId: string;
  rarity: string;
  artist: string;
  foil: "NONE" | "HOLO" | "REVERSE" | "FULL" | "LEGEND";
  era: string;
}

export const CARDS: PlaceholderCard[] = [
  {
    id: "tide-101",
    name: "Brineterra",
    number: "012",
    type: "Water",
    hp: 110,
    set: "Tides of Ember",
    setId: "TOE",
    rarity: "Holo Rare",
    artist: "Y. Ohara",
    foil: "HOLO",
    era: "Scarlet Era",
  },
  {
    id: "ember-43",
    name: "Cinderfox",
    number: "043",
    type: "Fire",
    hp: 90,
    set: "Tides of Ember",
    setId: "TOE",
    rarity: "Rare",
    artist: "M. Lindgren",
    foil: "REVERSE",
    era: "Scarlet Era",
  },
  {
    id: "grove-7",
    name: "Fernling",
    number: "007",
    type: "Grass",
    hp: 60,
    set: "Quietwood",
    setId: "QWD",
    rarity: "Common",
    artist: "K. Vesna",
    foil: "NONE",
    era: "Sword Era",
  },
  {
    id: "dusk-211",
    name: "Glowbat",
    number: "211",
    type: "Psy",
    hp: 70,
    set: "Hollowveil",
    setId: "HLV",
    rarity: "Uncommon",
    artist: "J. Park",
    foil: "HOLO",
    era: "Sword Era",
  },
  {
    id: "spark-58",
    name: "Tinkersprite",
    number: "058",
    type: "Bolt",
    hp: 80,
    set: "Voltflux",
    setId: "VFX",
    rarity: "Holo Rare",
    artist: "S. Halim",
    foil: "FULL",
    era: "Scarlet Era",
  },
  {
    id: "stone-12",
    name: "Mossback",
    number: "112",
    type: "Rock",
    hp: 140,
    set: "Quietwood",
    setId: "QWD",
    rarity: "Rare EX",
    artist: "R. Acosta",
    foil: "FULL",
    era: "Sword Era",
  },
  {
    id: "grove-99",
    name: "Velvethorn",
    number: "099",
    type: "Grass",
    hp: 130,
    set: "Tides of Ember",
    setId: "TOE",
    rarity: "Illustration",
    artist: "L. Bremner",
    foil: "LEGEND",
    era: "Scarlet Era",
  },
  {
    id: "reef-22",
    name: "Coralfang",
    number: "022",
    type: "Water",
    hp: 100,
    set: "Tides of Ember",
    setId: "TOE",
    rarity: "Holo Rare",
    artist: "Y. Ohara",
    foil: "HOLO",
    era: "Scarlet Era",
  },
  {
    id: "frost-3",
    name: "Snowmite",
    number: "003",
    type: "Ice",
    hp: 50,
    set: "Hollowveil",
    setId: "HLV",
    rarity: "Common",
    artist: "T. Vega",
    foil: "NONE",
    era: "Sword Era",
  },
  {
    id: "ember-77",
    name: "Pyremaul",
    number: "077",
    type: "Fire",
    hp: 170,
    set: "Voltflux",
    setId: "VFX",
    rarity: "Hyper Rare",
    artist: "R. Acosta",
    foil: "LEGEND",
    era: "Scarlet Era",
  },
];

export interface PlaceholderSealed {
  id: string;
  name: string;
  type: string;
  set: string;
  price: number;
  region: string;
  released: string;
}

export const SEALED: PlaceholderSealed[] = [
  {
    id: "etb-toe",
    name: "Tides of Ember — Elite Trainer Box",
    type: "Elite Trainer Box",
    set: "TOE",
    price: 5499,
    region: "USA",
    released: "2025-09-12",
  },
  {
    id: "bb-toe",
    name: "Tides of Ember — Booster Box",
    type: "Booster Box",
    set: "TOE",
    price: 14999,
    region: "USA",
    released: "2025-09-12",
  },
  {
    id: "etb-hlv",
    name: "Hollowveil — Elite Trainer Box",
    type: "Elite Trainer Box",
    set: "HLV",
    price: 5299,
    region: "USA",
    released: "2024-11-04",
  },
  {
    id: "bb-vfx",
    name: "Voltflux — Booster Box",
    type: "Booster Box",
    set: "VFX",
    price: 13999,
    region: "USA",
    released: "2025-03-21",
  },
  {
    id: "upc-toe",
    name: "Tides of Ember — Premium Collection",
    type: "Premium Collection",
    set: "TOE",
    price: 11999,
    region: "USA",
    released: "2025-09-26",
  },
  {
    id: "tin-vfx",
    name: "Voltflux — Tin (Tinkersprite)",
    type: "Tin",
    set: "VFX",
    price: 2299,
    region: "USA",
    released: "2025-04-10",
  },
];

export function fmt(c: number): string {
  return "$" + (c / 100).toFixed(2);
}

// ------- Minimal icons (1.5 stroke, square caps) -------
export const I = {
  search: "M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16ZM21 21l-4.3-4.3",
  bag: ["M6 7h12l-1 13H7L6 7Z", "M9 7V5a3 3 0 0 1 6 0v2"],
  user: ["M4 21a8 8 0 0 1 16 0", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"],
  filter: "M4 5h16M7 12h10M10 19h4",
  heart: "M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9Z",
  star: "M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7l3-7Z",
  arrowR: "M5 12h14M13 6l6 6-6 6",
  arrowL: "M19 12H5M11 6l-6 6 6 6",
  chev: "M9 6l6 6-6 6",
  chevD: "M6 9l6 6 6-6",
  check: "M5 12l5 5L20 7",
  x: "M6 6l12 12M18 6L6 18",
  plus: "M12 5v14M5 12h14",
  shield: ["M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4Z", "M9 12l2 2 4-4"],
  truck: [
    "M3 7h11v9H3z",
    "M14 11h4l3 3v2h-7",
    "M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
    "M17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  ],
  refresh: [
    "M3 12a9 9 0 0 1 15-6.7L21 8",
    "M21 3v5h-5",
    "M21 12a9 9 0 0 1-15 6.7L3 16",
    "M3 21v-5h5",
  ],
  external: ["M14 3h7v7", "M21 3l-9 9", "M5 7v12h12V13"],
  trash: ["M4 7h16", "M9 7V4h6v3", "M6 7l1 13h10l1-13"],
  pin: [
    "M12 22s-7-7.5-7-13a7 7 0 0 1 14 0c0 5.5-7 13-7 13Z",
    "M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  ],
  spark: [
    "M12 3v4",
    "M12 17v4",
    "M3 12h4",
    "M17 12h4",
    "M5.5 5.5l2.5 2.5",
    "M16 16l2.5 2.5",
    "M5.5 18.5L8 16",
    "M16 8l2.5-2.5",
  ],
} as const;

export type IconPath = string | readonly string[];

export function Icon({
  d,
  size = 16,
  stroke = 1.5,
  color,
}: {
  d: IconPath;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const paths: readonly string[] = Array.isArray(d) ? d : [d];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color ?? "currentColor"}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        flexShrink: 0,
      }}
    >
      {paths.map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  );
}

// ------- Card placeholder — clean editorial card art -------
export function CardArt({
  card,
  full = false,
}: {
  card: PlaceholderCard;
  full?: boolean;
}) {
  const t = TYPES[card.type]!;
  const isLegend =
    card.rarity === "Hyper Rare" ||
    card.rarity === "Illustration" ||
    card.foil === "LEGEND";
  const monogram = card.name[0];

  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "63 / 88",
        borderRadius: full ? 14 : 6,
        overflow: "hidden",
        background: `linear-gradient(155deg, ${t.hex} 0%, ${t.ink} 100%)`,
        boxShadow: full
          ? "0 30px 60px -20px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06) inset"
          : "0 2px 8px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
      }}
    >
      {isLegend && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.18) 45%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          inset: full ? 14 : 6,
          border: "1px solid rgba(255,255,255,0.22)",
          borderRadius: full ? 8 : 3,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: full ? 22 : 10,
          left: full ? 22 : 10,
          right: full ? 22 : 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          color: "rgba(255,255,255,0.95)",
        }}
      >
        <div>
          <div
            className="serif"
            style={{
              fontSize: full ? 26 : 11,
              lineHeight: 1.05,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            {card.name}
          </div>
          {full && (
            <div
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.12em",
                marginTop: 6,
                opacity: 0.75,
                textTransform: "uppercase",
              }}
            >
              {card.type} · Lvl {Math.floor((card.hp || 60) / 3)}
            </div>
          )}
        </div>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: full ? 11 : 6,
            fontWeight: 600,
            padding: full ? "3px 7px" : "1px 3px",
            background: "rgba(0,0,0,0.25)",
            borderRadius: 2,
            letterSpacing: "0.08em",
          }}
        >
          {card.hp}HP
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontSize: full ? 220 : 88,
            lineHeight: 1,
            fontWeight: 400,
            color: "rgba(255,255,255,0.15)",
            letterSpacing: "-0.04em",
            transform: full ? "translateY(-4%)" : "translateY(-2%)",
          }}
        >
          {monogram}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: "-50%",
          right: "-50%",
          top: "55%",
          height: full ? 180 : 60,
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: full ? 22 : 10,
          left: full ? 22 : 10,
          right: full ? 22 : 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          color: "rgba(255,255,255,0.85)",
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: full ? 11 : 6,
            letterSpacing: "0.08em",
            opacity: 0.8,
          }}
        >
          {card.setId} · {card.number}
        </div>
        <div
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontSize: full ? 14 : 7,
            color: isLegend
              ? "rgba(255,224,150,0.95)"
              : "rgba(255,255,255,0.7)",
          }}
        >
          {isLegend ? "★ " : ""}
          {card.rarity}
        </div>
      </div>
    </div>
  );
}

// Slab — graded card in clean PSA-style holder
export function Slab({
  card,
  grade = 10,
  company = "PSA",
  small = false,
}: {
  card: PlaceholderCard;
  grade?: number;
  company?: "PSA" | "BGS" | "CGC" | "SGC";
  small?: boolean;
}) {
  const stripeColor =
    company === "PSA" ? "#b8202a" : company === "BGS" ? "#1a3a8a" : "#0a6a3b";
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "63 / 100",
        background: "linear-gradient(180deg, #fafafa 0%, #ededed 100%)",
        border: "1px solid rgba(0,0,0,0.12)",
        borderRadius: small ? 2 : 4,
        padding: small ? "5px 6px" : "10px 12px",
        boxShadow: "0 6px 20px -8px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        gap: small ? 5 : 8,
      }}
    >
      <div
        style={{
          background: stripeColor,
          color: "#fff",
          textAlign: "center",
          padding: small ? "3px 4px" : "6px 8px",
          borderRadius: 2,
          fontFamily: "var(--mono)",
          fontWeight: 700,
        }}
      >
        <div style={{ fontSize: small ? 6 : 9, letterSpacing: "0.18em" }}>
          {company}
        </div>
        <div
          style={{
            fontSize: small ? 8 : 12,
            letterSpacing: "0.1em",
            marginTop: 1,
            opacity: 0.95,
          }}
        >
          {card.name.toUpperCase()}
        </div>
        <div
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontSize: small ? 14 : 22,
            lineHeight: 1,
            marginTop: 3,
            letterSpacing: "0.02em",
          }}
        >
          GEM MINT {grade}
        </div>
      </div>
      <div style={{ flex: 1, padding: small ? 0 : 2 }}>
        <CardArt card={card} />
      </div>
      <div
        className="mono"
        style={{
          textAlign: "center",
          fontSize: small ? 5 : 8,
          color: "rgba(0,0,0,0.5)",
          letterSpacing: "0.15em",
        }}
      >
        CERT{" "}
        {Math.floor(
          40000000 +
            (((parseInt(card.id.split("-")[1] ?? "0", 10) || 0) * 12345) %
              9999999),
        )}
      </div>
    </div>
  );
}

// Sealed box — clean wrapped product
export function SealedBox({
  product,
  small = false,
}: {
  product: PlaceholderSealed;
  small?: boolean;
}) {
  const palettes: Record<string, { a: string; b: string; hi: string }> = {
    TOE: { a: "#1a2a4a", b: "#c85838", hi: "#e8a456" },
    HLV: { a: "#2a1a4a", b: "#7a4aa8", hi: "#c8a4d8" },
    QWD: { a: "#1a3a14", b: "#5a8a3a", hi: "#a8c878" },
    VFX: { a: "#3a2a0a", b: "#c8a456", hi: "#f0d488" },
  };
  const p = palettes[product.set] ?? palettes.TOE!;
  const ratio = product.type.includes("Tin") ? "1 / 1" : "5 / 4";
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: ratio,
        borderRadius: small ? 3 : 6,
        overflow: "hidden",
        background: `linear-gradient(140deg, ${p.a} 0%, ${p.b} 70%, ${p.hi} 100%)`,
        boxShadow: small
          ? "0 2px 8px rgba(0,0,0,0.12)"
          : "0 8px 20px -8px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.06)",
        color: "#fff",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(120deg, transparent 35%, rgba(255,255,255,0.16) 50%, transparent 65%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: small ? 8 : 16,
          left: small ? 10 : 18,
          right: small ? 10 : 18,
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: small ? 6 : 9,
            letterSpacing: "0.2em",
            opacity: 0.7,
            textTransform: "uppercase",
          }}
        >
          PokéHub · {product.set}
        </div>
        <div
          className="serif"
          style={{
            fontSize: small ? 12 : 22,
            lineHeight: 1.05,
            fontWeight: 600,
            letterSpacing: "-0.015em",
            marginTop: small ? 3 : 6,
            textShadow: "0 2px 8px rgba(0,0,0,0.25)",
          }}
        >
          {product.name.split("—")[0]?.trim()}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          width={small ? 36 : 80}
          height={small ? 36 : 80}
          style={{ opacity: 0.7 }}
        >
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
          />
          <circle cx="50" cy="50" r="22" fill="rgba(255,255,255,0.08)" />
          <path
            d="M50 20 L60 50 L50 80 L40 50 Z"
            fill="rgba(255,255,255,0.5)"
          />
        </svg>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: small ? 8 : 16,
          left: small ? 10 : 18,
          right: small ? 10 : 18,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <span
          style={{
            fontSize: small ? 8 : 12,
            fontWeight: 600,
            letterSpacing: "0.02em",
          }}
        >
          {product.type}
        </span>
        <span
          className="mono"
          style={{ fontSize: small ? 6 : 10, opacity: 0.7 }}
        >
          {product.region}
        </span>
      </div>
    </div>
  );
}

// Type pill — subtle, sophisticated
export function TypePill({
  type,
  size = "md",
}: {
  type: keyof typeof TYPES;
  size?: "sm" | "md";
}) {
  const t = TYPES[type]!;
  const small = size === "sm";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: small ? 5 : 6,
        padding: small ? "2px 8px" : "3px 10px",
        background: "transparent",
        color: t.hex,
        border: `1px solid ${t.hex}`,
        borderRadius: 999,
        fontSize: small ? 10 : 11,
        fontWeight: 500,
        letterSpacing: "0.06em",
      }}
    >
      <span
        style={{
          width: small ? 5 : 6,
          height: small ? 5 : 6,
          background: t.hex,
          borderRadius: 999,
        }}
      />
      {type.toUpperCase()}
    </span>
  );
}

export function Pill({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <span className="pill" style={style}>
      {children}
    </span>
  );
}
