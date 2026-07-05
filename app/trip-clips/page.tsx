import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import TripClipsSection from "@/components/TripClipsSection";

export const metadata = {
  title: "Trip-Clips — Reise-Momente unserer Gäste",
  description:
    "Teile Fotos und Clips deiner Wohnmobil-Reise mit Zugangscode — Community-Feed von Teilzeitcamper by Lackwerk Bruderer.",
};

export default function TripClipsPage() {
  return (
    <>
      <PageHero
        kicker="Community"
        title="Trip-Clips"
        lead="Echte Momente von echten Reisen — geteilt von Gästen, die mit unserem Carado unterwegs waren."
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <TripClipsSection />
        </Reveal>
      </section>
    </>
  );
}
