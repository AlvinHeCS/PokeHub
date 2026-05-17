"use client";

import { signIn } from "next-auth/react";
import { useState, type FormEvent } from "react";

import { I, Icon } from "~/app/_components/editorial/placeholders";

export function SignInForm({
  callbackUrl,
  initialError,
}: {
  callbackUrl?: string;
  initialError?: string;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(
    initialError ? "Sign in failed. Please try again." : null,
  );

  const target = callbackUrl ?? "/";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: target,
    });
    setSubmitting(false);
    if (!result || result.error) {
      setError("Invalid email or password.");
      return;
    }
    window.location.assign(result.url ?? target);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 14 }}
      >
        <LightField
          label="Email"
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          required
        />
        <LightField
          label="Password"
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          required
        />
        {error ? (
          <p
            role="alert"
            style={{ color: "var(--danger)", fontSize: 13, margin: 0 }}
          >
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className="btn"
          style={{
            padding: "12px 18px",
            fontSize: 15,
            opacity: submitting ? 0.6 : 1,
          }}
        >
          {submitting ? "Signing in…" : "Sign in"}{" "}
          <Icon d={I.arrowR} size={14} />
        </button>
      </form>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          color: "var(--ink-mute)",
          fontSize: 11,
          letterSpacing: "0.12em",
        }}
      >
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} /> OR{" "}
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
      </div>

      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: target })}
        className="btn ghost"
        style={{
          padding: "11px 14px",
          fontSize: 14,
          justifyContent: "center",
        }}
      >
        <span
          style={{
            width: 14,
            height: 14,
            background:
              "linear-gradient(45deg,#4285f4,#34a853,#fbbc05,#ea4335)",
            borderRadius: 3,
          }}
        />{" "}
        Continue with Google
      </button>
    </div>
  );
}

function LightField({
  label,
  id,
  type = "text",
  autoComplete,
  value,
  onChange,
  required,
}: {
  label: string;
  id: string;
  type?: string;
  autoComplete?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label htmlFor={id} style={{ display: "block" }}>
      <div
        className="eyebrow"
        style={{ fontSize: 10, marginBottom: 8, color: "var(--ink-soft)" }}
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
        style={{
          width: "100%",
          background: "var(--bg)",
          border: "1px solid var(--line)",
          borderRadius: 4,
          padding: "11px 14px",
          fontSize: 14,
          fontFamily: "inherit",
          color: "var(--ink)",
          outline: "none",
        }}
      />
    </label>
  );
}
