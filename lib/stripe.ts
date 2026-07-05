import Stripe from "stripe";
import type { Booking } from "@/lib/bookings";

let stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripe) stripe = new Stripe(key, { apiVersion: "2026-06-24.dahlia" });
  return stripe;
}

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3123";
}

/** Stripe Checkout für 30%-Anzahlung (TWINT, Karte, Apple/Google Pay). */
export async function createCheckoutSession(booking: Booking): Promise<string | null> {
  const s = getStripe();
  if (!s) return null;

  const amount = Math.round(booking.downpayment * 100);
  if (amount < 50) return null;

  const base = siteUrl();
  const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
    quantity: 1,
    price_data: {
      currency: "chf",
      unit_amount: amount,
      product_data: {
        name: `Anzahlung · Buchung ${booking.id}`,
        description: `Teilzeitcamper Carado T447 · ${booking.start} – ${booking.end}`,
      },
    },
  };

  const common: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    customer_email: booking.email,
    line_items: [lineItem],
    metadata: { bookingId: booking.id },
    success_url: `${base}/buchung/erfolg?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/buchung/abgebrochen?booking=${booking.id}`,
  };

  if (booking.payment === "twint") {
    const session = await s.checkout.sessions.create({
      ...common,
      payment_method_types: ["twint"],
    });
    return session.url;
  }

  if (booking.payment === "paypal") {
    const session = await s.checkout.sessions.create({
      ...common,
      payment_method_types: ["paypal"],
    });
    return session.url;
  }

  const session = await s.checkout.sessions.create({
    ...common,
    payment_method_types: ["card"],
  });
  return session.url;
}
