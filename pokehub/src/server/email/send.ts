import "server-only";

import { render } from "@react-email/render";

import { env } from "~/env";
import { resend } from "~/server/email/client";
import { OrderConfirmation } from "~/server/email/templates/OrderConfirmation";
import { ShippingNotification } from "~/server/email/templates/ShippingNotification";

export async function sendOrderConfirmation(args: {
  to: string;
  orderNumber: string;
  items: {
    name: string;
    variant: string;
    quantity: number;
    priceCents: number;
  }[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
}) {
  const orderUrl = `${env.NEXT_PUBLIC_SITE_URL}/orders/${args.orderNumber}?email=${encodeURIComponent(args.to)}`;
  const html = await render(
    OrderConfirmation({ ...args, email: args.to, orderUrl }),
  );
  return resend.emails.send({
    from: env.EMAIL_FROM,
    to: args.to,
    subject: `Order ${args.orderNumber} confirmed`,
    html,
  });
}

export async function sendShippingNotification(args: {
  to: string;
  orderNumber: string;
  trackingNumber: string;
}) {
  const orderUrl = `${env.NEXT_PUBLIC_SITE_URL}/orders/${args.orderNumber}?email=${encodeURIComponent(args.to)}`;
  const html = await render(
    ShippingNotification({
      orderNumber: args.orderNumber,
      trackingNumber: args.trackingNumber,
      orderUrl,
    }),
  );
  return resend.emails.send({
    from: env.EMAIL_FROM,
    to: args.to,
    subject: `Your PokeHub order has shipped`,
    html,
  });
}
