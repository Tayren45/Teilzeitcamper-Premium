/** Einheitlicher Seitenkopf für Unterseiten */

import Reveal from "./Reveal";

export default function PageHero({
  kicker,
  title,
  lead,
}: {
  kicker: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="relative overflow-hidden pb-10 pt-32 sm:pt-36">
      <div className="aurora" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-widest text-terra-500">{kicker}</p>
          <h1 className="mt-2 max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {lead && (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-pine-700 dark:text-sand-100/80">
              {lead}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
