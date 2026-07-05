import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { contact } from "@/lib/content";

export const metadata: Metadata = {
  title: "Über uns — Vermietung mit Herz statt Flotte",
  description:
    "Teilzeitcamper ist die persönliche Wohnmobilvermietung von David Bruderer aus St. Gallen. Ein Fahrzeug, viel Herzblut, ehrliche Beratung.",
};

const values = [
  {
    icon: "🤝",
    title: "Persönlich statt Callcenter",
    text: "Du mietest direkt bei David. Übergabe, Fragen unterwegs, Rückgabe — immer dieselbe Person, immer erreichbar.",
  },
  {
    icon: "✨",
    title: "Gepflegt wie das eigene",
    text: "Weil es das eigene ist. Nach jeder Miete wird geputzt, geprüft und gewartet — vom Profi, mit Werkstatt-Hintergrund.",
  },
  {
    icon: "💬",
    title: "Ehrliche Beratung",
    text: "Wenn der T447 nicht zu deiner Reise passt, sagen wir dir das — und empfehlen dir eine Alternative. Versprochen.",
  },
];

export default function UeberUnsPage() {
  return (
    <>
      <PageHero
        kicker="Die Geschichte dahinter"
        title="Vermietung mit Herz — nicht mit Flotte."
        lead="Teilzeitcamper ist kein Konzern, sondern ein Versprechen: Du bekommst unser eigenes, liebevoll gepflegtes Wohnmobil — und den ganzen Erfahrungsschatz gleich mit."
      />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl shadow-lift">
              <Image
                src="/images/fleet/exterior-entry-open.jpg"
                alt="Der Teilzeitcamper mit offener Tür — bereit für Gäste"
                width={1200}
                height={900}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Salü, ich bin David.
            </h2>
            <div className="mt-4 space-y-4 leading-relaxed text-pine-800 dark:text-sand-100/85">
              <p>
                Hauptberuflich führe ich die Carrosserie <strong>Lack Werk Bruderer</strong> in
                St. Gallen — Fahrzeuge sind also nicht nur mein Geschäft, sondern meine
                Leidenschaft. Der Teilzeitcamper ist unser Familien-Wohnmobil: ein Carado T447,
                Baujahr {new Date().getFullYear() - 3}, gehegt wie ein Oldtimer.
              </p>
              <p>
                Weil so ein Fahrzeug nicht jedes Wochenende unterwegs sein kann, teilen wir es —
                mit Menschen, die es genauso schätzen. Daher der Name: <em>Teilzeit</em>camper.
                Du profitierst von einem Fahrzeug in Top-Zustand, fairen Preisen ohne
                Vermittlungsplattform-Gebühren und einer Übergabe, bei der wirklich alle Fragen
                beantwortet werden.
              </p>
              <p>
                Aus der Werkstatt-Praxis bekommst du ausserdem etwas, das keine grosse Vermietung
                bietet: Vor jeder Übergabe geht das Fahrzeug durch meinen professionellen Check —
                Lack, Dichtungen, Technik, Reifen. Sicherer geht's nicht.
              </p>
            </div>
            <Link href="/kontakt" className="btn-primary mt-8">
              Lern uns kennen →
            </Link>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.1}>
              <div className="card-hover glass h-full rounded-3xl p-8 shadow-soft">
                <span className="text-4xl" aria-hidden>{v.icon}</span>
                <h3 className="mt-4 font-display text-xl font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-pine-700 dark:text-sand-100/75">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-16 rounded-3xl bg-pine-950 p-8 text-center text-sand-100 sm:p-12">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              «Wir vermieten kein Fahrzeug. Wir leihen dir unser liebstes Stück.»
            </h2>
            <p className="mt-3 text-sand-100/70">— {contact.owner}, Gründer</p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
