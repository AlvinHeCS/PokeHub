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
import { ImageUploader } from "~/app/admin/_components/ImageUploader";
import { api } from "~/trpc/react";

const COMPANIES = ["PSA", "BGS", "CGC", "SGC", "ACE", "OTHER"] as const;
const GRADES = ["10", "9.5", "9", "8.5", "8", "7", "6", "5"] as const;

export function NewGradedForm() {
  const router = useRouter();
  const [card, setCard] = useState<PickedCard | null>(null);
  const [gradingCompany, setGradingCompany] =
    useState<(typeof COMPANIES)[number]>("PSA");
  const [grade, setGrade] = useState<(typeof GRADES)[number]>("10");
  const [certNumber, setCertNumber] = useState("");
  const [caseCondition, setCaseCondition] = useState("");
  const [priceDollars, setPriceDollars] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  const create = api.product.createGraded.useMutation({
    onSuccess: () => router.push("/admin/products"),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!card) return;
    create.mutate({
      cardId: card.id,
      gradingCompany,
      grade: parseFloat(grade),
      certNumber,
      caseCondition: caseCondition || undefined,
      priceCents: Math.round(parseFloat(priceDollars) * 100),
      quantity: 1,
      imageUrl: imageUrl ?? undefined,
      description: description || undefined,
      language: "ENGLISH",
    });
  }

  return (
    <>
      <NewProductHeader active="GRADED" />
      <form onSubmit={submit} style={{ marginTop: 24, maxWidth: 860 }}>
        <FormSection
          title="Which card?"
          desc="Search by name. Pick from the catalog."
        >
          <CardSearchPicker value={card} onChange={setCard} />
        </FormSection>

        <FormSection
          title="Grading"
          desc="Required for graded slabs. Cert number must be unique."
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            <FormField label="Company">
              <SelectChips
                value={gradingCompany}
                options={COMPANIES}
                onChange={(v) => setGradingCompany(v)}
              />
            </FormField>
            <FormField label="Grade">
              <SelectChips
                value={grade}
                options={GRADES}
                onChange={(v) => setGrade(v)}
              />
            </FormField>
            <FormField label="Cert number">
              <input
                type="text"
                required
                value={certNumber}
                onChange={(e) => setCertNumber(e.target.value)}
                style={adminInputStyle}
              />
            </FormField>
            <FormField label="Case condition (optional)">
              <input
                type="text"
                value={caseCondition}
                onChange={(e) => setCaseCondition(e.target.value)}
                placeholder="e.g. minor scratch on case back"
                style={adminInputStyle}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Price">
          <FormField label="Price (AUD)" style={{ maxWidth: 240 }}>
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
        </FormSection>

        <FormSection title="Slab photo" desc="One photo of the slab front.">
          <ImageUploader
            value={imageUrl}
            onChange={setImageUrl}
            prefix="graded"
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
            disabled={!card || create.isPending}
            className="btn"
            style={{
              padding: "12px 22px",
              fontSize: 14,
              opacity: !card || create.isPending ? 0.6 : 1,
            }}
          >
            {create.isPending ? "Listing…" : "List slab"}
          </button>
        </FormActions>
        <SubmitErrorRow error={create.error?.message} />
      </form>
    </>
  );
}
