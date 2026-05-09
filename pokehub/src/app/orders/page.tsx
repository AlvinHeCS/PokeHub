"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OrderLookupPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(
      `/orders/${orderNumber.trim()}?email=${encodeURIComponent(email.trim())}`,
    );
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">Find your order</h1>
      <p className="mt-2 text-gray-600">
        Enter your order number (from your confirmation email) and the email
        you used at checkout.
      </p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block">
          <div className="mb-1 text-sm font-medium">Order number</div>
          <input
            required
            placeholder="PHB-XXXXXX"
            className="w-full rounded border p-2 uppercase"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
          />
        </label>
        <label className="block">
          <div className="mb-1 text-sm font-medium">Email</div>
          <input
            required
            type="email"
            className="w-full rounded border p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className="rounded bg-blue-600 px-6 py-3 font-semibold text-white"
        >
          Find order
        </button>
      </form>
    </main>
  );
}
