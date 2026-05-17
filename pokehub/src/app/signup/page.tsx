import Link from "next/link";
import { redirect } from "next/navigation";

import { I, Icon } from "~/app/_components/editorial/placeholders";
import { auth } from "~/server/auth";
import { SignUpForm } from "./SignUpForm";

export const metadata = { title: "Sign up · PokeHub" };

const BENEFITS = [
  "Track every order in one place",
  "Save addresses for faster checkout",
  "Wishlist + price-drop alerts",
  "Sell to us with a 1-click offer flow",
];

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const { callbackUrl } = await searchParams;
  if (session?.user) redirect(callbackUrl ?? "/");

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <main
        style={{
          maxWidth: 520,
          margin: "0 auto",
          padding: "60px 32px 80px",
        }}
      >
        <div
          style={{
            background: "var(--ink)",
            color: "var(--bg)",
            borderRadius: 8,
            padding: 36,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 70% 0%, var(--accent) 0%, transparent 50%)",
              opacity: 0.18,
            }}
          />
          <div style={{ position: "relative" }}>
            <span
              className="pill"
              style={{
                background: "var(--accent)",
                color: "var(--ink-accent)",
                border: 0,
              }}
            >
              New here
            </span>
            <h1
              className="serif"
              style={{
                fontSize: 34,
                fontWeight: 500,
                letterSpacing: "-0.03em",
                margin: "10px 0 8px",
                color: "var(--bg)",
              }}
            >
              Create an account
            </h1>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.7)",
                marginTop: 0,
                marginBottom: 22,
              }}
            >
              One account for purchases, sell-to-us offers, and your collection.
            </p>
            <SignUpForm callbackUrl={callbackUrl} />
            <ul
              style={{
                marginTop: 26,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                fontSize: 13,
                color: "rgba(255,255,255,0.8)",
              }}
            >
              {BENEFITS.map((b) => (
                <li key={b} style={{ display: "flex", gap: 10 }}>
                  <Icon d={I.check} size={15} color="var(--accent-hi)" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p
          style={{
            marginTop: 24,
            fontSize: 13,
            color: "var(--ink-soft)",
            textAlign: "center",
          }}
        >
          Already have an account?{" "}
          <Link
            href={
              callbackUrl
                ? `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : "/signin"
            }
            style={{ color: "var(--accent)", fontWeight: 500 }}
          >
            Sign in
          </Link>
        </p>
      </main>
    </div>
  );
}
