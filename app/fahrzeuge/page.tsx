import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { vehicle } from "@/lib/vehicle";

export const metadata: Metadata = {
  title: "Fahrzeuge — Carado T447 mieten",
  description:
    "Unsere Flotte: Carado T447 Teilintegrierter mit 4 Schlafplätzen, Einzelbetten, Hubbett und Heckgarage. Persönlich gepflegt statt anonymer Flotte.",
};

const compare = [
  { label: "Schlafplätze", kasten: "2–3", teil: "4 ✓", alkoven: "5–6" },
  { label: "Fahrgefühl", kasten: "Wie ein grosser Van", teil: "PKW-nah, übersichtlich ✓", alkoven: "Träge, windanfällig" },
  { label: "Stehhöhe & Raumgefühl", kasten: "Eng", teil: "Grosszügig ✓", alkoven: "Grosszügig" },
  { label: "Separates Bad + Dusche", kasten: "Selten", teil: "Ja ✓", alkoven: "Ja" },
  { label: "Höhe (Parkhäuser, Fähren)", kasten: "~2.6 m", teil: "~2.95 m", alkoven: "~3.2 m" },
  { label: "Verbrauch", kasten: "8–9 l", teil: "10–11 l ✓", alkoven: "12–14 l" },
  { label: "Führerschein Kat. B", kasten: "Ja", teil: "Ja ✓", alkoven: "Oft C1 nötig" },
];

export default function FahrzeugePage() {
  return (
    <>
      <PageHero
        kicker="Unsere Flotte"
        title="Ein Fahrzeug. Mit Absicht."
        lead="Wir sind keine anonyme Grossvermietung: Wir vermieten genau ein Wohnmobil — dafür kennen wir jede Schraube, jeden Trick und jeden Stellplatz-Tipp persönlich."
      />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Reveal>
          <Link
            href={`/fahrzeuge/${vehicle.slug}`}
            className="card-hover group grid overflow-hidden rounded-3xl glass shadow-soft lg:grid-cols-2"
          >
            <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto">
              <Image
                src={vehicle.card}
                alt={`${vehicle.name} Seitenansicht`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 rounded-full bg-green-500 px-4 py-1.5 text-sm font-bold text-white shadow-soft">
                Sofort buchbar
              </span>
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <p className="text-sm font-bold uppercase tracking-widest text-terra-500">
                Teilintegriert · Baujahr {vehicle.year}
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{vehicle.name}</h2>
              <p className="mt-3 leading-relaxed text-pine-700 dark:text-sand-100/80">{vehicle.claim}</p>
              <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {[
                  "4 Schlafplätze",
                  "4 Gurtplätze",
                  "Einzelbetten + Hubbett",
                  "Separate Dusche",
                  "Heckgarage XXL",
                  "Solar + Markise",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <p className="mt-6 font-display text-2xl font-bold">
                ab CHF 145 <span className="text-base font-normal text-pine-500">/ Nacht</span>
              </p>
              <span className="btn-primary mt-6 w-fit">
                Details, Galerie & 360° →
              </span>
            </div>
          </Link>
        </Reveal>
      </section>

      {/* Vergleich */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal className="mb-8">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Warum ein Teilintegrierter?
          </h2>
          <p className="mt-3 max-w-2xl text-pine-700 dark:text-sand-100/80">
            Der ehrliche Vergleich der drei Bauformen — damit du weisst, warum wir uns bewusst für
            den T447 entschieden haben.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="overflow-x-auto rounded-3xl glass shadow-soft">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-pine-200/60 text-left dark:border-pine-800/60">
                  <th className="px-6 py-4 font-semibold"> </th>
                  <th className="px-6 py-4 font-semibold">Kastenwagen</th>
                  <th className="bg-pine-800/5 px-6 py-4 font-semibold text-terra-500 dark:bg-pine-500/10">
                    Teilintegriert (T447) ★
                  </th>
                  <th className="px-6 py-4 font-semibold">Alkoven</th>
                </tr>
              </thead>
              <tbody>
                {compare.map((row) => (
                  <tr key={row.label} className="border-b border-pine-200/40 last:border-0 dark:border-pine-800/40">
                    <td className="px-6 py-3.5 font-semibold">{row.label}</td>
                    <td className="px-6 py-3.5 text-pine-600 dark:text-sand-100/70">{row.kasten}</td>
                    <td className="bg-pine-800/5 px-6 py-3.5 font-medium dark:bg-pine-500/10">{row.teil}</td>
                    <td className="px-6 py-3.5 text-pine-600 dark:text-sand-100/70">{row.alkoven}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>
    </>
  );
}
