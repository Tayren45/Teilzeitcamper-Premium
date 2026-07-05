import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import BookingWizard from "@/components/BookingWizard";

export const metadata: Metadata = {
  title: "Buchung — Live-Kalender & Anfrage",
  description:
    "Wohnmobil online buchen: Live-Verfügbarkeit prüfen, Extras wählen, Zahlungsart festlegen — Anfrage in unter 2 Minuten.",
};

export default function BuchungPage() {
  return (
    <>
      <PageHero
        kicker="In 4 Schritten zum Abenteuer"
        title="Buchung"
        lead="Datum wählen, Extras antippen, Anfrage senden. Wir bestätigen persönlich innert 24 Stunden — erst dann wird die Anzahlung fällig."
      />
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Suspense fallback={<p className="text-center text-sm text-pine-500">Lade Buchungsassistent…</p>}>
          <BookingWizard />
        </Suspense>
      </section>
    </>
  );
}
