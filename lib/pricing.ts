/**
 * Preislogik — Saisonpreise, Extras, Rabattcodes.
 * Wird sowohl im Preisrechner (Client) als auch in der Buchungs-API (Server)
 * verwendet, damit Preise nie nur clientseitig berechnet werden.
 */

import { vehicle } from "./vehicle";

export type SeasonId = "neben" | "zwischen" | "haupt";

export const seasons: Record<
  SeasonId,
  { name: string; months: number[]; pricePerNight: number; minNights: number }
> = {
  neben: { name: "Nebensaison", months: [11, 12, 1, 2, 3], pricePerNight: 145, minNights: 3 },
  zwischen: { name: "Zwischensaison", months: [4, 5, 10], pricePerNight: 175, minNights: 3 },
  haupt: { name: "Hauptsaison", months: [6, 7, 8, 9], pricePerNight: 205, minNights: 5 },
};

export const CLEANING_FEE = 120;
export const DEPOSIT = 1500; // Kaution (wird nicht im Mietpreis verrechnet)
export const DOWNPAYMENT_RATE = 0.3; // 30% Anzahlung bei Buchung
export const KM_PER_DAY = 200;
export const EXTRA_KM_PRICE = 0.35;

export type DiscountCode = {
  code: string;
  percent: number;
  label: string;
  /** Bedingung, z.B. Frühbucher nur >90 Tage im Voraus */
  isValid: (start: Date) => boolean;
};

export const discountCodes: DiscountCode[] = [
  {
    code: "FRUEHBUCHER10",
    percent: 10,
    label: "Frühbucher-Rabatt (Anreise in mehr als 90 Tagen)",
    isValid: (start) => (start.getTime() - Date.now()) / 86_400_000 > 90,
  },
  {
    code: "LASTMINUTE15",
    percent: 15,
    label: "Last-Minute-Rabatt (Anreise innerhalb 14 Tagen)",
    isValid: (start) => (start.getTime() - Date.now()) / 86_400_000 <= 14,
  },
  {
    code: "WILLKOMMEN5",
    percent: 5,
    label: "Willkommens-Rabatt für Erstmieter",
    isValid: () => true,
  },
];

export function seasonForDate(d: Date): SeasonId {
  const m = d.getMonth() + 1;
  if (seasons.haupt.months.includes(m)) return "haupt";
  if (seasons.zwischen.months.includes(m)) return "zwischen";
  return "neben";
}

export type PriceBreakdown = {
  nights: number;
  nightsBySeason: { season: SeasonId; name: string; nights: number; pricePerNight: number; total: number }[];
  extras: { id: string; name: string; qty: number; total: number }[];
  cleaning: number;
  subtotal: number;
  discount: { code: string; percent: number; amount: number } | null;
  total: number;
  downpayment: number;
  minNights: number;
  meetsMinNights: boolean;
};

export function calcPrice(
  startISO: string,
  endISO: string,
  extraIds: string[],
  persons: number,
  code?: string
): PriceBreakdown | null {
  const start = new Date(startISO + "T12:00:00");
  const end = new Date(endISO + "T12:00:00");
  if (!(start < end)) return null;

  const nights = Math.round((end.getTime() - start.getTime()) / 86_400_000);

  // Nächte pro Saison zählen (Übergänge korrekt abrechnen)
  const counts: Record<SeasonId, number> = { neben: 0, zwischen: 0, haupt: 0 };
  let minNights = 3;
  const cursor = new Date(start);
  for (let i = 0; i < nights; i++) {
    const s = seasonForDate(cursor);
    counts[s]++;
    minNights = Math.max(minNights, seasons[s].minNights);
    cursor.setDate(cursor.getDate() + 1);
  }

  const nightsBySeason = (Object.keys(counts) as SeasonId[])
    .filter((s) => counts[s] > 0)
    .map((s) => ({
      season: s,
      name: seasons[s].name,
      nights: counts[s],
      pricePerNight: seasons[s].pricePerNight,
      total: counts[s] * seasons[s].pricePerNight,
    }));

  const extras = extraIds
    .map((id) => vehicle.extras.find((e) => e.id === id))
    .filter((e): e is NonNullable<typeof e> => Boolean(e))
    .map((e) => {
      const qty = e.unit === "pro Nacht" ? nights : e.unit === "pro Person" ? persons : 1;
      return { id: e.id, name: e.name, qty, total: qty * e.price };
    });

  const rentTotal = nightsBySeason.reduce((a, b) => a + b.total, 0);
  const extrasTotal = extras.reduce((a, b) => a + b.total, 0);
  const subtotal = rentTotal + extrasTotal + CLEANING_FEE;

  let discount: PriceBreakdown["discount"] = null;
  if (code) {
    const dc = discountCodes.find((d) => d.code === code.trim().toUpperCase());
    if (dc && dc.isValid(start)) {
      // Rabatt nur auf den Mietpreis, nicht auf Reinigung/Extras
      discount = { code: dc.code, percent: dc.percent, amount: Math.round(rentTotal * (dc.percent / 100)) };
    }
  }

  const total = subtotal - (discount?.amount ?? 0);
  return {
    nights,
    nightsBySeason,
    extras,
    cleaning: CLEANING_FEE,
    subtotal,
    discount,
    total,
    downpayment: Math.round(total * DOWNPAYMENT_RATE),
    minNights,
    meetsMinNights: nights >= minNights,
  };
}

export const chf = (n: number) =>
  "CHF " + n.toLocaleString("de-CH", { maximumFractionDigits: 0 }).replace(/,/g, "'");
