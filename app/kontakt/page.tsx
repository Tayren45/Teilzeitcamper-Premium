import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { contact } from "@/lib/content";

export const metadata: Metadata = {
  title: "Kontakt — Wir sind persönlich für dich da",
  description:
    "Fragen zur Miete, Übergabe oder Route? Ruf an, schreib uns oder komm in St. Gallen vorbei — wir antworten innert 24 Stunden.",
};

export default function KontaktPage() {
  return (
    <>
      <PageHero
        kicker="Sag Salü"
        title="Kontakt"
        lead="Keine Warteschleife, kein Ticketsystem. Du schreibst — David antwortet. Meistens schneller als in 24 Stunden."
      />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.12}>
            <div className="space-y-6">
              <div className="glass rounded-3xl p-8 shadow-soft">
                <h2 className="font-display text-xl font-semibold">Direkt erreichen</h2>
                <ul className="mt-5 space-y-4 text-sm">
                  <li className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pine-100 text-lg dark:bg-pine-900">📞</span>
                    <span>
                      <span className="block text-pine-500 dark:text-pine-300">Telefon / WhatsApp</span>
                      <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="font-semibold hover:text-terra-500">{contact.phone}</a>
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pine-100 text-lg dark:bg-pine-900">✉️</span>
                    <span>
                      <span className="block text-pine-500 dark:text-pine-300">E-Mail</span>
                      <a href={`mailto:${contact.email}`} className="font-semibold hover:text-terra-500">{contact.email}</a>
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pine-100 text-lg dark:bg-pine-900">📍</span>
                    <span>
                      <span className="block text-pine-500 dark:text-pine-300">Abholung & Rückgabe</span>
                      <span className="font-semibold">{contact.street}, {contact.city}</span>
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pine-100 text-lg dark:bg-pine-900">🕐</span>
                    <span>
                      <span className="block text-pine-500 dark:text-pine-300">Übergabezeiten</span>
                      <span className="font-semibold">Mo–Sa nach Vereinbarung, auch abends</span>
                    </span>
                  </li>
                </ul>
              </div>

              <div className="overflow-hidden rounded-3xl shadow-soft">
                <iframe
                  src={contact.mapEmbed}
                  title="Karte: Standort Teilzeitcamper in St. Gallen (OpenStreetMap)"
                  className="h-72 w-full border-0"
                  loading="lazy"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
