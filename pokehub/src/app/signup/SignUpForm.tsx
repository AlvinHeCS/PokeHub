"use client";

import { signIn } from "next-auth/react";
import { useState, type FormEvent } from "react";

import { I, Icon } from "~/app/_components/editorial/placeholders";
import { signupAction } from "./actions";

export function SignUpForm({ callbackUrl }: { callbackUrl?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const target = callbackUrl ?? "/";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldError(null);
    if (password !== confirmPassword) {
      setFieldError("confirmPassword");
      setError("Passwords do not match");
      return;
    }
    setSubmitting(true);
    const result = await signupAction({
      name,
      email,
      password,
      confirmPassword,
      marketingOptIn,
    });
    if (!result.ok) {
      setSubmitting(false);
      setError(result.error);
      setFieldError(result.field ?? null);
      return;
    }
    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: target,
    });
    setSubmitting(false);
    if (!signInResult || signInResult.error) {
      setError(
        "Account created but sign-in failed. Please try signing in manually.",
      );
      return;
    }
    window.location.assign(signInResult.url ?? target);
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
      <DarkField
        label="Full name"
        id="name"
        autoComplete="name"
        value={name}
        onChange={setName}
        required
      />
      <DarkField
        label="Email"
        id="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={setEmail}
        required
        invalid={fieldError === "email"}
      />
      <DarkField
        label="Password (min 8 chars)"
        id="password"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={setPassword}
        minLength={8}
        required
        invalid={fieldError === "password"}
      />
      <DarkField
        label="Confirm password"
        id="confirmPassword"
        type="password"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        required
        invalid={fieldError === "confirmPassword"}
      />
      <label
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          fontSize: 12,
          color: "rgba(255,255,255,0.75)",
          lineHeight: 1.55,
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={marketingOptIn}
          onChange={(e) => setMarketingOptIn(e.target.checked)}
          style={{ marginTop: 3 }}
        />
        <span>
          Send me occasional emails about new drops, sales, and sealed product
          restocks.
        </span>
      </label>
      {error ? (
        <p
          role="alert"
          style={{
            color: "var(--accent-hi)",
            fontSize: 13,
            margin: 0,
          }}
        >
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={submitting}
        className="btn accent"
        style={{
          padding: "12px 18px",
          fontSize: 15,
          opacity: submitting ? 0.6 : 1,
        }}
      >
        {submitting ? "Creating account…" : "Create account"}{" "}
        <Icon d={I.arrowR} size={14} />
      </button>
    </form>
  );
}

function DarkField({
  label,
  id,
  type = "text",
  autoComplete,
  value,
  onChange,
  required,
  minLength,
  invalid,
}: {
  label: string;
  id: string;
  type?: string;
  autoComplete?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  minLength?: number;
  invalid?: boolean;
}) {
  return (
    <label htmlFor={id} style={{ display: "block" }}>
      <div
        className="eyebrow"
        style={{
          fontSize: 10,
          marginBottom: 8,
          color: "rgba(255,255,255,0.55)",
        }}
      >
        {label}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        aria-invalid={invalid}
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.06)",
          border: `1px solid ${invalid ? "var(--accent-hi)" : "rgba(255,255,255,0.18)"}`,
          borderRadius: 4,
          padding: "11px 14px",
          fontSize: 14,
          fontFamily: "inherit",
          color: "var(--bg)",
          outline: "none",
        }}
      />
    </label>
  );
}
