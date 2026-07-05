import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "AGB — Allgemeine Geschäftsbedingungen",
  robots: { index: false },
};

const sections = [
  {
    h: "1. Geltungsbereich & Vertragspartner",
    p: "Diese AGB gelten für alle Mietverträge über das Wohnmobil Carado T447 zwischen Teilzeitcamper by Lackwerk Bruderer (Vermieter) und der mietenden Person (Mieter). Mit Absenden der Buchungsanfrage und unserer Bestätigung kommt der Mietvertrag zustande.",
  },
  {
    h: "2. Mindestanforderungen",
    p: "Fahrberechtigte Personen: mindestens 23 Jahre alt, Führerausweis Kategorie B seit mindestens 2 Jahren. Alle Fahrer müssen im Mietvertrag eingetragen sein und den Ausweis bei Übergabe vorweisen.",
  },
  {
    h: "3. Preise & Zahlung",
    p: "Es gelten die zum Buchungszeitpunkt publizierten Saisonpreise. Anzahlung: 30% bei Vertragsabschluss. Restzahlung: 30 Tage vor Mietbeginn. Bei kurzfristigen Buchungen (< 30 Tage) ist der Gesamtbetrag sofort fällig. Inklusive: 200 km/Miettag; Mehrkilometer CHF 0.35/km, Abrechnung bei Rückgabe.",
  },
  {
    h: "4. Kaution",
    p: "Bei der Übergabe wird eine Kaution von CHF 1'500 hinterlegt (Karte oder Twint). Sie wird nach ordnungsgemässer Rückgabe innert 7 Tagen vollständig zurückerstattet, abzüglich allfälliger Selbstbehalte, Fehlmengen (Treibstoff) oder Reinigungsaufwände.",
  },
  {
    h: "5. Stornierung durch den Mieter",
    p: "Bis 60 Tage vor Mietbeginn: kostenlos. 59–30 Tage: 30% des Mietpreises. 29–7 Tage: 50%. 6–0 Tage oder Nichtabholung: 80%. Massgebend ist der Eingang der schriftlichen Stornierung. Wir empfehlen den Abschluss einer Annullationsversicherung.",
  },
  {
    h: "6. Übergabe & Rückgabe",
    p: "Übergabe mit persönlicher Einweisung (ca. 45 Min.) am vereinbarten Termin in St. Gallen. Rückgabe: innen besenrein, WC-Kassette geleert, Tank voll. Endreinigung (CHF 120) ist im Preis enthalten; übermässige Verschmutzung wird nach Aufwand verrechnet.",
  },
  {
    h: "7. Nutzung",
    p: "Erlaubt: Reisen in Europa (geografisch). Nicht erlaubt: Festivals ohne Absprache, Vermietung an Dritte, Fahrten in Kriegs-/Krisengebiete, Rennen, Rauchen im Fahrzeug. Haustiere nur mit gebuchtem Haustier-Extra.",
  },
  {
    h: "8. Versicherung & Haftung",
    p: "Vollkasko mit Selbstbehalt CHF 1'000 pro Ereignis (reduzierbar durch Schutzpakete). Der Mieter haftet für Schäden durch grobe Fahrlässigkeit, Vorsatz oder Verletzung der Vertragspflichten unbeschränkt. Schäden sind unverzüglich zu melden.",
  },
  {
    h: "9. Pannen & Mängel",
    p: "Bei Pannen greift die 24h-Assistance. Reparaturen bis CHF 100 dürfen selbständig ausgeführt werden (Beleg aufbewahren), darüber nur nach Rücksprache. Ein Anspruch auf Ersatzfahrzeug besteht nicht; erstattet wird maximal der anteilige Mietpreis ausgefallener Tage.",
  },
  {
    h: "10. Anwendbares Recht & Gerichtsstand",
    p: "Es gilt Schweizer Recht. Gerichtsstand ist St. Gallen. Sollten einzelne Bestimmungen unwirksam sein, bleibt der übrige Vertrag davon unberührt.",
  },
];

export default function AgbPage() {
  return (
    <>
      <PageHero kicker="Rechtliches" title="AGB" lead="Fair, lesbar, ohne Juristendeutsch-Labyrinth — die wichtigsten Regeln unserer Zusammenarbeit." />
      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <div className="glass space-y-6 rounded-3xl p-8 text-[15px] leading-relaxed shadow-soft">
          {sections.map((s) => (
            <div key={s.h}>
              <h2 className="font-display text-lg font-semibold">{s.h}</h2>
              <p className="mt-2 text-pine-800 dark:text-sand-100/85">{s.p}</p>
            </div>
          ))}
          <p className="text-xs text-pine-500">Stand: Juli 2026 · Vor Launch rechtlich prüfen lassen.</p>
        </div>
      </section>
    </>
  );
}
