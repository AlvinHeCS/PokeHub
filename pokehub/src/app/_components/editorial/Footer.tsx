import { I, Icon } from "~/app/_components/editorial/placeholders";

const COLUMNS: [string, string[]][] = [
  [
    "Shop",
    ["Singles", "Sealed product", "Graded slabs", "New arrivals", "Sale"],
  ],
  ["Sets", ["Scarlet Era", "Sword Era", "Sun & Moon", "XY", "Vintage"]],
  ["Help", ["Shipping", "Returns", "Authenticity", "Contact"]],
  ["Account", ["Sign in", "Create account", "Order lookup", "Wishlist"]],
];

export function Footer() {
  return (
    <footer
      style={{
        background: "var(--bg-alt)",
        borderTop: "1px solid var(--line)",
        padding: "48px 32px 28px",
        marginTop: 60,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
          gap: 32,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Logo size={26} />
            <span
              className="serif"
              style={{
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: "-0.025em",
              }}
            >
              PokéHub
            </span>
          </div>
          <p
            style={{
              marginTop: 14,
              fontSize: 13,
              lineHeight: 1.7,
              color: "var(--ink-soft)",
              maxWidth: 340,
            }}
          >
            A curated marketplace for sealed Pokémon TCG product, raw singles,
            and graded slabs. Every item authenticated by hand, tracked and
            insured.
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <span className="pill">
              <Icon d={I.shield} size={11} /> Authenticated
            </span>
            <span className="pill">
              <Icon d={I.truck} size={11} /> Insured
            </span>
          </div>
        </div>
        {COLUMNS.map(([h, items]) => (
          <div key={h}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>
              {h}
            </div>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                fontSize: 13,
                color: "var(--ink-soft)",
              }}
            >
              {items.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 32,
          paddingTop: 18,
          borderTop: "1px solid var(--line)",
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          color: "var(--ink-mute)",
        }}
      >
        <span>© 2026 PokéHub Trading Co.</span>
        <span>Not affiliated with Nintendo or The Pokémon Company.</span>
      </div>
    </footer>
  );
}

function Logo({ size = 28 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: "var(--ink)",
        color: "var(--bg)",
        borderRadius: 6,
        display: "grid",
        placeItems: "center",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontWeight: 600,
        fontSize: size * 0.55,
        letterSpacing: "-0.04em",
      }}
    >
      P
    </div>
  );
}
