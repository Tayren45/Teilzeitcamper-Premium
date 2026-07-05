import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { blogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog — Routen, Packlisten & Campingtipps",
  description:
    "Reiseinspiration aus erster Hand: Alpenpässe, Herbstrouten, Packlisten und Camping-Wissen für die Schweiz und Europa.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        kicker="Aus dem Bordbuch"
        title="Blog"
        lead="Routen, die wir selbst gefahren sind. Tipps, die wir selbst brauchten. Keine KI-Floskeln — echtes Camper-Wissen."
      />
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <Link
                href={`/blog/${p.slug}`}
                className="card-hover group flex h-full flex-col overflow-hidden rounded-3xl glass shadow-soft"
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full glass px-3 py-1 text-xs font-semibold text-white">
                    {p.tags[0]}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-pine-500 dark:text-pine-300">
                    {new Date(p.date).toLocaleDateString("de-CH", { day: "numeric", month: "long", year: "numeric" })} · {p.readMin} Min. Lesezeit
                  </p>
                  <h2 className="mt-2 font-display text-xl font-semibold leading-snug transition-colors group-hover:text-terra-500">
                    {p.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-pine-600 dark:text-sand-100/70">
                    {p.teaser}
                  </p>
                  <span className="mt-4 text-sm font-semibold text-terra-500">Weiterlesen →</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
