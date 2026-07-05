import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Zahlung abgebrochen",
  robots: { index: false },
};

export default function BuchungAbgebrochenPage() {
  return (
    <>
      <PageHero
        kicker="Kein Problem"
        title="Zahlung abgebrochen"
        lead="Deine Buchungsanfrage ist trotzdem bei uns eingegangen. Du kannst die Anzahlung später bezahlen — wir senden dir den Link per E-Mail."
      />
      <section className="mx-auto max-w-lg px-4 pb-16 text-center">
        <Reveal>
          <Link href="/buchung" className="btn-primary">Zurück zur Buchung</Link>
          <Link href="/kontakt" className="btn-secondary mt-3 inline-flex border border-pine-300 dark:border-pine-700">Kontakt aufnehmen</Link>
        </Reveal>
      </section>
    </>
  );
}
