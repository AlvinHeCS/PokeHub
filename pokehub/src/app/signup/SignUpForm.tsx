"use client";

import { signIn } from "next-auth/react";
import { useState, type FormEvent } from "react";

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
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          required
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          aria-invalid={fieldError === "email"}
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          minLength={8}
          required
          aria-invalid={fieldError === "password"}
          className="w-full rounded border px-3 py-2"
        />
        <p className="mt-1 text-xs text-gray-500">At least 8 characters.</p>
      </div>
      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1 block text-sm font-medium"
        >
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
          aria-invalid={fieldError === "confirmPassword"}
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          checked={marketingOptIn}
          onChange={(e) => setMarketingOptIn(e.target.checked)}
          className="mt-1"
        />
        <span>Receive promotions and product updates by email</span>
      </label>
      {error ? (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {submitting ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
