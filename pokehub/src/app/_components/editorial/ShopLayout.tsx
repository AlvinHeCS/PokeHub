import { I, Icon, TYPES } from "~/app/_components/editorial/placeholders";
import {
  RealCardTile,
  RealSealedTile,
} from "~/app/_components/editorial/RealTiles";

export interface ShopCard {
  id: string;
  name: string;
  number: string;
  setName: string;
  imageUrl: string | null;
  fromPriceCents: number;
}

export interface ShopSealed {
  id: string;
  name: string;
  sealedType: string;
  priceCents: number;
  imageUrl: string | null;
}

export function ShopDesktop({
  cards,
  sealed,
}: {
  cards: ShopCard[];
  sealed: ShopSealed[];
}) {
  const total = cards.length + sealed.length;
  return (
    <div
      style={{ background: "var(--bg)", minHeight: "100%" }}
      className="editorial-desktop-only"
    >
      {/* Title bar */}
      <div
        style={{
          padding: "36px 32px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 16,
        }}
      >
        <div>
          <span className="eyebrow">The catalog</span>
          <h1
            className="serif"
            style={{
              fontSize: 48,
              fontWeight: 500,
              letterSpacing: "-0.035em",
              margin: "6px 0 4px",
            }}
          >
            Everything in stock
          </h1>
          <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
            <span style={{ color: "var(--ink)", fontWeight: 500 }}>
              {cards.length.toLocaleString()}
            </span>{" "}
            singles ·{" "}
            <span style={{ color: "var(--ink)", fontWeight: 500 }}>
              {sealed.length.toLocaleString()}
            </span>{" "}
            sealed
          </div>
        </div>
        <select style={selectStyle()} defaultValue="curated">
          <option value="curated">Sort · Curated</option>
          <option value="price-asc">Price · Low to high</option>
          <option value="price-desc">Price · High to low</option>
          <option value="recent">Recently added</option>
        </select>
      </div>

      {/* Active filter chips (decorative) */}
      <div
        style={{
          padding: "24px 32px 0",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "center",
            padding: "20px 0",
          }}
        >
          <span className="eyebrow">Filters</span>
          {[
            "Tides of Ember",
            "Fire type",
            "Holo Rare",
            "NM only",
            "$10 – $100",
          ].map((t) => (
            <span
              key={t}
              className="pill"
              style={{
                background: "var(--paper)",
                color: "var(--ink)",
                border: "1px solid var(--line)",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {t} <Icon d={I.x} size={11} />
            </span>
          ))}
          <button
            type="button"
            style={{
              background: "transparent",
              border: 0,
              color: "var(--ink-soft)",
              fontSize: 12,
              textDecoration: "underline",
              marginLeft: 6,
              cursor: "pointer",
            }}
          >
            Clear all
          </button>
        </div>
      </div>

      {/* Sidebar + grid */}
      <div
        style={{
          padding: "8px 32px 56px",
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: 32,
        }}
      >
        <FilterSidebar />
        <div>
          {cards.length === 0 && sealed.length === 0 ? (
            <div
              style={{
                marginTop: 28,
                padding: 40,
                background: "var(--paper)",
                border: "1px solid var(--line)",
                borderRadius: 8,
                textAlign: "center",
                color: "var(--ink-soft)",
              }}
            >
              Nothing in stock right now.
            </div>
          ) : null}

          {cards.length > 0 ? (
            <>
              <SectionHeader title="Singles" count={cards.length} />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: 24,
                  marginBottom: 48,
                }}
              >
                {cards.map((c) => (
                  <RealCardTile
                    key={c.id}
                    href={`/cards/${c.id}`}
                    name={c.name}
                    setName={c.setName}
                    number={c.number}
                    imageUrl={c.imageUrl}
                    fromPriceCents={c.fromPriceCents}
                  />
                ))}
              </div>
            </>
          ) : null}

          {sealed.length > 0 ? (
            <>
              <SectionHeader title="Sealed product" count={sealed.length} />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 24,
                }}
              >
                {sealed.map((s) => (
                  <RealSealedTile
                    key={s.id}
                    href={`/sealed/${s.id}`}
                    name={s.name}
                    sealedType={s.sealedType}
                    priceCents={s.priceCents}
                    imageUrl={s.imageUrl}
                  />
                ))}
              </div>
            </>
          ) : null}

          {/* Total footnote */}
          {total > 0 ? (
            <div
              style={{
                marginTop: 48,
                fontSize: 12,
                color: "var(--ink-mute)",
                textAlign: "center",
              }}
            >
              Showing {total} {total === 1 ? "item" : "items"} in stock
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ShopMobile({
  cards,
  sealed,
}: {
  cards: ShopCard[];
  sealed: ShopSealed[];
}) {
  return (
    <div
      style={{ background: "var(--bg)", minHeight: "100%" }}
      className="editorial-mobile-only"
    >
      <div
        style={{
          padding: "16px 18px 12px",
          display: "flex",
          gap: 6,
          overflowX: "auto",
        }}
        className="scrollbar-none"
      >
        <span
          style={{
            flex: "0 0 auto",
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 12px",
            borderRadius: 999,
            background: "var(--ink)",
            color: "var(--bg)",
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          <Icon d={I.filter} size={12} /> Filters · 5
        </span>
        {["Tides of Ember", "Holo Rare", "$10–$100", "NM", "In stock"].map(
          (t) => (
            <span key={t} className="pill" style={{ flex: "0 0 auto" }}>
              {t}
            </span>
          ),
        )}
      </div>
      <div
        style={{
          padding: "0 18px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <div>
          <h2
            className="serif"
            style={{
              fontSize: 24,
              fontWeight: 500,
              margin: 0,
              letterSpacing: "-0.025em",
            }}
          >
            {cards.length.toLocaleString()} singles
          </h2>
          <div style={{ fontSize: 11, color: "var(--ink-mute)", marginTop: 2 }}>
            + {sealed.length} sealed
          </div>
        </div>
        <button
          type="button"
          className="btn ghost"
          style={{ padding: "6px 12px", fontSize: 12 }}
        >
          Sort ▾
        </button>
      </div>
      <div
        style={{
          padding: "0 18px 22px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
        }}
      >
        {cards.map((c) => (
          <RealCardTile
            key={c.id}
            href={`/cards/${c.id}`}
            name={c.name}
            setName={c.setName}
            number={c.number}
            imageUrl={c.imageUrl}
            fromPriceCents={c.fromPriceCents}
          />
        ))}
      </div>
      {sealed.length > 0 ? (
        <div style={{ padding: "0 18px 22px" }}>
          <div style={{ marginBottom: 12 }}>
            <span className="eyebrow">Sealed product</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            {sealed.map((s) => (
              <RealSealedTile
                key={s.id}
                href={`/sealed/${s.id}`}
                name={s.name}
                sealedType={s.sealedType}
                priceCents={s.priceCents}
                imageUrl={s.imageUrl}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: 18,
      }}
    >
      <h2
        className="serif"
        style={{
          fontSize: 26,
          fontWeight: 500,
          letterSpacing: "-0.025em",
          margin: 0,
        }}
      >
        {title}{" "}
        <span
          style={{ color: "var(--ink-mute)", fontSize: 16, fontWeight: 400 }}
        >
          · {count.toLocaleString()}
        </span>
      </h2>
    </div>
  );
}

function FilterSidebar() {
  return (
    <aside>
      <FilterGroup title="Product type">
        <CheckRow label="Raw single" active />
        <CheckRow label="Graded slab" />
        <CheckRow label="Sealed product" />
      </FilterGroup>
      <FilterGroup title="Era">
        <CheckRow label="Scarlet Era" active />
        <CheckRow label="Sword & Shield" />
        <CheckRow label="Sun & Moon" />
        <CheckRow label="XY" />
        <CheckRow label="Vintage" />
      </FilterGroup>
      <FilterGroup title="Set">
        <CheckRow label="Tides of Ember" active />
        <CheckRow label="Hollowveil" />
        <CheckRow label="Voltflux" />
        <CheckRow label="Quietwood" />
      </FilterGroup>
      <FilterGroup title="Element">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 6,
          }}
        >
          {Object.entries(TYPES).map(([n, t]) => (
            <div
              key={n}
              title={n}
              style={{
                aspectRatio: "1/1",
                borderRadius: 6,
                border: `1px solid ${t.hex}`,
                background: n === "Fire" ? t.hex : "transparent",
                color: n === "Fire" ? "#fff" : t.hex,
                display: "grid",
                placeItems: "center",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              {n.slice(0, 3).toUpperCase()}
            </div>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Rarity">
        <CheckRow label="Common" />
        <CheckRow label="Uncommon" />
        <CheckRow label="Holo Rare" active />
        <CheckRow label="Full Art" />
        <CheckRow label="Illustration" />
        <CheckRow label="Hyper Rare" />
      </FilterGroup>
      <FilterGroup title="Condition">
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            padding: "4px 0",
          }}
        >
          {["NM", "LP", "MP", "HP", "DMG"].map((t, i) => (
            <span
              key={t}
              className="pill"
              style={
                i === 0
                  ? {
                      background: "var(--ink)",
                      color: "var(--bg)",
                      borderColor: "var(--ink)",
                    }
                  : {}
              }
            >
              {t}
            </span>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Language">
        <div style={{ display: "flex", gap: 6, padding: "4px 0" }}>
          <span
            className="pill"
            style={{
              background: "var(--ink)",
              color: "var(--bg)",
              borderColor: "var(--ink)",
            }}
          >
            English
          </span>
          <span className="pill">Japanese</span>
        </div>
      </FilterGroup>
    </aside>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        borderBottom: "1px solid var(--line-soft)",
        padding: "18px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <span className="eyebrow">{title}</span>
        <Icon d={I.chevD} size={14} color="var(--ink-mute)" />
      </div>
      {children}
    </div>
  );
}

function CheckRow({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 13,
        padding: "5px 0",
        cursor: "pointer",
        color: active ? "var(--ink)" : "var(--ink-soft)",
      }}
    >
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: 3,
          border: `1.5px solid ${active ? "var(--ink)" : "var(--line)"}`,
          background: active ? "var(--ink)" : "transparent",
          display: "grid",
          placeItems: "center",
          color: "var(--bg)",
        }}
      >
        {active ? <Icon d={I.check} size={11} stroke={2.5} /> : null}
      </span>
      <span style={{ flex: 1 }}>{label}</span>
    </label>
  );
}

function selectStyle() {
  return {
    appearance: "none" as const,
    background: "var(--paper)",
    color: "var(--ink)",
    border: "1px solid var(--line)",
    borderRadius: 4,
    padding: "9px 36px 9px 14px",
    fontFamily: "inherit",
    fontSize: 13,
    cursor: "pointer",
    backgroundImage:
      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'><path d='M6 9l6 6 6-6'/></svg>\")",
    backgroundRepeat: "no-repeat" as const,
    backgroundPosition: "right 12px center",
  };
}
