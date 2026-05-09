"use client";

import { useState } from "react";

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
      <div className="flex items-center gap-3 rounded border bg-gray-50 p-3">
        {value.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value.imageUrl} alt={value.name} className="h-16" />
        ) : null}
        <div className="flex-1">
          <div className="font-medium">{value.name}</div>
          <div className="text-sm text-gray-600">
            {value.setName} · #{value.number}
          </div>
        </div>
        <button
          type="button"
          className="text-sm text-blue-600 underline"
          onClick={() => onChange(null)}
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div>
      <input
        className="w-full rounded border p-2"
        placeholder="Search card by name (e.g. Charizard)…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {search.data && search.data.length > 0 ? (
        <ul className="mt-2 max-h-72 overflow-auto rounded border">
          {search.data.map((card) => (
            <li key={card.id}>
              <button
                type="button"
                className="flex w-full items-center gap-3 p-2 text-left hover:bg-gray-100"
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
              >
                {card.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={card.imageUrl} alt="" className="h-12" />
                ) : null}
                <div>
                  <div className="text-sm font-medium">{card.name}</div>
                  <div className="text-xs text-gray-600">
                    {card.set.name} · #{card.number} · {card.rarity ?? "—"}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {search.isFetching ? (
        <div className="mt-2 text-sm text-gray-500">Searching…</div>
      ) : null}
    </div>
  );
}
