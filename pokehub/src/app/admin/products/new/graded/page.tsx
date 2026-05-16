"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  CardSearchPicker,
  type PickedCard,
} from "~/app/admin/_components/CardSearchPicker";
import { ImageUploader } from "~/app/admin/_components/ImageUploader";
import { api } from "~/trpc/react";

const COMPANIES = ["PSA", "BGS", "CGC", "SGC", "ACE", "OTHER"] as const;

export default function NewGradedCardPage() {
  const router = useRouter();
  const [card, setCard] = useState<PickedCard | null>(null);
  const [gradingCompany, setGradingCompany] =
    useState<(typeof COMPANIES)[number]>("PSA");
  const [grade, setGrade] = useState("10");
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
    <form onSubmit={submit} className="max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">List graded card</h1>

      <Field label="Card">
        <CardSearchPicker value={card} onChange={setCard} />
      </Field>

      <div className="flex gap-4">
        <Field label="Grading company">
          <select
            className="rounded border p-2"
            value={gradingCompany}
            onChange={(e) =>
              setGradingCompany(e.target.value as (typeof COMPANIES)[number])
            }
          >
            {COMPANIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Grade">
          <input
            type="number"
            step="0.5"
            min="1"
            max="10"
            required
            className="w-24 rounded border p-2"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
        </Field>
        <Field label="Cert number">
          <input
            type="text"
            required
            className="w-48 rounded border p-2"
            value={certNumber}
            onChange={(e) => setCertNumber(e.target.value)}
          />
        </Field>
      </div>

      <Field label="Case condition (optional)">
        <input
          type="text"
          className="w-full rounded border p-2"
          placeholder="e.g. minor scratch on case back"
          value={caseCondition}
          onChange={(e) => setCaseCondition(e.target.value)}
        />
      </Field>

      <Field label="Price (AUD)">
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

      <Field label="Photo of slab">
        <ImageUploader
          value={imageUrl}
          onChange={setImageUrl}
          prefix="graded"
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
        disabled={!card || create.isPending}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {create.isPending ? "Listing…" : "List slab"}
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
