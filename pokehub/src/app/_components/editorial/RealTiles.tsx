import Image from "next/image";
import Link from "next/link";

import { fmt } from "~/app/_components/editorial/placeholders";

/* Editorial framing around real product photos. The mockup's CardArt is a
 * stylized stand-in for unknown products — in production we want the actual
 * Pokémon card photo inside the same editorial frame language. */

export function RealCardArt({
  imageUrl,
  alt,
  full = false,
}: {
  imageUrl: string | null;
  alt: string;
  full?: boolean;
}) {
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "63 / 88",
        borderRadius: full ? 14 : 6,
        overflow: "hidden",
        background: "var(--paper)",
        boxShadow: full
          ? "0 30px 60px -20px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.04) inset"
          : "0 2px 8px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
      }}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes={full ? "320px" : "(min-width: 1024px) 20vw, 50vw"}
          style={{ objectFit: "contain", padding: full ? 8 : 4 }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--bg-alt)",
          }}
        />
      )}
    </div>
  );
}

export function RealSlabFrame({
  imageUrl,
  alt,
  name,
  grade,
  company,
  small = false,
}: {
  imageUrl: string | null;
  alt: string;
  name: string;
  grade: number;
  company: "PSA" | "BGS" | "CGC" | "SGC";
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
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {name.toUpperCase()}
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
        <RealCardArt imageUrl={imageUrl} alt={alt} />
      </div>
    </div>
  );
}

export function RealSealedFrame({
  imageUrl,
  alt,
  ratio = "5 / 4",
}: {
  imageUrl: string | null;
  alt: string;
  ratio?: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: ratio,
        borderRadius: 6,
        overflow: "hidden",
        background: "var(--paper)",
        boxShadow:
          "0 8px 20px -8px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.06)",
      }}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          style={{ objectFit: "contain", padding: 14 }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--bg-alt)",
          }}
        />
      )}
    </div>
  );
}

export function RealCardTile({
  href,
  name,
  setName,
  number,
  imageUrl,
  fromPriceCents,
}: {
  href: string;
  name: string;
  setName: string;
  number: string;
  imageUrl: string | null;
  fromPriceCents: number;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        textDecoration: "none",
        color: "var(--ink)",
      }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "63 / 88",
          background: "var(--paper)",
          border: "1px solid var(--line-soft)",
          borderRadius: 6,
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02)",
        }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
            style={{ objectFit: "contain", padding: 6 }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--bg-alt)",
            }}
          />
        )}
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
            {name}
          </span>
          <span
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--ink-mute)",
              flexShrink: 0,
            }}
          >
            #{number}
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
          {setName}
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
            {fmt(fromPriceCents)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function RealSealedTile({
  href,
  name,
  sealedType,
  imageUrl,
  priceCents,
}: {
  href: string;
  name: string;
  sealedType: string;
  imageUrl: string | null;
  priceCents: number;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        textDecoration: "none",
        color: "var(--ink)",
      }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "1 / 1",
          background: "var(--paper)",
          border: "1px solid var(--line-soft)",
          borderRadius: 6,
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02)",
        }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            style={{ objectFit: "contain", padding: 12 }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--bg-alt)",
            }}
          />
        )}
      </div>
      <div>
        <div
          className="serif"
          style={{
            fontSize: 16,
            fontWeight: 500,
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {name}
        </div>
        <div
          className="mono"
          style={{
            fontSize: 10,
            color: "var(--ink-mute)",
            marginTop: 4,
          }}
        >
          {sealedType}
        </div>
        <div
          className="serif num"
          style={{ fontSize: 18, fontWeight: 600, marginTop: 6 }}
        >
          {fmt(priceCents)}
        </div>
      </div>
    </Link>
  );
}
