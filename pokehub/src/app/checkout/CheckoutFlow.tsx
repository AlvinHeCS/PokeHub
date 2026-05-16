"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import { useState } from "react";

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

export function CheckoutFlow() {
  const lines = useCart((s) => s.lines);
  const subtotal = cartSubtotalCents(lines);
  const shipping = shippingCents(subtotal);
  const total = subtotal + shipping;

  const [step, setStep] = useState<"address" | "payment">("address");
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
      <div className="text-gray-600">
        Your cart is empty.{" "}
        <Link href="/shop" className="underline">
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
    <div className="grid gap-8 md:grid-cols-[1fr_300px]">
      <div>
        {step === "address" ? (
          <form onSubmit={submitAddress} className="space-y-4">
            <h2 className="text-lg font-semibold">Shipping address</h2>

            <Field label="Email">
              <input
                required
                type="email"
                className="w-full rounded border p-2"
                value={address.email}
                onChange={(e) =>
                  setAddress({ ...address, email: e.target.value })
                }
              />
            </Field>
            <Field label="Full name">
              <input
                required
                className="w-full rounded border p-2"
                value={address.name}
                onChange={(e) =>
                  setAddress({ ...address, name: e.target.value })
                }
              />
            </Field>
            <Field label="Address line 1">
              <input
                required
                className="w-full rounded border p-2"
                value={address.line1}
                onChange={(e) =>
                  setAddress({ ...address, line1: e.target.value })
                }
              />
            </Field>
            <Field label="Address line 2 (optional)">
              <input
                className="w-full rounded border p-2"
                value={address.line2}
                onChange={(e) =>
                  setAddress({ ...address, line2: e.target.value })
                }
              />
            </Field>
            <div className="flex gap-3">
              <Field label="City">
                <input
                  required
                  className="w-full rounded border p-2"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                />
              </Field>
              <Field label="State">
                <input
                  required
                  className="w-24 rounded border p-2"
                  value={address.state}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                />
              </Field>
              <Field label="ZIP">
                <input
                  required
                  className="w-28 rounded border p-2"
                  value={address.postalCode}
                  onChange={(e) =>
                    setAddress({ ...address, postalCode: e.target.value })
                  }
                />
              </Field>
            </div>
            <Field label="Country">
              <input
                required
                maxLength={2}
                className="w-20 rounded border p-2 uppercase"
                value={address.country}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    country: e.target.value.toUpperCase(),
                  })
                }
              />
            </Field>

            <button
              type="submit"
              disabled={create.isPending}
              className="rounded bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
            >
              {create.isPending ? "Reserving items…" : "Continue to payment"}
            </button>
            {create.error ? (
              <div className="text-red-600">{create.error.message}</div>
            ) : null}
          </form>
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

      <aside className="rounded border p-4 text-sm">
        <h3 className="mb-3 font-semibold">Summary</h3>
        <ul className="mb-3 space-y-2">
          {lines.map((l) => (
            <li key={l.productId} className="flex justify-between gap-2">
              <span className="truncate">
                {l.name} ×{l.quantity}
              </span>
              <span>{formatCents(l.priceCents * l.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-1 border-t pt-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCents(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {shipping === 0 ? "Free" : formatCents(shipping)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-1 font-bold">
            <span>Total</span>
            <span>{formatCents(total)}</span>
          </div>
        </div>
      </aside>
    </div>
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
