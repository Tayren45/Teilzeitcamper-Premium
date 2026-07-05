/**
 * Buchungs-API
 *  GET  → belegte Zeiträume | mit Admin-Key: alle Buchungen
 *  POST → Buchungsanfrage + optional Stripe Checkout (Anzahlung)
 *  PATCH → Admin: Status ändern
 */

import { NextRequest, NextResponse } from "next/server";
import { calcPrice } from "@/lib/pricing";
import { rangeOverlaps, fmtDate, type Booking } from "@/lib/bookings";
import { readBookings, writeBookings } from "@/lib/bookings-db";
import { notifyOwner } from "@/lib/notify";
import { createCheckoutSession } from "@/lib/stripe";

const ADMIN_KEY = process.env.ADMIN_KEY || "teilzeit-admin";

export async function GET(req: NextRequest) {
  const bookings = await readBookings();
  const isAdmin = req.headers.get("x-admin-key") === ADMIN_KEY;

  if (isAdmin) {
    return NextResponse.json({ bookings });
  }
  const ranges = bookings
    .filter((b) => b.status !== "storniert")
    .map((b) => ({ start: b.start, end: b.end, status: b.status }));
  return NextResponse.json({ ranges });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const { start, end, persons, extras, name, email, phone, message, payment, discountCode, payNow } =
    body as Partial<Booking> & { discountCode?: string; payNow?: boolean };

  if (!start || !end || !name || !email || !phone || !payment) {
    return NextResponse.json({ error: "Bitte alle Pflichtfelder ausfüllen." }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end)) {
    return NextResponse.json({ error: "Ungültiges Datumsformat." }, { status: 400 });
  }
  if (!/.+@.+\..+/.test(String(email))) {
    return NextResponse.json({ error: "Bitte gültige E-Mail-Adresse angeben." }, { status: 400 });
  }

  const price = calcPrice(start, end, (extras as string[]) ?? [], Number(persons) || 2, discountCode);
  if (!price) {
    return NextResponse.json({ error: "Enddatum muss nach dem Startdatum liegen." }, { status: 400 });
  }
  if (!price.meetsMinNights) {
    return NextResponse.json(
      { error: `Mindestmietdauer in diesem Zeitraum: ${price.minNights} Nächte.` },
      { status: 400 }
    );
  }

  const bookings = await readBookings();
  if (rangeOverlaps(start, end, bookings.filter((b) => b.status !== "storniert"))) {
    return NextResponse.json(
      { error: "Der gewählte Zeitraum ist leider bereits belegt. Bitte wähle andere Daten." },
      { status: 409 }
    );
  }

  const booking: Booking = {
    id: `tc-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    start,
    end,
    persons: Number(persons) || 2,
    extras: (extras as string[]) ?? [],
    name: String(name).slice(0, 120),
    email: String(email).slice(0, 160),
    phone: String(phone).slice(0, 40),
    message: message ? String(message).slice(0, 2000) : undefined,
    payment: String(payment),
    total: price.total,
    downpayment: price.downpayment,
    discountCode: price.discount?.code,
    status: "angefragt",
    paymentStatus: "ausstehend",
  };

  bookings.push(booking);
  await writeBookings(bookings);

  await notifyOwner(
    `Neue Buchungsanfrage — ${booking.name}`,
    [
      `Zeitraum: ${fmtDate(booking.start)} – ${fmtDate(booking.end)}`,
      `Personen: ${booking.persons}`,
      `Total: CHF ${booking.total.toFixed(2)} (Anzahlung CHF ${booking.downpayment.toFixed(2)})`,
      `Zahlungsart: ${booking.payment}`,
      "",
      booking.name,
      booking.email,
      booking.phone,
      booking.message ? `\n${booking.message}` : "",
    ]
      .filter(Boolean)
      .join("\n")
  );

  let checkoutUrl: string | null = null;
  if (payNow !== false && process.env.STRIPE_SECRET_KEY) {
    checkoutUrl = await createCheckoutSession(booking);
  }

  return NextResponse.json({ ok: true, booking, price, checkoutUrl });
}

export async function PATCH(req: NextRequest) {
  if (req.headers.get("x-admin-key") !== ADMIN_KEY) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }
  const { id, status } = (await req.json()) as { id: string; status: Booking["status"] };
  const bookings = await readBookings();
  const b = bookings.find((x) => x.id === id);
  if (!b) return NextResponse.json({ error: "Buchung nicht gefunden." }, { status: 404 });
  b.status = status;
  await writeBookings(bookings);
  return NextResponse.json({ ok: true });
}
