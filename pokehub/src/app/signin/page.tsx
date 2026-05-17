import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "~/server/auth";
import { SignInForm } from "./SignInForm";

export const metadata = { title: "Sign in · PokeHub" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  const { callbackUrl, error } = await searchParams;
  if (session?.user) redirect(callbackUrl ?? "/");

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <main
        style={{
          maxWidth: 480,
          margin: "0 auto",
          padding: "60px 32px 80px",
        }}
      >
        <div
          style={{
            background: "var(--paper)",
            border: "1px solid var(--line)",
            borderRadius: 8,
            padding: 36,
          }}
        >
          <span className="eyebrow">Returning</span>
          <h1
            className="serif"
            style={{
              fontSize: 34,
              fontWeight: 500,
              letterSpacing: "-0.03em",
              margin: "10px 0 8px",
            }}
          >
            Sign in
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "var(--ink-soft)",
              marginTop: 0,
              marginBottom: 22,
            }}
          >
            Access your orders, addresses, and wishlist.
          </p>
          <SignInForm callbackUrl={callbackUrl} initialError={error} />
        </div>
        <p
          style={{
            marginTop: 24,
            fontSize: 13,
            color: "var(--ink-soft)",
            textAlign: "center",
          }}
        >
          Don&apos;t have an account?{" "}
          <Link
            href={
              callbackUrl
                ? `/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : "/signup"
            }
            style={{ color: "var(--accent)", fontWeight: 500 }}
          >
            Create one
          </Link>
        </p>
      </main>
    </div>
  );
}
