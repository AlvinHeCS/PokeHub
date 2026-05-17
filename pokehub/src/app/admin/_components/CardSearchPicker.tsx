"use client";

import { useState } from "react";

import { I, Icon } from "~/app/_components/editorial/placeholders";
import { api } from "~/trpc/react";

export interface PickedCard {
  id: string;
  name: string;
  setId: string;
  setName: string;
  number: string;
  imageUrl: string | null;
}

export function CardSearchPicker({
  value,
  onChange,
}: {
  value: PickedCard | null;
  onChange: (card: PickedCard | null) => void;
}) {
  const [q, setQ] = useState("");
  const search = api.catalog.searchCards.useQuery(
    { q, limit: 12 },
    { enabled: q.length >= 2 },
  );

  if (value) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: 14,
          background: "var(--paper)",
          border: "1.5px solid var(--ink)",
          borderRadius: 4,
        }}
      >
        {value.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value.imageUrl}
            alt={value.name}
            style={{
              width: 44,
              height: 62,
              objectFit: "contain",
              background: "var(--bg-alt)",
              borderRadius: 3,
              padding: 3,
            }}
          />
        ) : null}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="serif" style={{ fontSize: 15, fontWeight: 500 }}>
            {value.name}
          </div>
          <div
            className="mono"
            style={{ fontSize: 11, color: "var(--ink-mute)", marginTop: 4 }}
          >
            {value.setName} · #{value.number}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onChange(null)}
          style={{
            background: "transparent",
            border: "1px solid var(--line)",
            borderRadius: 4,
            padding: "5px 12px",
            fontSize: 12,
            color: "var(--ink)",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--bg-alt)",
        border: "1px solid var(--line)",
        borderRadius: 6,
        padding: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "var(--paper)",
          border: "1px solid var(--line)",
          borderRadius: 4,
          padding: "9px 12px",
        }}
      >
        <Icon d={I.search} size={14} color="var(--ink-mute)" />
        <input
          type="text"
          placeholder="Search card by name (e.g. Charizard)…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            flex: 1,
            border: 0,
            background: "transparent",
            outline: "none",
            fontSize: 14,
            fontFamily: "inherit",
            color: "var(--ink)",
          }}
        />
        {search.data ? (
          <span
            style={{ fontSize: 11, color: "var(--ink-mute)" }}
            className="mono"
          >
            {search.data.length} matches
          </span>
        ) : null}
      </div>
      {q.length >= 2 && search.isFetching ? (
        <div
          style={{
            marginTop: 10,
            fontSize: 12,
            color: "var(--ink-mute)",
          }}
        >
          Searching…
        </div>
      ) : null}
      {search.data && search.data.length > 0 ? (
        <ul
          style={{
            marginTop: 10,
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            maxHeight: 320,
            overflow: "auto",
          }}
        >
          {search.data.map((card) => (
            <li key={card.id}>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    id: card.id,
                    name: card.name,
                    setId: card.setId,
                    setName: card.set.name,
                    number: card.number,
                    imageUrl: card.imageUrl,
                  })
                }
                style={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "44px 1fr auto",
                  gap: 12,
                  alignItems: "center",
                  padding: "10px 12px",
                  borderRadius: 4,
                  background: "transparent",
                  border: "1px solid transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                  color: "var(--ink)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--paper)";
                  e.currentTarget.style.borderColor = "var(--line-soft)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "transparent";
                }}
              >
                {card.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={card.imageUrl}
                    alt=""
                    style={{
                      width: 44,
                      height: 62,
                      objectFit: "contain",
                      background: "var(--bg-alt)",
                      borderRadius: 3,
                      padding: 3,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 44,
                      height: 62,
                      background: "var(--bg-alt)",
                      borderRadius: 3,
                    }}
                  />
                )}
                <div>
                  <div
                    className="serif"
                    style={{ fontSize: 14, fontWeight: 500 }}
                  >
                    {card.name}
                  </div>
                  <div
                    className="mono"
                    style={{ fontSize: 11, color: "var(--ink-mute)" }}
                  >
                    {card.set.name} · #{card.number} · {card.rarity ?? "—"}
                  </div>
                </div>
                <span
                  className="mono"
                  style={{ fontSize: 11, color: "var(--ink-mute)" }}
                >
                  {card.id.slice(0, 8)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
