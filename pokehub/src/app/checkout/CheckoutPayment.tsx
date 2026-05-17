"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";

import { I, Icon } from "~/app/_components/editorial/placeholders";
import { env } from "~/env";

export function CheckoutPayment({
  orderNumber,
  email,
}: {
  orderNumber: string;
  email: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${env.NEXT_PUBLIC_SITE_URL}/orders/${orderNumber}?email=${encodeURIComponent(email)}`,
        receipt_email: email,
      },
    });

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed");
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >
      <h2
        className="serif"
        style={{
          fontSize: 26,
          fontWeight: 500,
          letterSpacing: "-0.025em",
          marginTop: 0,
        }}
      >
        Payment
      </h2>
      <p
        style={{
          fontSize: 13,
          color: "var(--ink-soft)",
          marginTop: -8,
        }}
      >
        Secured by Stripe. Cards, Apple Pay, and Google Pay accepted.
      </p>
      <div
        style={{
          background: "var(--bg)",
          border: "1px solid var(--line)",
          borderRadius: 6,
          padding: 16,
        }}
      >
        <PaymentElement />
      </div>
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="btn"
        style={{
          padding: "14px 22px",
          fontSize: 15,
          opacity: !stripe || submitting ? 0.6 : 1,
        }}
      >
        {submitting ? "Processing…" : "Pay securely"}{" "}
        <Icon d={I.arrowR} size={14} />
      </button>
      {error ? (
        <div style={{ color: "var(--danger)", fontSize: 13 }}>{error}</div>
      ) : null}
    </form>
  );
}
