import { NextRequest, NextResponse } from "next/server";
import { readBookings, updateBooking } from "@/lib/bookings-db";
import { createCheckoutSession } from "@/lib/stripe";

const ADMIN_KEY = process.env.ADMIN_KEY || "teilzeit-admin";

/** POST { bookingId } → Stripe Checkout URL (Admin oder nach Buchung). */
export async function POST(req: NextRequest) {
  let body: { bookingId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const { bookingId } = body;
  if (!bookingId) {
    return NextResponse.json({ error: "bookingId fehlt." }, { status: 400 });
  }

  const bookings = await readBookings();
  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking) {
    return NextResponse.json({ error: "Buchung nicht gefunden." }, { status: 404 });
  }

  if (booking.paymentStatus === "anzahlung_bezahlt") {
    return NextResponse.json({ error: "Anzahlung bereits bezahlt." }, { status: 400 });
  }

  const url = await createCheckoutSession(booking);
  if (!url) {
    return NextResponse.json(
      { error: "Stripe nicht konfiguriert. STRIPE_SECRET_KEY in .env.local setzen." },
      { status: 503 }
    );
  }

  return NextResponse.json({ url });
}

/** GET mit Admin-Key: Zahlungslink für Buchung erzeugen. */
export async function GET(req: NextRequest) {
  if (req.headers.get("x-admin-key") !== ADMIN_KEY) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }
  const bookingId = req.nextUrl.searchParams.get("bookingId");
  if (!bookingId) return NextResponse.json({ error: "bookingId fehlt." }, { status: 400 });

  const bookings = await readBookings();
  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking) return NextResponse.json({ error: "Buchung nicht gefunden." }, { status: 404 });

  const url = await createCheckoutSession(booking);
  if (!url) return NextResponse.json({ error: "Stripe nicht konfiguriert." }, { status: 503 });
  return NextResponse.json({ url });
}
