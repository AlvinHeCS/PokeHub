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
  SelectChips,
  SubmitErrorRow,
} from "~/app/_components/editorial/AdminFormPrimitives";
import {
  CardSearchPicker,
  type PickedCard,
} from "~/app/admin/_components/CardSearchPicker";
import { api } from "~/trpc/react";

const CONDITIONS = ["NM", "LP", "MP", "HP", "DMG"] as const;

export function NewRawForm() {
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
    <>
      <NewProductHeader active="RAW" />
      <form onSubmit={submit} style={{ marginTop: 24, maxWidth: 760 }}>
        <FormSection
          title="Which card?"
          desc="Search by name. Pick from the catalog."
        >
          <CardSearchPicker value={card} onChange={setCard} />
        </FormSection>

        <FormSection title="Condition">
          <SelectChips
            value={condition}
            options={CONDITIONS}
            onChange={(v) => setCondition(v)}
          />
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
          </div>
          <FormField label="Description (optional)" style={{ marginTop: 14 }}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={adminTextareaStyle}
            />
          </FormField>
        </FormSection>

        <FormActions>
          <button
            type="submit"
            disabled={!card || create.isPending}
            className="btn"
            style={{
              padding: "12px 22px",
              fontSize: 14,
              opacity: !card || create.isPending ? 0.6 : 1,
            }}
          >
            {create.isPending ? "Listing…" : "List card"}
          </button>
        </FormActions>
        <SubmitErrorRow error={create.error?.message} />
      </form>
    </>
  );
}
