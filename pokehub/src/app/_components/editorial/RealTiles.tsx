import Image from "next/image";
import Link from "next/link";

import { fmt } from "~/app/_components/editorial/placeholders";

/* Editorial framing around real product photos. The mockup's CardArt is a
 * stylized stand-in for unknown products — in production we want the actual
 * Pokémon card photo inside the same editorial frame language. */

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
            style={{ objectFit: "cover" }}
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
