import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import PriceCalculator from "@/components/PriceCalculator";
import { seasons, CLEANING_FEE, DEPOSIT, KM_PER_DAY, EXTRA_KM_PRICE } from "@/lib/pricing";
import { vehicle } from "@/lib/vehicle";

export const metadata: Metadata = {
  title: "Preise — transparent auf den Franken",
  description:
    "Saisonpreise ab CHF 145/Nacht, 200 km/Tag inklusive, Vollkasko inbegriffen. Frühbucher- und Last-Minute-Rabatte. Keine versteckten Kosten.",
};

export default function PreisePage() {
  return (
    <>
      <PageHero
        kicker="Keine Sternchen, kein Kleingedrucktes"
        title="Preise"
        lead="Der Preis aus dem Rechner ist der Preis auf der Rechnung. Versprochen."
      />

      {/* Saison-Karten */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {(Object.keys(seasons) as (keyof typeof seasons)[]).map((id, i) => {
            const s = seasons[id];
            const monthNames = ["", "Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
            return (
              <Reveal key={id} delay={i * 0.1}>
                <div
                  className={`card-hover relative flex h-full flex-col rounded-3xl p-8 ${
                    id === "haupt"
                      ? "bg-pine-800 text-white shadow-lift dark:bg-pine-600"
                      : "glass shadow-soft"
                  }`}
                >
                  {id === "haupt" && (
                    <span className="absolute -top-3 left-8 rounded-full bg-terra-500 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                      Beliebteste Zeit
                    </span>
                  )}
                  <h2 className="font-display text-xl font-semibold">{s.name}</h2>
                  <p className={`mt-1 text-sm ${id === "haupt" ? "text-white/70" : "text-pine-600 dark:text-sand-100/60"}`}>
                    {s.months.map((m) => monthNames[m]).join(" · ")}
                  </p>
                  <p className="mt-5 font-display text-5xl font-bold">
                    {s.pricePerNight}
                    <span className="text-lg font-normal opacity-70"> CHF/Nacht</span>
                  </p>
                  <ul className={`mt-6 flex-1 space-y-2.5 text-sm ${id === "haupt" ? "text-white/85" : ""}`}>
                    <li>✓ Mindestmiete {s.minNights} Nächte</li>
                    <li>✓ {KM_PER_DAY} km pro Tag inklusive</li>
                    <li>✓ Vollkasko-Versicherung inklusive</li>
                    <li>✓ Gas, Campingmöbel, Küche inklusive</li>
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Rabatte */}
        <Reveal delay={0.15}>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border-2 border-dashed border-terra-400 p-7">
              <p className="text-2xl">🌅</p>
              <h3 className="mt-2 font-display text-xl font-semibold">Frühbucher-Rabatt</h3>
              <p className="mt-1 text-sm text-pine-700 dark:text-sand-100/80">
                Buche mehr als 90 Tage im Voraus und spare <strong>10%</strong> auf den Mietpreis.
              </p>
              <code className="mt-3 inline-block rounded-lg bg-terra-100 px-3 py-1.5 font-mono text-sm font-bold text-terra-600 dark:bg-terra-600/20 dark:text-terra-300">
                FRUEHBUCHER10
              </code>
            </div>
            <div className="rounded-3xl border-2 border-dashed border-pine-400 p-7">
              <p className="text-2xl">⚡️</p>
              <h3 className="mt-2 font-display text-xl font-semibold">Last-Minute-Angebot</h3>
              <p className="mt-1 text-sm text-pine-700 dark:text-sand-100/80">
                Spontan? Bei Anreise innert 14 Tagen gibt's <strong>15%</strong> Rabatt auf den Mietpreis.
              </p>
              <code className="mt-3 inline-block rounded-lg bg-pine-100 px-3 py-1.5 font-mono text-sm font-bold text-pine-700 dark:bg-pine-500/20 dark:text-pine-300">
                LASTMINUTE15
              </code>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Nebenkosten & Extras */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <h2 className="mb-5 font-display text-2xl font-semibold">Einmalige Kosten</h2>
            <div className="glass overflow-hidden rounded-3xl shadow-soft">
              {[
                { l: "Endreinigung (obligatorisch)", v: `CHF ${CLEANING_FEE}` },
                { l: "Kaution (bei Übergabe, wird zurückerstattet)", v: `CHF ${DEPOSIT.toLocaleString("de-CH").replace(",", "'")}` },
                { l: `Zusatzkilometer (über ${KM_PER_DAY} km/Tag)`, v: `CHF ${EXTRA_KM_PRICE.toFixed(2)} / km` },
                { l: "Anzahlung bei Buchung", v: "30% des Mietpreises" },
                { l: "Restzahlung", v: "30 Tage vor Abholung" },
              ].map((row) => (
                <p key={row.l} className="flex items-center justify-between border-b border-pine-200/40 px-6 py-4 text-sm last:border-0 dark:border-pine-800/40">
                  <span>{row.l}</span>
                  <span className="font-semibold">{row.v}</span>
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-5 font-display text-2xl font-semibold">Buchbare Extras</h2>
            <div className="glass overflow-hidden rounded-3xl shadow-soft">
              {vehicle.extras.map((e) => (
                <p key={e.id} className="flex items-center justify-between border-b border-pine-200/40 px-6 py-4 text-sm last:border-0 dark:border-pine-800/40">
                  <span>
                    <span className="font-medium">{e.name}</span>
                    <span className="block text-xs text-pine-500 dark:text-pine-400">{e.desc}</span>
                  </span>
                  <span className="whitespace-nowrap font-semibold">CHF {e.price} <span className="font-normal text-pine-500">{e.unit}</span></span>
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Rechner */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Reveal className="mb-8 text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight">Rechne es selbst nach</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <PriceCalculator />
        </Reveal>
      </section>
    </>
  );
}
