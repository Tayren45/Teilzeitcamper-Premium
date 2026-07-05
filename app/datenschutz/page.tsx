import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { contact } from "@/lib/content";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  robots: { index: false },
};

const sections = [
  {
    h: "1. Grundsatz",
    p: "Wir bearbeiten Personendaten gemäss dem Schweizer Datenschutzgesetz (revDSG) und — soweit anwendbar — der EU-DSGVO. Personendaten sind alle Angaben, die sich auf eine bestimmte oder bestimmbare Person beziehen.",
  },
  {
    h: "2. Verantwortliche Stelle",
    p: `${contact.legalName}, ${contact.street}, ${contact.city}. Anfragen zum Datenschutz: ${contact.email}.`,
  },
  {
    h: "3. Welche Daten wir bearbeiten",
    p: "Bei Buchungsanfragen: Name, E-Mail, Telefonnummer, Reisedaten und gewählte Zahlungsart — ausschliesslich zur Abwicklung deiner Miete. Beim Besuch der Website: technische Zugriffsdaten (IP-Adresse, Browser), soweit für den Betrieb nötig.",
  },
  {
    h: "4. Cookies & lokale Speicherung",
    p: "Diese Website verwendet keine Tracking-Cookies. Im lokalen Speicher deines Browsers werden lediglich funktionale Einstellungen abgelegt (Sprache, Dark/Light-Modus). Diese Daten verlassen dein Gerät nicht.",
  },
  {
    h: "5. Analyse & Marketing",
    p: "Falls künftig Google Analytics oder Meta Pixel eingesetzt werden, geschieht dies nur mit deiner ausdrücklichen Einwilligung über ein Consent-Banner und mit IP-Anonymisierung. Aktuell sind keine solchen Dienste aktiv.",
  },
  {
    h: "6. Zahlungsdienstleister",
    p: "Zahlungen werden über spezialisierte Anbieter (z.B. Stripe, Twint, PayPal) abgewickelt. Deine Zahlungsdaten werden direkt bei diesen Anbietern verarbeitet und erreichen unsere Systeme nie vollständig. Es gelten die Datenschutzbestimmungen des jeweiligen Anbieters.",
  },
  {
    h: "7. Weitergabe an Dritte",
    p: "Eine Weitergabe deiner Daten erfolgt nur, soweit dies zur Vertragsabwicklung nötig ist (z.B. Versicherung im Schadenfall) oder wir gesetzlich dazu verpflichtet sind. Ein Verkauf deiner Daten findet nicht statt — niemals.",
  },
  {
    h: "8. Aufbewahrung & Löschung",
    p: "Buchungs- und Vertragsdaten bewahren wir gemäss den gesetzlichen Aufbewahrungspflichten (10 Jahre, OR) auf. Anfragen ohne Vertragsabschluss löschen wir spätestens nach 12 Monaten.",
  },
  {
    h: "9. Deine Rechte",
    p: "Du hast jederzeit das Recht auf Auskunft, Berichtigung, Löschung und Datenherausgabe. Eine kurze E-Mail genügt. Zuständige Aufsichtsbehörde in der Schweiz ist der EDÖB.",
  },
];

export default function DatenschutzPage() {
  return (
    <>
      <PageHero kicker="Rechtliches" title="Datenschutz" lead="Kurz gesagt: Wir bearbeiten nur, was für deine Miete nötig ist — und verkaufen nichts weiter." />
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
