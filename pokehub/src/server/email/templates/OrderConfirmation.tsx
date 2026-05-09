import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface Props {
  orderNumber: string;
  email: string;
  items: {
    name: string;
    variant: string;
    quantity: number;
    priceCents: number;
  }[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  orderUrl: string;
}

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function OrderConfirmation({
  orderNumber,
  items,
  subtotalCents,
  shippingCents,
  totalCents,
  orderUrl,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Order {orderNumber} confirmed</Preview>
      <Body style={{ fontFamily: "sans-serif" }}>
        <Container>
          <Heading>Order confirmed: {orderNumber}</Heading>
          <Text>
            Thanks for shopping with PokeHub. We&apos;ll email you again when
            your order ships.
          </Text>
          <Section>
            {items.map((it, i) => (
              <Text key={i}>
                {it.name} ({it.variant}) × {it.quantity} —{" "}
                {formatCents(it.priceCents * it.quantity)}
              </Text>
            ))}
          </Section>
          <Hr />
          <Text>Subtotal: {formatCents(subtotalCents)}</Text>
          <Text>
            Shipping:{" "}
            {shippingCents === 0 ? "Free" : formatCents(shippingCents)}
          </Text>
          <Text>
            <strong>Total: {formatCents(totalCents)}</strong>
          </Text>
          <Hr />
          <Text>
            View your order: <a href={orderUrl}>{orderUrl}</a>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
