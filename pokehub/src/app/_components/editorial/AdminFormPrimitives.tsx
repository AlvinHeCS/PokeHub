"use client";

import type { CSSProperties, ReactNode } from "react";

import Link from "next/link";

import { I, Icon } from "~/app/_components/editorial/placeholders";

export type NewProductType = "RAW" | "GRADED" | "SEALED";

const TYPE_META: Record<
  NewProductType,
  { title: string; sub: string; href: string }
> = {
  RAW: {
    title: "Raw single",
    sub: "Card + condition grade",
    href: "/admin/products/new/raw",
  },
  GRADED: {
    title: "Graded slab",
    sub: "PSA, BGS, CGC, SGC",
    href: "/admin/products/new/graded",
  },
  SEALED: {
    title: "Sealed product",
    sub: "Booster boxes, ETBs, tins",
    href: "/admin/products/new/sealed",
  },
};

export function NewProductHeader({ active }: { active: NewProductType }) {
  return (
    <>
      <div
        className="mono"
        style={{
          fontSize: 11,
          color: "var(--ink-mute)",
          letterSpacing: "0.08em",
        }}
      >
        PRODUCTS / NEW
      </div>
      <h1
        className="serif"
        style={{
          fontSize: 32,
          fontWeight: 500,
          letterSpacing: "-0.03em",
          margin: "6px 0 0",
        }}
      >
        List a new product
      </h1>
      <div
        style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 14,
        }}
        className="admin-type-picker"
      >
        {(Object.keys(TYPE_META) as NewProductType[]).map((id) => {
          const t = TYPE_META[id];
          const isActive = id === active;
          return (
            <Link
              key={id}
              href={t.href}
              style={{
                padding: 22,
                borderRadius: 6,
                border: `1.5px solid ${isActive ? "var(--ink)" : "var(--line)"}`,
                background: isActive ? "var(--paper)" : "transparent",
                textDecoration: "none",
                color: "var(--ink)",
                display: "block",
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: isActive ? "var(--accent)" : "var(--ink-mute)",
                }}
              >
                {id}
              </div>
              <div
                className="serif"
                style={{ fontSize: 22, fontWeight: 500, marginTop: 6 }}
              >
                {t.title}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--ink-soft)",
                  marginTop: 4,
                }}
              >
                {t.sub}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export function FormSection({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        marginBottom: 20,
        background: "var(--paper)",
        border: "1px solid var(--line)",
        borderRadius: 8,
        padding: 26,
      }}
    >
      <h3
        className="serif"
        style={{ fontSize: 18, fontWeight: 500, margin: 0 }}
      >
        {title}
      </h3>
      {desc ? (
        <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 4 }}>
          {desc}
        </div>
      ) : null}
      <div style={{ marginTop: 16 }}>{children}</div>
    </div>
  );
}

export function FormField({
  label,
  hint,
  children,
  style,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <label style={{ display: "block", ...style }}>
      <div
        className="eyebrow"
        style={{ fontSize: 10, marginBottom: 8, color: "var(--ink-soft)" }}
      >
        {label}
      </div>
      {children}
      {hint ? (
        <div
          style={{
            marginTop: 6,
            fontSize: 11,
            color: "var(--ink-mute)",
          }}
        >
          {hint}
        </div>
      ) : null}
    </label>
  );
}

export const adminInputStyle: CSSProperties = {
  width: "100%",
  background: "var(--bg-alt)",
  border: "1px solid var(--line)",
  borderRadius: 4,
  padding: "10px 13px",
  fontSize: 14,
  fontFamily: "inherit",
  color: "var(--ink)",
  outline: "none",
};

export const adminTextareaStyle: CSSProperties = {
  ...adminInputStyle,
  resize: "vertical",
  minHeight: 76,
};

export function SelectChips<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {options.map((o) => {
        const active = o === value;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            style={{
              padding: "7px 14px",
              borderRadius: 4,
              border: `1.5px solid ${active ? "var(--ink)" : "var(--line)"}`,
              background: active ? "var(--ink)" : "transparent",
              color: active ? "var(--bg)" : "var(--ink-soft)",
              fontWeight: active ? 500 : 400,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

export function SubmitErrorRow({
  error,
}: {
  error: string | null | undefined;
}) {
  if (!error) return null;
  return (
    <div
      role="alert"
      style={{
        marginTop: 10,
        padding: "10px 12px",
        background: "rgba(168,58,42,0.08)",
        border: "1px solid var(--danger)",
        borderRadius: 4,
        color: "var(--danger)",
        fontSize: 13,
      }}
    >
      {error}
    </div>
  );
}

export function FormActions({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        marginTop: 24,
        display: "flex",
        gap: 10,
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );
}

// Small reused icon import so consumers don't all reimport
export { I, Icon };
