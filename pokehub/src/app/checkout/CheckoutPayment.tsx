"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">Payment</h2>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="rounded bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
      >
        {submitting ? "Processing…" : "Pay"}
      </button>
      {error ? <div className="text-red-600">{error}</div> : null}
    </form>
  );
}
