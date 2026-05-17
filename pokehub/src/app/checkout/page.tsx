import { CheckoutFlow } from "~/app/checkout/CheckoutFlow";

export const metadata = { title: "Checkout · PokeHub" };

export default function CheckoutPage() {
  return (
    <main style={{ maxWidth: 1180, margin: "0 auto" }}>
      <CheckoutFlow />
    </main>
  );
}
