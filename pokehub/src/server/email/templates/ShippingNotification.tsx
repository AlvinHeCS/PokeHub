import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface Props {
  orderNumber: string;
  trackingNumber: string;
  orderUrl: string;
}

export function ShippingNotification({
  orderNumber,
  trackingNumber,
  orderUrl,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your PokeHub order has shipped</Preview>
      <Body style={{ fontFamily: "sans-serif" }}>
        <Container>
          <Heading>Your order is on the way</Heading>
          <Text>Order: {orderNumber}</Text>
          <Text>Tracking: {trackingNumber}</Text>
          <Text>
            View order: <a href={orderUrl}>{orderUrl}</a>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
