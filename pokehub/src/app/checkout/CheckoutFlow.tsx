"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import { useState } from "react";

import { I, Icon } from "~/app/_components/editorial/placeholders";
import { CheckoutPayment } from "~/app/checkout/CheckoutPayment";
import { env } from "~/env";
import { cartSubtotalCents, shippingCents, useCart } from "~/lib/cart";
import { formatCents } from "~/lib/format";
import { api } from "~/trpc/react";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

interface AddressState {
  email: string;
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const emptyAddress: AddressState = {
  email: "",
  name: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "US",
};

type Step = "address" | "payment";

export function CheckoutFlow() {
  const lines = useCart((s) => s.lines);
  const subtotal = cartSubtotalCents(lines);
  const shipping = shippingCents(subtotal);
  const total = subtotal + shipping;

  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState<AddressState>(emptyAddress);
  const [intent, setIntent] = useState<{
    clientSecret: string;
    orderNumber: string;
  } | null>(null);

  const create = api.checkout.createPaymentIntent.useMutation({
    onSuccess: (data) => {
      setIntent({
        clientSecret: data.clientSecret,
        orderNumber: data.orderNumber,
      });
      setStep("payment");
    },
  });

  if (lines.length === 0 && !intent) {
    return (
      <div
        style={{
          maxWidth: 480,
          margin: "60px auto",
          padding: 40,
          background: "var(--paper)",
          border: "1px solid var(--line)",
          borderRadius: 8,
          textAlign: "center",
          color: "var(--ink-soft)",
          fontSize: 14,
        }}
      >
        Your bag is empty.{" "}
        <Link
          href="/shop"
          style={{
            color: "var(--accent)",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          Browse the shop
        </Link>
        .
      </div>
    );
  }

  function submitAddress(e: React.FormEvent) {
    e.preventDefault();
    create.mutate({
      email: address.email,
      shippingAddress: {
        name: address.name,
        line1: address.line1,
        line2: address.line2 || undefined,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
      },
      items: lines.map((l) => ({
        productId: l.productId,
        quantity: l.quantity,
      })),
    });
  }

  return (
    <div style={{ background: "var(--bg)" }}>
      <div
        style={{
          padding: "36px 32px 8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
        className="checkout-title-bar"
      >
        <div>
          <span className="eyebrow">Almost there</span>
          <h1
            className="serif"
            style={{
              fontSize: 44,
              fontWeight: 500,
              letterSpacing: "-0.035em",
              margin: "8px 0 0",
            }}
          >
            Checkout
          </h1>
        </div>
        {intent ? (
          <div
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--ink-mute)",
              letterSpacing: "0.08em",
            }}
          >
            ORDER #{intent.orderNumber} · DRAFT
          </div>
        ) : null}
      </div>

      <Stepper step={step} />

      <div
        style={{
          padding: "32px 32px 56px",
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: 32,
          alignItems: "flex-start",
        }}
        className="checkout-grid"
      >
        <div
          style={{
            background: "var(--paper)",
            border: "1px solid var(--line)",
            borderRadius: 8,
            padding: 32,
          }}
        >
          {step === "address" ? (
            <>
              <h2
                className="serif"
                style={{
                  fontSize: 26,
                  fontWeight: 500,
                  letterSpacing: "-0.025em",
                  marginTop: 0,
                }}
              >
                Shipping address
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--ink-soft)",
                  marginTop: 4,
                  marginBottom: 24,
                }}
              >
                We&apos;ll email tracking the moment your order ships.
              </p>
              <form
                onSubmit={submitAddress}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <Field
                  label="Email"
                  full
                  type="email"
                  value={address.email}
                  onChange={(v) => setAddress({ ...address, email: v })}
                  required
                />
                <Field
                  label="Full name"
                  full
                  value={address.name}
                  onChange={(v) => setAddress({ ...address, name: v })}
                  required
                />
                <Field
                  label="Address line 1"
                  full
                  value={address.line1}
                  onChange={(v) => setAddress({ ...address, line1: v })}
                  required
                />
                <Field
                  label="Address line 2 (optional)"
                  full
                  value={address.line2}
                  onChange={(v) => setAddress({ ...address, line2: v })}
                />
                <Field
                  label="City"
                  value={address.city}
                  onChange={(v) => setAddress({ ...address, city: v })}
                  required
                />
                <Field
                  label="State"
                  value={address.state}
                  onChange={(v) => setAddress({ ...address, state: v })}
                  required
                />
                <Field
                  label="ZIP"
                  value={address.postalCode}
                  onChange={(v) => setAddress({ ...address, postalCode: v })}
                  required
                />
                <Field
                  label="Country"
                  maxLength={2}
                  value={address.country}
                  onChange={(v) =>
                    setAddress({ ...address, country: v.toUpperCase() })
                  }
                  required
                />
                <div
                  style={{
                    gridColumn: "1 / -1",
                    marginTop: 10,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Link
                    href="/cart"
                    style={{
                      fontSize: 13,
                      color: "var(--ink-soft)",
                      textDecoration: "none",
                    }}
                  >
                    ← Back to bag
                  </Link>
                  <button
                    type="submit"
                    disabled={create.isPending}
                    className="btn"
                    style={{
                      padding: "12px 22px",
                      opacity: create.isPending ? 0.6 : 1,
                    }}
                  >
                    {create.isPending
                      ? "Reserving items…"
                      : "Continue to payment"}{" "}
                    <Icon d={I.arrowR} size={14} />
                  </button>
                </div>
                {create.error ? (
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      color: "var(--danger)",
                      fontSize: 13,
                    }}
                  >
                    {create.error.message}
                  </div>
                ) : null}
              </form>
            </>
          ) : null}

          {step === "payment" && intent ? (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret: intent.clientSecret }}
            >
              <CheckoutPayment
                orderNumber={intent.orderNumber}
                email={address.email}
              />
            </Elements>
          ) : null}
        </div>

        <aside
          style={{
            background: "var(--paper)",
            border: "1px solid var(--line)",
            borderRadius: 8,
            padding: 24,
            position: "sticky",
            top: 16,
          }}
        >
          <h3
            className="serif"
            style={{ fontSize: 18, fontWeight: 500, marginTop: 0 }}
          >
            Order summary
          </h3>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "14px 0",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              paddingBottom: 14,
              borderBottom: "1px solid var(--line-soft)",
            }}
          >
            {lines.map((l) => (
              <li
                key={l.productId}
                style={{
                  display: "grid",
                  gridTemplateColumns: "44px 1fr auto",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                {l.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={l.imageUrl}
                    alt=""
                    style={{
                      width: 44,
                      height: 62,
                      objectFit: "contain",
                      background: "var(--bg-alt)",
                      borderRadius: 3,
                      padding: 3,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 44,
                      height: 62,
                      background: "var(--bg-alt)",
                      borderRadius: 3,
                    }}
                  />
                )}
                <div>
                  <div
                    className="serif"
                    style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.2 }}
                  >
                    {l.name}
                  </div>
                  <div
                    className="mono"
                    style={{
                      fontSize: 11,
                      color: "var(--ink-mute)",
                      marginTop: 2,
                    }}
                  >
                    {l.variant} ×{l.quantity}
                  </div>
                </div>
                <div
                  className="serif num"
                  style={{ fontSize: 14, fontWeight: 600 }}
                >
                  {formatCents(l.priceCents * l.quantity)}
                </div>
              </li>
            ))}
          </ul>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: "14px 0",
              borderBottom: "1px solid var(--line-soft)",
              fontSize: 13,
            }}
          >
            <Row label="Subtotal" value={formatCents(subtotal)} />
            <Row
              label="Shipping (tracked + insured)"
              value={shipping === 0 ? "Free" : formatCents(shipping)}
              positive={shipping === 0}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 14,
              alignItems: "baseline",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 500 }}>Total</span>
            <span
              className="serif num"
              style={{
                fontSize: 26,
                fontWeight: 600,
                letterSpacing: "-0.025em",
              }}
            >
              {formatCents(total)}
            </span>
          </div>
          <p
            style={{
              marginTop: 14,
              fontSize: 11,
              color: "var(--ink-mute)",
              lineHeight: 1.6,
            }}
          >
            Items are reserved for 15 minutes once checkout begins.
          </p>
          <div
            style={{
              marginTop: 14,
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span className="pill">
              <Icon d={I.shield} size={11} /> Authenticated
            </span>
            <span className="pill">
              <Icon d={I.refresh} size={11} /> 30-day returns
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const steps: { label: string; state: "done" | "active" | "todo" }[] = [
    { label: "Bag", state: "done" },
    {
      label: "Address",
      state: step === "address" ? "active" : "done",
    },
    {
      label: "Payment",
      state: step === "payment" ? "active" : "todo",
    },
    { label: "Confirm", state: "todo" },
  ];
  return (
    <div style={{ padding: "24px 32px 0" }} className="checkout-stepper">
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        {steps.map((s, i) => (
          <div
            key={s.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flex: i < steps.length - 1 ? "0 0 auto" : "0 0 auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 11,
                  fontWeight: 600,
                  background:
                    s.state === "todo"
                      ? "var(--bg-alt)"
                      : s.state === "done"
                        ? "var(--accent)"
                        : "var(--ink)",
                  color: s.state === "todo" ? "var(--ink-mute)" : "var(--bg)",
                  border:
                    "1px solid " +
                    (s.state === "todo" ? "var(--line)" : "transparent"),
                }}
              >
                {s.state === "done" ? (
                  <Icon d={I.check} size={13} stroke={2.5} />
                ) : (
                  i + 1
                )}
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: s.state === "active" ? 500 : 400,
                  color:
                    s.state === "active" ? "var(--ink)" : "var(--ink-mute)",
                }}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 ? (
              <div
                style={{
                  flex: 1,
                  width: 60,
                  height: 1,
                  background: "var(--line)",
                }}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  full,
  value,
  onChange,
  type = "text",
  required,
  maxLength,
}: {
  label: string;
  full?: boolean;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <label style={{ display: "block", gridColumn: full ? "1 / -1" : "auto" }}>
      <div
        className="eyebrow"
        style={{ fontSize: 10, marginBottom: 8, color: "var(--ink-soft)" }}
      >
        {label}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        maxLength={maxLength}
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

function Row({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: "var(--ink-soft)" }}>{label}</span>
      <span
        className="mono num"
        style={{
          fontWeight: 500,
          color: positive ? "var(--positive)" : "var(--ink)",
        }}
      >
        {value}
      </span>
    </div>
  );
}
