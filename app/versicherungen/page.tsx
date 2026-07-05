import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Versicherungen — Vollkasko inklusive",
  description:
    "Vollkasko mit CHF 1'000 Selbstbehalt ist immer inklusive. Optionale Selbstbehalt-Reduktion, Innenraumschutz und Annullationsversicherung.",
};

const packages = [
  {
    name: "Basis-Schutz",
    price: "Inklusive",
    highlight: false,
    features: [
      "Vollkasko (Kollision, Diebstahl, Elementar)",
      "Selbstbehalt CHF 1'000 pro Ereignis",
      "Haftpflicht bis CHF 100 Mio.",
      "24h-Pannenhilfe & Assistance Europa",
      "Glas- und Reifenschäden mitversichert",
    ],
  },
  {
    name: "Komfort-Schutz",
    price: "CHF 15 / Nacht",
    highlight: true,
    features: [
      "Alles aus Basis-Schutz",
      "Selbstbehalt reduziert auf CHF 300",
      "Innenraum-Schäden bis CHF 2'500 gedeckt",
      "Markisen-Schäden mitversichert",
      "Kaution reduziert auf CHF 800",
    ],
  },
  {
    name: "Sorglos-Schutz",
    price: "CHF 22 / Nacht",
    highlight: false,
    features: [
      "Alles aus Komfort-Schutz",
      "Selbstbehalt CHF 0 — volle Entspannung",
      "Annullationsschutz (Krankheit/Unfall)",
      "Ersatz-Mobilität bei Panne ab Tag 1",
      "Kaution reduziert auf CHF 500",
    ],
  },
];

export default function VersicherungenPage() {
  return (
    <>
      <PageHero
        kicker="Sicher unterwegs"
        title="Versicherungen"
        lead="Vollkasko ist bei uns keine Option, sondern Standard. Wer noch ruhiger schlafen will, wählt eines der Upgrade-Pakete — direkt im Buchungsprozess oder bis 7 Tage vor Abholung."
      />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {packages.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1}>
              <div
                className={`card-hover relative flex h-full flex-col rounded-3xl p-8 ${
                  p.highlight ? "bg-pine-800 text-white shadow-lift dark:bg-pine-600" : "glass shadow-soft"
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-8 rounded-full bg-terra-500 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    Meistgewählt
                  </span>
                )}
                <h2 className="font-display text-2xl font-semibold">{p.name}</h2>
                <p className={`mt-2 font-display text-3xl font-bold ${p.highlight ? "" : "text-terra-500"}`}>
                  {p.price}
                </p>
                <ul className={`mt-6 flex-1 space-y-3 text-sm ${p.highlight ? "text-white/90" : ""}`}>
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <span className={p.highlight ? "text-terra-300" : "text-green-500"}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-12 rounded-3xl glass p-8 shadow-soft">
            <h2 className="font-display text-2xl font-semibold">Gut zu wissen</h2>
            <div className="mt-5 grid gap-6 text-sm leading-relaxed text-pine-800 md:grid-cols-2 dark:text-sand-100/85">
              <div>
                <h3 className="mb-1.5 font-semibold">Was passiert im Schadenfall?</h3>
                <p>
                  Ein Anruf genügt. Wir organisieren zusammen mit der Assistance alles Weitere —
                  vom Abschleppdienst bis zum Ersatzfahrzeug. Kleinere Parkschäden werden nach der
                  Rückgabe fair nach Selbstbehalt abgerechnet, nie mehr.
                </p>
              </div>
              <div>
                <h3 className="mb-1.5 font-semibold">Wer darf fahren?</h3>
                <p>
                  Alle im Mietvertrag eingetragenen Personen ab 23 Jahren mit mindestens 2 Jahren
                  Fahrpraxis (Kat. B). Zusatzfahrer sind kostenlos — einfach bei der Buchung angeben.
                </p>
              </div>
              <div>
                <h3 className="mb-1.5 font-semibold">Auslandfahrten</h3>
                <p>
                  Ganz Europa (geografisch) ist versichert. Für Länder ausserhalb EU/EFTA melde dich
                  kurz bei uns — meistens ist es nur eine Formalität mit der grünen Karte.
                </p>
              </div>
              <div>
                <h3 className="mb-1.5 font-semibold">Annullation</h3>
                <p>
                  Der Sorglos-Schutz deckt Stornierungen bei Krankheit und Unfall. Unabhängig davon
                  gelten unsere fairen Stornobedingungen — Details in den <a href="/agb" className="font-semibold text-terra-500 hover:underline">AGB</a>.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
