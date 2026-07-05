/** Buchungs-Persistenz (lokal oder Upstash Redis) */

import type { Booking } from "@/lib/bookings";
import { readJson, writeJson } from "@/lib/persist";

const KEY = "bookings";

const seed: Booking[] = [
  {
    id: "seed-1",
    createdAt: "2026-06-01T10:00:00Z",
    start: "2026-07-10",
    end: "2026-07-19",
    persons: 4,
    extras: ["bedding"],
    name: "Familie Muster",
    email: "muster@example.ch",
    phone: "+41 79 000 00 01",
    payment: "twint",
    total: 2160,
    downpayment: 648,
    status: "bestätigt",
    paymentStatus: "anzahlung_bezahlt",
  },
  {
    id: "seed-2",
    createdAt: "2026-06-14T09:00:00Z",
    start: "2026-08-01",
    end: "2026-08-15",
    persons: 2,
    extras: ["wifi", "grill"],
    name: "Beispiel Gast",
    email: "gast@example.ch",
    phone: "+41 79 000 00 02",
    payment: "stripe",
    total: 3350,
    downpayment: 1005,
    status: "bestätigt",
    paymentStatus: "anzahlung_bezahlt",
  },
];

export async function readBookings(): Promise<Booking[]> {
  const data = await readJson<Booking[] | null>(KEY, null);
  if (data === null) {
    await writeBookings(seed);
    return [...seed];
  }
  return data;
}

export async function writeBookings(bookings: Booking[]) {
  await writeJson(KEY, bookings);
}

export async function updateBooking(id: string, patch: Partial<Booking>): Promise<Booking | null> {
  const bookings = await readBookings();
  const b = bookings.find((x) => x.id === id);
  if (!b) return null;
  Object.assign(b, patch);
  await writeBookings(bookings);
  return b;
}
