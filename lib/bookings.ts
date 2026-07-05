/** Buchungs-Typen + Datumshelfer (Client & Server) */

export type BookingStatus = "angefragt" | "bestätigt" | "storniert";
export type PaymentStatus = "ausstehend" | "anzahlung_bezahlt";

export type Booking = {
  id: string;
  createdAt: string;
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD (Rückgabetag)
  persons: number;
  extras: string[];
  name: string;
  email: string;
  phone: string;
  message?: string;
  payment: string; // twint | stripe | paypal | applepay | googlepay
  total: number;
  downpayment: number;
  discountCode?: string;
  status: BookingStatus;
  paymentStatus?: PaymentStatus;
  stripeSessionId?: string;
};

export type BookedRange = { start: string; end: string; status: BookingStatus };

export const toISO = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const fmtDate = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("de-CH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/** Liegt `day` (ISO) in einem belegten Bereich? Rückgabetag zählt als frei ab Mittag → wir blocken ihn konservativ mit. */
export function isDayBooked(day: string, ranges: BookedRange[]): boolean {
  return ranges.some((r) => r.status !== "storniert" && day >= r.start && day <= r.end);
}

export function rangeOverlaps(start: string, end: string, ranges: BookedRange[]): boolean {
  return ranges.some((r) => r.status !== "storniert" && start <= r.end && end >= r.start);
}

/** Findet den nächsten freien Zeitraum von mindestens `minNights` Nächten (für das Live-Badge im Hero). */
export function nextFreeWindow(ranges: BookedRange[], minNights = 3): { start: string; end: string } | null {
  const cursor = new Date();
  cursor.setDate(cursor.getDate() + 2); // Vorlauf für Übergabe
  for (let i = 0; i < 365; i++) {
    const start = toISO(cursor);
    const endD = new Date(cursor);
    endD.setDate(endD.getDate() + minNights);
    const end = toISO(endD);
    if (!rangeOverlaps(start, end, ranges)) return { start, end };
    cursor.setDate(cursor.getDate() + 1);
  }
  return null;
}
