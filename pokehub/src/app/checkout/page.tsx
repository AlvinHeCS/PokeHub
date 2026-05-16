import { CheckoutFlow } from "~/app/checkout/CheckoutFlow";

export const metadata = { title: "Checkout · PokeHub" };

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
      <CheckoutFlow />
    </main>
  );
}
