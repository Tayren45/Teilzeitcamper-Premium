import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { updateBooking } from "@/lib/bookings-db";
import { notifyOwner } from "@/lib/notify";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Webhook nicht konfiguriert." }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Keine Signatur." }, { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch {
    return NextResponse.json({ error: "Ungültige Signatur." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;
    if (bookingId) {
      const updated = await updateBooking(bookingId, {
        paymentStatus: "anzahlung_bezahlt",
        stripeSessionId: session.id,
        status: "bestätigt",
      });
      if (updated) {
        await notifyOwner(
          `Anzahlung eingegangen — ${updated.name}`,
          `Buchung ${bookingId} · CHF ${updated.downpayment.toFixed(2)} via Stripe.\nZeitraum: ${updated.start} – ${updated.end}`
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
