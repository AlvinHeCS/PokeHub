"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ImageUploader } from "~/app/admin/_components/ImageUploader";
import { api } from "~/trpc/react";

const SEALED_TYPES = [
  "BOOSTER_PACK",
  "BOOSTER_BOX",
  "MINI_BOOSTER_BOX",
  "ELITE_TRAINER_BOX",
  "ETB_PLUS",
  "COLLECTION_BOX",
  "PREMIUM_COLLECTION_BOX",
  "TIN",
  "MINI_TIN",
  "LUNCHBOX_TIN",
  "BLISTER_PACK",
  "CHECKLANE_BLISTER",
  "TRIPLE_BLISTER",
  "BUILD_AND_BATTLE_BOX",
  "BUILD_AND_BATTLE_STADIUM",
  "THEME_DECK",
  "STARTER_DECK",
  "V_BATTLE_DECK",
  "VMAX_BATTLE_BOX",
  "VSTAR_PREMIUM_COLLECTION",
  "SPECIAL_COLLECTION_BOX",
  "POKEBALL_TIN",
  "ULTRA_PREMIUM_COLLECTION",
  "HOLIDAY_CALENDAR",
  "MYSTERY_BOX",
  "SLEEVE_BOOSTER_PACK",
  "PRE_RELEASE_KIT",
  "BOX_SET",
  "OTHER",
] as const;

export default function NewSealedPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [sealedType, setSealedType] =
    useState<(typeof SEALED_TYPES)[number]>("BOOSTER_BOX");
  const [priceDollars, setPriceDollars] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [releaseDate, setReleaseDate] = useState("");
  const [region, setRegion] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedSetIds, setSelectedSetIds] = useState<string[]>([]);
  const [description, setDescription] = useState("");

  const setsQuery = api.catalog.listSets.useQuery();
  const create = api.product.createSealed.useMutation({
    onSuccess: () => router.push("/admin/products"),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    create.mutate({
      name,
      sealedType,
      priceCents: Math.round(parseFloat(priceDollars) * 100),
      quantity: parseInt(quantity, 10),
      releaseDate: releaseDate || undefined,
      region: region || undefined,
      imageUrl: imageUrl ?? undefined,
      cardSetIds: selectedSetIds.length > 0 ? selectedSetIds : undefined,
      description: description || undefined,
      language: "ENGLISH",
    });
  }

  return (
    <form onSubmit={submit} className="max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">List sealed product</h1>

      <Field label="Product name">
        <input
          type="text"
          required
          className="w-full rounded border p-2"
          placeholder="e.g. Scarlet & Violet — Twilight Masquerade Booster Box"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Field>

      <Field label="Sealed type">
        <select
          className="rounded border p-2"
          value={sealedType}
          onChange={(e) =>
            setSealedType(e.target.value as (typeof SEALED_TYPES)[number])
          }
        >
          {SEALED_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
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

      <div className="flex gap-4">
        <Field label="Release date (optional)">
          <input
            type="date"
            className="rounded border p-2"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
        </Field>
        <Field label="Region (optional)">
          <input
            type="text"
            className="rounded border p-2"
            placeholder="EN, JP, KR…"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
        </Field>
      </div>

      <Field label="Linked card sets (optional)">
        <select
          multiple
          className="h-32 w-full rounded border p-2"
          value={selectedSetIds}
          onChange={(e) =>
            setSelectedSetIds(
              Array.from(e.target.selectedOptions, (o) => o.value),
            )
          }
        >
          {setsQuery.data?.map((s) => (
            <option key={s.id} value={s.id}>
              {s.era.name} — {s.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Product image">
        <ImageUploader
          value={imageUrl}
          onChange={setImageUrl}
          prefix="sealed"
        />
      </Field>

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
        disabled={create.isPending}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {create.isPending ? "Listing…" : "List sealed product"}
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
