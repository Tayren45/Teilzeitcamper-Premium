import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { contact } from "@/lib/content";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false },
};

export default function ImpressumPage() {
  return (
    <>
      <PageHero kicker="Rechtliches" title="Impressum" />
      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <div className="glass space-y-6 rounded-3xl p-8 text-[15px] leading-relaxed shadow-soft">
          <div>
            <h2 className="font-display text-lg font-semibold">Verantwortlich für diese Website</h2>
            <p className="mt-2">
              {contact.legalName}<br />
              {contact.owner}<br />
              {contact.street}<br />
              {contact.city}, Schweiz
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">Kontakt</h2>
            <p className="mt-2">
              Telefon: {contact.phone}<br />
              E-Mail: {contact.email}
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">Handelsregister & MwSt</h2>
            <p className="mt-2">
              {contact.uid ? (
                <>UID: {contact.uid}<br />Mehrwertsteuer-Nr.: {contact.uid} MWST</>
              ) : (
                <>Einzelunternehmen · David Bruderer<br />
                <em>UID/MwSt-Nr. auf Anfrage — bitte eintragen in lib/content.ts falls vorhanden.</em></>
              )}
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">Haftungsausschluss</h2>
            <p className="mt-2">
              Alle Inhalte wurden sorgfältig erstellt. Für Richtigkeit, Vollständigkeit und
              Aktualität übernehmen wir keine Gewähr. Fahrzeugangaben gemäss Werksdaten;
              massgebend ist der Fahrzeugausweis. Links auf externe Websites: Für deren Inhalte
              sind ausschliesslich die jeweiligen Betreiber verantwortlich.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">Urheberrecht</h2>
            <p className="mt-2">
              Sämtliche Fotos, Texte und Gestaltungselemente auf dieser Website sind Eigentum von
              {" "}{contact.legalName} und dürfen ohne schriftliche Zustimmung nicht verwendet werden.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
