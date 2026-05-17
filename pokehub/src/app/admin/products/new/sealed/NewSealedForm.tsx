"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  adminInputStyle,
  adminTextareaStyle,
  FormActions,
  FormField,
  FormSection,
  NewProductHeader,
  SubmitErrorRow,
} from "~/app/_components/editorial/AdminFormPrimitives";
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

export function NewSealedForm() {
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
    <>
      <NewProductHeader active="SEALED" />
      <form onSubmit={submit} style={{ marginTop: 24, maxWidth: 860 }}>
        <FormSection title="Product">
          <FormField label="Product name">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Scarlet & Violet — Twilight Masquerade Booster Box"
              style={adminInputStyle}
            />
          </FormField>
          <FormField label="Sealed type" style={{ marginTop: 14 }}>
            <select
              value={sealedType}
              onChange={(e) =>
                setSealedType(e.target.value as (typeof SEALED_TYPES)[number])
              }
              style={{ ...adminInputStyle, appearance: "auto" }}
            >
              {SEALED_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </FormField>
        </FormSection>

        <FormSection title="Inventory & price">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            <FormField label="Price (AUD)">
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={priceDollars}
                onChange={(e) => setPriceDollars(e.target.value)}
                style={adminInputStyle}
              />
            </FormField>
            <FormField label="Quantity">
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                style={adminInputStyle}
              />
            </FormField>
            <FormField label="Release date (optional)">
              <input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                style={adminInputStyle}
              />
            </FormField>
            <FormField label="Region (optional)" hint="EN, JP, KR…">
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                style={adminInputStyle}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection
          title="Linked card sets (optional)"
          desc="Tag this product with one or more sets it contains."
        >
          <select
            multiple
            value={selectedSetIds}
            onChange={(e) =>
              setSelectedSetIds(
                Array.from(e.target.selectedOptions, (o) => o.value),
              )
            }
            style={{
              ...adminInputStyle,
              height: 140,
              padding: 8,
              appearance: "auto",
            }}
          >
            {setsQuery.data?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.era.name} — {s.name}
              </option>
            ))}
          </select>
        </FormSection>

        <FormSection title="Product image">
          <ImageUploader
            value={imageUrl}
            onChange={setImageUrl}
            prefix="sealed"
          />
        </FormSection>

        <FormSection title="Description (optional)">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={adminTextareaStyle}
          />
        </FormSection>

        <FormActions>
          <button
            type="submit"
            disabled={create.isPending}
            className="btn"
            style={{
              padding: "12px 22px",
              fontSize: 14,
              opacity: create.isPending ? 0.6 : 1,
            }}
          >
            {create.isPending ? "Listing…" : "List sealed product"}
          </button>
        </FormActions>
        <SubmitErrorRow error={create.error?.message} />
      </form>
    </>
  );
}
