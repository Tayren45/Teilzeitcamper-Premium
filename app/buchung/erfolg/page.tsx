import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Zahlung erfolgreich — Buchung bestätigt",
  robots: { index: false },
};

export default function BuchungErfolgPage() {
  return (
    <>
      <PageHero kicker="Danke!" title="Zahlung eingegangen" lead="Deine Anzahlung ist bei uns — die Buchung ist bestätigt. Wir melden uns mit allen Details zur Übergabe." />
      <section className="mx-auto max-w-lg px-4 pb-16 text-center">
        <Reveal>
          <p className="text-5xl">✓</p>
          <p className="mt-4 text-pine-700 dark:text-sand-100/80">
            Du erhältst in Kürze eine Bestätigung per E-Mail. Bei Fragen erreichst du uns jederzeit.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn-primary">Zur Startseite</Link>
            <Link href="/trip-clips" className="btn-secondary border border-pine-300 dark:border-pine-700">Trip-Clips ansehen</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
