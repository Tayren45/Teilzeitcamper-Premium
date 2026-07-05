import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import PriceCalculator from "@/components/PriceCalculator";
import Reviews from "@/components/Reviews";
import SocialFeed from "@/components/SocialFeed";
import FaqAccordion from "@/components/FaqAccordion";
import { vehicle } from "@/lib/vehicle";
import { faqItems, stats, blogPosts } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Vertrauens-Zahlen */}
      <section className="relative overflow-hidden">
        <div className="aurora" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1}>
                <div className="text-center">
                  <p className="font-display text-4xl font-bold text-pine-800 sm:text-5xl dark:text-pine-300">
                    {s.value}
                    <span className="text-terra-500">{s.suffix}</span>
                  </p>
                  <p className="mt-1 text-sm font-medium text-pine-600 dark:text-sand-100/60">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Fahrzeug-Vorstellung */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="group relative overflow-hidden rounded-3xl shadow-lift">
              <Image
                src={vehicle.card}
                alt="Carado T447 Seitenansicht vor Alpenpanorama"
                width={1200}
                height={900}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 rounded-full glass px-4 py-1.5 text-sm font-semibold text-white">
                Baujahr {vehicle.year} · wie neu
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-sm font-bold uppercase tracking-widest text-terra-500">Unser Schmuckstück</p>
            <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              {vehicle.name}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-pine-700 dark:text-sand-100/80">
              {vehicle.claim} auf {vehicle.basis}-Basis — fahrbar mit dem ganz normalen
              Autoführerschein. Vier echte Schlafplätze, separates Bad mit Dusche und eine
              Heckgarage, die auch vier Velos schluckt.
            </p>
            <dl className="mt-6 grid grid-cols-3 gap-4">
              {[
                { v: `${vehicle.sleeps}`, l: "Schlafplätze" },
                { v: "7.36 m", l: "Länge" },
                { v: "Kat. B", l: "Führerschein" },
              ].map((f) => (
                <div key={f.l} className="glass rounded-2xl p-4 text-center shadow-soft">
                  <dt className="order-2 text-xs font-medium text-pine-600 dark:text-sand-100/60">{f.l}</dt>
                  <dd className="font-display text-2xl font-bold">{f.v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/fahrzeuge/carado-t447" className="btn-primary">
                Alle Details & 360°-Ansicht
              </Link>
              <Link href="/fahrzeuge" className="btn-secondary border border-pine-300 dark:border-pine-700">
                Zur Fahrzeugübersicht
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Was ist inklusive? */}
      <section className="relative overflow-hidden bg-pine-950 py-20 text-sand-50">
        <div className="aurora opacity-30" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-terra-400">Keine versteckten Kosten</p>
            <h2 className="mt-2 max-w-xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Was ist inklusive? <span className="text-pine-300">Fast alles.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vehicle.included.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 0.1}>
                <div className="card-hover h-full rounded-2xl bg-white/5 p-6 backdrop-blur-sm">
                  <span className="text-3xl" aria-hidden>{f.icon}</span>
                  <h3 className="mt-3 font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-sand-100/70">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Preisrechner */}
      <section id="preisrechner" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-terra-500">Transparent auf den Franken</p>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Preisrechner</h2>
          <p className="mt-3 text-pine-700 dark:text-sand-100/80">
            Datum wählen, Extras antippen — dein Gesamtpreis erscheint sofort. Genau dieser Betrag
            steht später auf der Rechnung.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <PriceCalculator />
        </Reveal>
      </section>

      {/* Bewertungen */}
      <section className="relative overflow-hidden py-20">
        <div className="aurora" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-terra-500">★★★★★</p>
            <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Gäste, die wiederkommen
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Reviews />
          </Reveal>
        </div>
      </section>

      {/* Social Feed */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-terra-500">@teilzeitcamper</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Unterwegs mit unseren Gästen
            </h2>
          </div>
          <p className="text-sm text-pine-600 dark:text-sand-100/60">Instagram · YouTube Shorts · TikTok</p>
        </Reveal>
        <SocialFeed />
      </section>

      {/* Blog-Teaser */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-terra-500">Reise-Inspiration</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Frisch aus dem Blog
            </h2>
          </div>
          <Link href="/blog" className="text-sm font-semibold text-terra-500 hover:underline">
            Alle Artikel →
          </Link>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {blogPosts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.1}>
              <Link href={`/blog/${p.slug}`} className="card-hover group block overflow-hidden rounded-3xl glass shadow-soft">
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-terra-500">
                    {p.tags.join(" · ")} · {p.readMin} Min.
                  </p>
                  <h3 className="mt-2 font-display text-lg font-semibold leading-snug group-hover:text-terra-500">
                    {p.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-pine-600 dark:text-sand-100/70">{p.teaser}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ-Teaser */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal className="mb-8 text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Häufige Fragen</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <FaqAccordion items={faqItems.slice(0, 4)} />
        </Reveal>
        <Reveal delay={0.15} className="mt-6 text-center">
          <Link href="/faq" className="text-sm font-semibold text-terra-500 hover:underline">
            Alle {faqItems.length} Fragen ansehen →
          </Link>
        </Reveal>
      </section>

      {/* Abschluss-CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl shadow-lift">
            <Image
              src="/images/fleet/exterior-rear-quarter.jpg"
              alt="Carado T447 auf dem Weg in die Berge"
              width={1920}
              height={1080}
              sizes="100vw"
              className="h-[420px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-pine-950/85 via-pine-950/50 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-start justify-center p-8 sm:p-14">
              <h2 className="max-w-lg font-display text-3xl font-semibold text-white sm:text-5xl">
                Die Berge rufen an. Gehst du ran?
              </h2>
              <p className="mt-3 max-w-md text-white/85">
                Live-Verfügbarkeit prüfen, Daten wählen, Anfrage senden — in unter 2 Minuten.
              </p>
              <Link href="/buchung" className="btn-primary mt-6 !bg-terra-500 hover:!bg-terra-400">
                Jetzt Reise planen →
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
