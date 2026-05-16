"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  CardSearchPicker,
  type PickedCard,
} from "~/app/admin/_components/CardSearchPicker";
import { api } from "~/trpc/react";

const CONDITIONS = ["NM", "LP", "MP", "HP", "DMG"] as const;

export default function NewRawCardPage() {
  const router = useRouter();
  const [card, setCard] = useState<PickedCard | null>(null);
  const [condition, setCondition] = useState<(typeof CONDITIONS)[number]>("NM");
  const [priceDollars, setPriceDollars] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [description, setDescription] = useState("");

  const create = api.product.createRaw.useMutation({
    onSuccess: () => router.push("/admin/products"),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!card) return;
    const cents = Math.round(parseFloat(priceDollars) * 100);
    create.mutate({
      cardId: card.id,
      condition,
      priceCents: cents,
      quantity: parseInt(quantity, 10),
      description: description || undefined,
      language: "ENGLISH",
    });
  }

  return (
    <form onSubmit={submit} className="max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">List raw card</h1>

      <Field label="Card">
        <CardSearchPicker value={card} onChange={setCard} />
      </Field>

      <Field label="Condition">
        <select
          className="rounded border p-2"
          value={condition}
          onChange={(e) =>
            setCondition(e.target.value as (typeof CONDITIONS)[number])
          }
        >
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <div className="flex gap-4">
        <Field label="Price (USD)">
          <input
            type="number"
            step="0.01"
            min="0"
            required
            className="w-32 rounded border p-2"
            value={priceDollars}
            onChange={(e) => setPriceDollars(e.target.value)}
          />
        </Field>
        <Field label="Quantity">
          <input
            type="number"
            min="1"
            required
            className="w-24 rounded border p-2"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </Field>
      </div>

      <Field label="Description (optional)">
        <textarea
          className="w-full rounded border p-2"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Field>

      <button
        type="submit"
        disabled={!card || create.isPending}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {create.isPending ? "Listing…" : "List card"}
      </button>
      {create.error ? (
        <div className="text-red-600">{create.error.message}</div>
      ) : null}
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-sm font-medium">{label}</div>
      {children}
    </label>
  );
}
