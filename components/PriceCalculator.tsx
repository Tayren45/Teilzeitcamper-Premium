"use client";

/** Interaktiver Preisrechner — Saisonlogik, Extras, Rabattcodes, Live-Summe */

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { calcPrice, chf, discountCodes } from "@/lib/pricing";
import { vehicle } from "@/lib/vehicle";
import { toISO } from "@/lib/bookings";

export default function PriceCalculator({ compact = false }: { compact?: boolean }) {
  const defaultStart = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 21);
    return toISO(d);
  }, []);
  const defaultEnd = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 28);
    return toISO(d);
  }, []);

  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(defaultEnd);
  const [persons, setPersons] = useState(2);
  const [extras, setExtras] = useState<string[]>([]);
  const [code, setCode] = useState("");

  const price = useMemo(
    () => (start && end ? calcPrice(start, end, extras, persons, code) : null),
    [start, end, extras, persons, code]
  );

  const codeInvalid =
    code.trim() !== "" &&
    (!price?.discount || price.discount.code !== code.trim().toUpperCase()) &&
    discountCodes.some(() => true);

  const toggleExtra = (id: string) =>
    setExtras((xs) => (xs.includes(id) ? xs.filter((x) => x !== id) : [...xs, id]));

  return (
    <div className={`glass-strong rounded-3xl p-6 shadow-lift sm:p-8 ${compact ? "" : "lg:p-10"}`}>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Eingaben */}
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Abholung</span>
              <input
                type="date"
                value={start}
                min={toISO(new Date())}
                onChange={(e) => setStart(e.target.value)}
                className="w-full rounded-xl border border-pine-200 bg-white/70 px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-pine-500 dark:border-pine-800 dark:bg-night-800"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Rückgabe</span>
              <input
                type="date"
                value={end}
                min={start}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full rounded-xl border border-pine-200 bg-white/70 px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-pine-500 dark:border-pine-800 dark:bg-night-800"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Personen</span>
            <div className="flex w-fit items-center gap-3 rounded-full border border-pine-200 px-2 py-1 dark:border-pine-800">
              <button type="button" aria-label="Weniger Personen"
                onClick={() => setPersons((p) => Math.max(1, p - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full text-lg transition-colors hover:bg-pine-100 dark:hover:bg-pine-900">−</button>
              <span className="w-6 text-center font-bold">{persons}</span>
              <button type="button" aria-label="Mehr Personen"
                onClick={() => setPersons((p) => Math.min(4, p + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full text-lg transition-colors hover:bg-pine-100 dark:hover:bg-pine-900">+</button>
            </div>
          </label>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold">Extras</legend>
            <div className="flex flex-wrap gap-2">
              {vehicle.extras.map((e) => (
                <button
                  type="button"
                  key={e.id}
                  onClick={() => toggleExtra(e.id)}
                  aria-pressed={extras.includes(e.id)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 active:scale-95 ${
                    extras.includes(e.id)
                      ? "border-pine-800 bg-pine-800 text-white dark:border-pine-500 dark:bg-pine-500"
                      : "border-pine-200 hover:border-pine-500 dark:border-pine-800"
                  }`}
                >
                  {e.name} · CHF {e.price}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Rabattcode</span>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="z.B. FRUEHBUCHER10"
              className="w-full rounded-xl border border-pine-200 bg-white/70 px-3.5 py-2.5 text-sm uppercase outline-none transition-shadow placeholder:normal-case focus:ring-2 focus:ring-pine-500 dark:border-pine-800 dark:bg-night-800"
            />
            {price?.discount && (
              <span className="mt-1 block text-xs font-semibold text-green-600 dark:text-green-400">
                ✓ {price.discount.percent}% Rabatt aktiv
              </span>
            )}
            {codeInvalid && (
              <span className="mt-1 block text-xs text-terra-500">
                Code ungültig oder Bedingungen nicht erfüllt
              </span>
            )}
          </label>
        </div>

        {/* Ergebnis */}
        <div className="flex flex-col rounded-2xl bg-pine-950 p-6 text-sand-100 dark:bg-night-800">
          <h3 className="font-display text-lg font-semibold">Deine Reise</h3>
          {price ? (
            <>
              <ul className="mt-4 flex-1 space-y-2 text-sm">
                {price.nightsBySeason.map((s) => (
                  <li key={s.season} className="flex justify-between">
                    <span>{s.nights} × Nacht {s.name} ({chf(s.pricePerNight)})</span>
                    <span className="font-semibold">{chf(s.total)}</span>
                  </li>
                ))}
                {price.extras.map((e) => (
                  <li key={e.id} className="flex justify-between text-sand-100/80">
                    <span>{e.name}{e.qty > 1 ? ` × ${e.qty}` : ""}</span>
                    <span>{chf(e.total)}</span>
                  </li>
                ))}
                <li className="flex justify-between text-sand-100/80">
                  <span>Endreinigung</span><span>{chf(price.cleaning)}</span>
                </li>
                <AnimatePresence>
                  {price.discount && (
                    <motion.li
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-between font-semibold text-green-400"
                    >
                      <span>Rabatt {price.discount.code}</span>
                      <span>− {chf(price.discount.amount)}</span>
                    </motion.li>
                  )}
                </AnimatePresence>
              </ul>

              <div className="mt-4 border-t border-white/15 pt-4">
                <div className="flex items-end justify-between">
                  <span className="text-sm text-sand-100/70">Total ({price.nights} Nächte)</span>
                  <motion.span
                    key={price.total}
                    initial={{ scale: 1.15, color: "#eab391" }}
                    animate={{ scale: 1, color: "#ffffff" }}
                    className="font-display text-3xl font-bold"
                  >
                    {chf(price.total)}
                  </motion.span>
                </div>
                <p className="mt-1 text-xs text-sand-100/60">
                  Anzahlung heute: {chf(price.downpayment)} · Kaution CHF 1'500 bei Übergabe · 200 km/Tag inklusive
                </p>
                {!price.meetsMinNights && (
                  <p className="mt-2 rounded-lg bg-terra-500/20 px-3 py-2 text-xs font-semibold text-terra-300">
                    Mindestmietdauer in diesem Zeitraum: {price.minNights} Nächte
                  </p>
                )}
                <Link
                  href={`/buchung?start=${start}&end=${end}&personen=${persons}${extras.length ? `&extras=${extras.join(",")}` : ""}${price.discount ? `&code=${price.discount.code}` : ""}`}
                  className={`btn-primary mt-4 w-full !bg-terra-500 hover:!bg-terra-400 ${!price.meetsMinNights ? "pointer-events-none opacity-50" : ""}`}
                >
                  Diese Daten buchen →
                </Link>
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm text-sand-100/70">Wähle Abhol- und Rückgabedatum.</p>
          )}
        </div>
      </div>
    </div>
  );
}
