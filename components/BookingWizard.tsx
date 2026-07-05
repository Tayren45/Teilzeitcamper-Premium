"use client";

/**
 * Buchungsassistent in 4 Schritten:
 * 1 Zeitraum & Personen → 2 Extras → 3 Kontaktdaten → 4 Zahlung & Anfrage.
 * Preis wird live berechnet und serverseitig (API) nochmals validiert.
 * Zahlungsarten sind als Auswahl hinterlegt; der eigentliche Stripe/Twint-
 * Checkout wird nach Bestätigung der Anfrage ausgelöst (siehe README).
 */

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import AvailabilityCalendar from "./AvailabilityCalendar";
import { calcPrice, chf, DEPOSIT } from "@/lib/pricing";
import { vehicle } from "@/lib/vehicle";
import { fmtDate, type Booking } from "@/lib/bookings";

const paymentMethods = [
  { id: "twint", name: "TWINT", icon: "🇨🇭", note: "Beliebteste Wahl" },
  { id: "stripe", name: "Kreditkarte", icon: "💳", note: "Visa, Mastercard, Amex" },
  { id: "applepay", name: "Apple Pay", icon: "", note: "Ein Klick, fertig" },
  { id: "googlepay", name: "Google Pay", icon: "🤖", note: "Ein Klick, fertig" },
  { id: "paypal", name: "PayPal", icon: "🅿️", note: "Käuferschutz inklusive" },
];

const stepLabels = ["Zeitraum", "Extras", "Kontakt", "Zahlung"];

export default function BookingWizard() {
  const params = useSearchParams();

  const [step, setStep] = useState(0);
  const [range, setRange] = useState<{ start: string | null; end: string | null }>({
    start: params.get("start"),
    end: params.get("end"),
  });
  const [persons, setPersons] = useState(Number(params.get("personen")) || 2);
  const [extras, setExtras] = useState<string[]>(
    params.get("extras")?.split(",").filter(Boolean) ?? []
  );
  const [code, setCode] = useState(params.get("code") ?? "");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [payment, setPayment] = useState("twint");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  const price = useMemo(
    () =>
      range.start && range.end
        ? calcPrice(range.start, range.end, extras, persons, code)
        : null,
    [range, extras, persons, code]
  );

  const canNext =
    step === 0
      ? Boolean(price?.meetsMinNights)
      : step === 2
        ? form.name.trim().length > 2 && /.+@.+\..+/.test(form.email) && form.phone.trim().length >= 7
        : true;

  async function submit() {
    if (!range.start || !range.end) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: range.start,
          end: range.end,
          persons,
          extras,
          ...form,
          payment,
          discountCode: code || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unbekannter Fehler");
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl as string;
        return;
      }
      setConfirmed(data.booking as Booking);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Anfrage fehlgeschlagen. Bitte erneut versuchen.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ——— Bestätigung ——— */
  if (confirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-strong mx-auto max-w-2xl rounded-3xl p-8 text-center shadow-lift sm:p-12 print:shadow-none"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl dark:bg-green-900/40"
        >
          ✓
        </motion.div>
        <h2 className="mt-6 font-display text-3xl font-semibold">Anfrage eingegangen!</h2>
        <p className="mt-3 text-pine-700 dark:text-sand-100/80">
          Danke, {confirmed.name.split(" ")[0]}! Deine Buchungsanfrage <strong>{confirmed.id}</strong> ist bei uns.
          Wir melden uns innert 24 Stunden persönlich mit der Bestätigung und dem Zahlungslink
          ({paymentMethods.find((p) => p.id === confirmed.payment)?.name}).
        </p>
        <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-pine-100/60 p-5 text-left text-sm dark:bg-pine-900/40">
          <p className="flex justify-between"><span>Zeitraum</span><strong>{fmtDate(confirmed.start)} – {fmtDate(confirmed.end)}</strong></p>
          <p className="mt-1.5 flex justify-between"><span>Fahrzeug</span><strong>{vehicle.name}</strong></p>
          <p className="mt-1.5 flex justify-between"><span>Personen</span><strong>{confirmed.persons}</strong></p>
          <p className="mt-1.5 flex justify-between"><span>Total</span><strong>{chf(confirmed.total)}</strong></p>
          <p className="mt-1.5 flex justify-between text-terra-500"><span>Anzahlung (30%)</span><strong>{chf(confirmed.downpayment)}</strong></p>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3 print:hidden">
          <button onClick={() => window.print()} className="btn-secondary border border-pine-300 dark:border-pine-700">
            🖨 Bestätigung drucken
          </button>
          <a href="/" className="btn-primary">Zur Startseite</a>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Fortschritt */}
      <ol className="mb-8 flex items-center justify-between gap-2" aria-label="Buchungsschritte">
        {stepLabels.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <button
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
              className={`flex h-9 w-9 flex-none items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                i < step
                  ? "bg-green-500 text-white"
                  : i === step
                    ? "bg-pine-800 text-white shadow-soft dark:bg-pine-500"
                    : "bg-pine-100 text-pine-400 dark:bg-pine-900"
              }`}
              aria-current={i === step ? "step" : undefined}
            >
              {i < step ? "✓" : i + 1}
            </button>
            <span className={`hidden text-sm font-semibold sm:block ${i === step ? "" : "text-pine-400 dark:text-pine-600"}`}>
              {label}
            </span>
            {i < stepLabels.length - 1 && (
              <span className={`h-0.5 flex-1 rounded ${i < step ? "bg-green-500" : "bg-pine-200 dark:bg-pine-800"}`} />
            )}
          </li>
        ))}
      </ol>

      <div className="glass-strong rounded-3xl p-6 shadow-lift sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.35 }}
          >
            {/* Schritt 1: Zeitraum */}
            {step === 0 && (
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h2 className="mb-4 font-display text-xl font-semibold">Wann geht's los?</h2>
                  <AvailabilityCalendar value={range} onChange={setRange} />
                </div>
                <div className="space-y-5">
                  <div className="rounded-2xl bg-pine-100/60 p-5 text-sm dark:bg-pine-900/40">
                    {range.start && range.end ? (
                      <>
                        <p className="font-semibold">{fmtDate(range.start)} → {fmtDate(range.end)}</p>
                        {price && (
                          <p className="mt-1 text-pine-600 dark:text-pine-300">
                            {price.nights} Nächte · ab {chf(price.total)}
                          </p>
                        )}
                        {price && !price.meetsMinNights && (
                          <p className="mt-2 font-semibold text-terra-500">
                            Mindestmietdauer: {price.minNights} Nächte
                          </p>
                        )}
                      </>
                    ) : (
                      <p>Wähle im Kalender zuerst den Abhol-, dann den Rückgabetag.</p>
                    )}
                  </div>
                  <div>
                    <span className="mb-1.5 block text-sm font-semibold">Personen (max. 4)</span>
                    <div className="flex w-fit items-center gap-3 rounded-full border border-pine-200 px-2 py-1 dark:border-pine-800">
                      <button onClick={() => setPersons((p) => Math.max(1, p - 1))} aria-label="Weniger Personen"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-lg hover:bg-pine-100 dark:hover:bg-pine-900">−</button>
                      <span className="w-6 text-center text-lg font-bold">{persons}</span>
                      <button onClick={() => setPersons((p) => Math.min(4, p + 1))} aria-label="Mehr Personen"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-lg hover:bg-pine-100 dark:hover:bg-pine-900">+</button>
                    </div>
                  </div>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold">Rabattcode (optional)</span>
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="FRUEHBUCHER10 · LASTMINUTE15"
                      className="w-full rounded-xl border border-pine-200 bg-white/70 px-3.5 py-2.5 text-sm uppercase outline-none placeholder:normal-case focus:ring-2 focus:ring-pine-500 dark:border-pine-800 dark:bg-night-800"
                    />
                    {price?.discount && (
                      <span className="mt-1 block text-xs font-semibold text-green-600 dark:text-green-400">
                        ✓ {price.discount.percent}% Rabatt wird abgezogen
                      </span>
                    )}
                  </label>
                </div>
              </div>
            )}

            {/* Schritt 2: Extras */}
            {step === 1 && (
              <div>
                <h2 className="mb-1 font-display text-xl font-semibold">Extras für deine Reise</h2>
                <p className="mb-5 text-sm text-pine-600 dark:text-pine-300">
                  Alles Wichtige ist schon inklusive — das hier ist die Kür.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {vehicle.extras.map((e) => {
                    const active = extras.includes(e.id);
                    return (
                      <button
                        key={e.id}
                        onClick={() => setExtras((xs) => active ? xs.filter((x) => x !== e.id) : [...xs, e.id])}
                        aria-pressed={active}
                        className={`rounded-2xl border-2 p-4 text-left transition-all duration-200 active:scale-[0.98] ${
                          active
                            ? "border-pine-800 bg-pine-100/60 shadow-soft dark:border-pine-500 dark:bg-pine-900/40"
                            : "border-pine-200 hover:border-pine-400 dark:border-pine-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{e.name}</span>
                          <span className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                            active ? "border-pine-800 bg-pine-800 text-white dark:border-pine-500 dark:bg-pine-500" : "border-pine-300"
                          }`}>
                            {active ? "✓" : ""}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-pine-600 dark:text-pine-300">{e.desc}</p>
                        <p className="mt-2 text-sm font-bold text-terra-500">CHF {e.price} <span className="font-normal">{e.unit}</span></p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Schritt 3: Kontakt */}
            {step === 2 && (
              <div className="mx-auto max-w-md space-y-4">
                <h2 className="font-display text-xl font-semibold">Wer reist?</h2>
                {[
                  { id: "name", label: "Vor- und Nachname *", type: "text", ph: "Anna Beispiel" },
                  { id: "email", label: "E-Mail *", type: "email", ph: "anna@beispiel.ch" },
                  { id: "phone", label: "Telefon *", type: "tel", ph: "+41 79 123 45 67" },
                ].map((f) => (
                  <label key={f.id} className="block">
                    <span className="mb-1.5 block text-sm font-semibold">{f.label}</span>
                    <input
                      type={f.type}
                      required
                      value={form[f.id as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [f.id]: e.target.value })}
                      placeholder={f.ph}
                      className="w-full rounded-xl border border-pine-200 bg-white/70 px-3.5 py-2.5 outline-none transition-shadow focus:ring-2 focus:ring-pine-500 dark:border-pine-800 dark:bg-night-800"
                    />
                  </label>
                ))}
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">Nachricht (optional)</span>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Reiseziel, Fragen, Wünsche…"
                    className="w-full rounded-xl border border-pine-200 bg-white/70 px-3.5 py-2.5 outline-none transition-shadow focus:ring-2 focus:ring-pine-500 dark:border-pine-800 dark:bg-night-800"
                  />
                </label>
              </div>
            )}

            {/* Schritt 4: Zahlung + Zusammenfassung */}
            {step === 3 && price && range.start && range.end && (
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h2 className="mb-4 font-display text-xl font-semibold">Zahlungsart wählen</h2>
                  <div className="space-y-2.5" role="radiogroup" aria-label="Zahlungsart">
                    {paymentMethods.map((p) => (
                      <button
                        key={p.id}
                        role="radio"
                        aria-checked={payment === p.id}
                        onClick={() => setPayment(p.id)}
                        className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all duration-200 active:scale-[0.98] ${
                          payment === p.id
                            ? "border-pine-800 bg-pine-100/60 shadow-soft dark:border-pine-500 dark:bg-pine-900/40"
                            : "border-pine-200 hover:border-pine-400 dark:border-pine-800"
                        }`}
                      >
                        <span className="text-xl">{p.icon}</span>
                        <span className="flex-1">
                          <span className="block font-semibold">{p.name}</span>
                          <span className="block text-xs text-pine-500 dark:text-pine-300">{p.note}</span>
                        </span>
                        <span className={`h-5 w-5 rounded-full border-2 transition-all ${
                          payment === p.id ? "border-[6px] border-pine-800 dark:border-pine-500" : "border-pine-300"
                        }`} />
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-pine-500 dark:text-pine-400">
                    Nach dem Absenden wirst du — falls Stripe aktiv ist — direkt zur sicheren
                    Zahlung der 30%-Anzahlung weitergeleitet (TWINT, Karte, Apple/Google Pay).
                    Ohne Stripe-Konfiguration erhältst du den Link per E-Mail nach unserer Bestätigung.
                  </p>
                </div>

                <div className="rounded-2xl bg-pine-950 p-6 text-sand-100 dark:bg-night-800">
                  <h3 className="font-display text-lg font-semibold">Zusammenfassung</h3>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex justify-between"><span>{vehicle.name}</span><span>{fmtDate(range.start)} – {fmtDate(range.end)}</span></li>
                    {price.nightsBySeason.map((s) => (
                      <li key={s.season} className="flex justify-between text-sand-100/80">
                        <span>{s.nights} × {s.name}</span><span>{chf(s.total)}</span>
                      </li>
                    ))}
                    {price.extras.map((e) => (
                      <li key={e.id} className="flex justify-between text-sand-100/80">
                        <span>{e.name}{e.qty > 1 ? ` × ${e.qty}` : ""}</span><span>{chf(e.total)}</span>
                      </li>
                    ))}
                    <li className="flex justify-between text-sand-100/80"><span>Endreinigung</span><span>{chf(price.cleaning)}</span></li>
                    {price.discount && (
                      <li className="flex justify-between font-semibold text-green-400">
                        <span>Rabatt {price.discount.code}</span><span>− {chf(price.discount.amount)}</span>
                      </li>
                    )}
                  </ul>
                  <div className="mt-4 border-t border-white/15 pt-4">
                    <p className="flex items-end justify-between">
                      <span className="text-sm text-sand-100/70">Total</span>
                      <span className="font-display text-2xl font-bold">{chf(price.total)}</span>
                    </p>
                    <p className="mt-1 flex justify-between text-sm text-terra-300">
                      <span>Anzahlung nach Bestätigung</span><span className="font-bold">{chf(price.downpayment)}</span>
                    </p>
                    <p className="mt-1 flex justify-between text-xs text-sand-100/50">
                      <span>Kaution bei Übergabe</span><span>{chf(DEPOSIT)}</span>
                    </p>
                  </div>
                  {error && (
                    <p role="alert" className="mt-4 rounded-xl bg-terra-500/20 px-4 py-3 text-sm font-semibold text-terra-300">
                      {error}
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className={`btn-secondary border border-pine-300 dark:border-pine-700 ${step === 0 ? "invisible" : ""}`}
          >
            ← Zurück
          </button>
          {step < 3 ? (
            <button onClick={() => canNext && setStep(step + 1)} disabled={!canNext} className="btn-primary disabled:opacity-40">
              Weiter →
            </button>
          ) : (
            <button onClick={submit} disabled={submitting} className="btn-primary !bg-terra-500 hover:!bg-terra-400 disabled:opacity-60">
              {submitting ? "Wird gesendet…" : "Verbindlich anfragen ✓"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
