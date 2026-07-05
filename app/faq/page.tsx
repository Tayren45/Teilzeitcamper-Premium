import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import FaqAccordion from "@/components/FaqAccordion";
import { faqItems } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQ — Häufige Fragen zur Wohnmobil-Miete",
  description:
    "Führerschein, Kaution, Haustiere, Wintercamping, Stornierung: Alle Antworten zur Wohnmobilmiete beim Teilzeitcamper.",
};

/** FAQPage-Schema für Google Rich Results */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <PageHero
        kicker="Wissenswertes"
        title="Häufige Fragen"
        lead="Deine Frage fehlt? Der Camper-Berater unten rechts hilft sofort — oder ruf uns einfach an."
      />
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
        <Reveal>
          <FaqAccordion items={faqItems} />
        </Reveal>
      </section>
    </>
  );
}
