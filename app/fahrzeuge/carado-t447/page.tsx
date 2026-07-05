import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Gallery from "@/components/Gallery";
import Viewer360 from "@/components/Viewer360";
import PriceCalculator from "@/components/PriceCalculator";
import PrintButton from "@/components/PrintButton";
import { vehicle } from "@/lib/vehicle";
import { seasons } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Carado T447 — Details, Galerie & 360°-Ansicht",
  description:
    "Alle Details zum Carado T447: 37 echte Fotos, Rundum-Ansicht, Grundriss, Masse, Gewicht, Motor, Verbrauch und Live-Preisrechner.",
};

export default function VehicleDetailPage() {
  return (
    <>
      <PageHero
        kicker={`${vehicle.claim}`}
        title={vehicle.name}
        lead={`Baujahr ${vehicle.year} · ${vehicle.basis} · ${vehicle.license}`}
      />

      {/* Hero-Bild + Schnellfakten */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl shadow-lift">
            <Image
              src={vehicle.hero}
              alt={`${vehicle.name} Frontansicht`}
              width={1920}
              height={1440}
              priority
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="max-h-[600px] w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-3 bg-gradient-to-t from-pine-950/85 to-transparent p-6">
              {["4 Schlafplätze", "3.5 t — Kat. B", "140 PS", "Solar & Markise"].map((b) => (
                <span key={b} className="rounded-full glass px-4 py-1.5 text-sm font-semibold text-white">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <Link href="/buchung" className="btn-primary !bg-terra-500 hover:!bg-terra-400">
              Verfügbarkeit prüfen →
            </Link>
            <PrintButton label="📄 Datenblatt als PDF" />
          </div>
          <p className="text-sm text-pine-600 dark:text-sand-100/60">
            ab <strong className="font-display text-xl text-pine-950 dark:text-sand-50">CHF 145</strong> / Nacht
          </p>
        </Reveal>
      </section>

      {/* 360 + Grundriss/Layout */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <h2 className="mb-4 font-display text-3xl font-semibold tracking-tight">Rundum-Ansicht</h2>
            <Viewer360 frames={vehicle.view360} />
          </Reveal>
          <Reveal delay={0.12} className="lg:col-span-2">
            <h2 className="mb-4 font-display text-3xl font-semibold tracking-tight">Grundriss & Aufteilung</h2>
            {/* Stilisierter Grundriss */}
            <div className="glass rounded-3xl p-6 shadow-soft">
              <svg viewBox="0 0 300 130" className="w-full" role="img" aria-label="Schematischer Grundriss des Carado T447">
                <rect x="4" y="14" width="292" height="102" rx="14" className="fill-pine-100 stroke-pine-800 dark:fill-pine-900" strokeWidth="2.5" />
                {/* Fahrerhaus */}
                <path d="M4 40 Q4 14 30 14 L58 14 L58 116 L30 116 Q4 116 4 90 Z" className="fill-pine-200/70 dark:fill-pine-800/70" />
                <circle cx="30" cy="45" r="9" className="fill-pine-800 dark:fill-pine-400" />
                <circle cx="30" cy="85" r="9" className="fill-pine-800 dark:fill-pine-400" />
                <text x="31" y="123" textAnchor="middle" className="fill-pine-700 text-[9px] font-semibold dark:fill-pine-300">Cockpit</text>
                {/* Dinette */}
                <rect x="66" y="20" width="52" height="38" rx="6" className="fill-terra-300/60" />
                <text x="92" y="43" textAnchor="middle" className="fill-pine-900 text-[9px] font-semibold dark:fill-sand-50">Dinette</text>
                {/* Küche */}
                <rect x="66" y="76" width="52" height="34" rx="6" className="fill-sand-300/80" />
                <text x="92" y="96" textAnchor="middle" className="fill-pine-900 text-[9px] font-semibold">Küche</text>
                {/* Bad */}
                <rect x="130" y="20" width="46" height="38" rx="6" className="fill-pine-300/60" />
                <text x="153" y="43" textAnchor="middle" className="fill-pine-900 text-[9px] font-semibold dark:fill-sand-50">Bad</text>
                {/* Dusche */}
                <rect x="130" y="76" width="46" height="34" rx="6" className="fill-pine-300/60" />
                <text x="153" y="96" textAnchor="middle" className="fill-pine-900 text-[9px] font-semibold dark:fill-sand-50">Dusche</text>
                {/* Betten */}
                <rect x="188" y="20" width="96" height="34" rx="8" className="fill-white stroke-pine-400 dark:fill-night-800" strokeWidth="1.5" />
                <rect x="188" y="76" width="96" height="34" rx="8" className="fill-white stroke-pine-400 dark:fill-night-800" strokeWidth="1.5" />
                <text x="236" y="40" textAnchor="middle" className="fill-pine-700 text-[9px] font-semibold dark:fill-pine-300">Einzelbett</text>
                <text x="236" y="96" textAnchor="middle" className="fill-pine-700 text-[9px] font-semibold dark:fill-pine-300">Einzelbett</text>
              </svg>
              <ul className="mt-5 space-y-2.5 text-sm">
                {vehicle.layout.map((l) => (
                  <li key={l} className="flex gap-2.5">
                    <span className="mt-0.5 text-green-500">✓</span>
                    <span className="text-pine-800 dark:text-sand-100/85">{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Technische Daten */}
      <section className="relative overflow-hidden bg-pine-950 py-16 text-sand-50 print:bg-white print:text-pine-950">
        <div className="aurora opacity-30 print:hidden" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Masse, Motor & Technik
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {vehicle.specs.map((s, i) => (
              <Reveal key={s.label} delay={(i % 3) * 0.06}>
                <div className="flex items-baseline justify-between rounded-2xl bg-white/5 px-5 py-4 backdrop-blur-sm print:border print:border-pine-200">
                  <dt className="text-sm text-sand-100/70 print:text-pine-600">{s.label}</dt>
                  <dd className="font-display text-lg font-semibold">{s.value}</dd>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p className="mt-6 text-xs text-sand-100/50 print:text-pine-500">
              Angaben gemäss Werksdaten; massgebend ist der Fahrzeugausweis.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Galerie */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal className="mb-8">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Galerie <span className="text-pine-400">· {vehicle.gallery.length} echte Fotos</span>
          </h2>
          <p className="mt-2 text-pine-700 dark:text-sand-100/80">
            Keine Katalogbilder — genau dieses Fahrzeug wartet auf dich.
          </p>
        </Reveal>
        <Gallery images={vehicle.gallery} />
      </section>

      {/* Saisonpreise + Rechner */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal className="mb-8">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Preise & Verfügbarkeit</h2>
        </Reveal>
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {(Object.keys(seasons) as (keyof typeof seasons)[]).map((id, i) => {
            const s = seasons[id];
            return (
              <Reveal key={id} delay={i * 0.08}>
                <div className={`rounded-3xl p-6 shadow-soft ${id === "haupt" ? "bg-pine-800 text-white dark:bg-pine-600" : "glass"}`}>
                  <h3 className="font-semibold">{s.name}</h3>
                  <p className="mt-2 font-display text-3xl font-bold">
                    CHF {s.pricePerNight}
                    <span className="text-base font-normal opacity-70"> / Nacht</span>
                  </p>
                  <p className={`mt-2 text-sm ${id === "haupt" ? "text-white/70" : "text-pine-600 dark:text-sand-100/60"}`}>
                    Mindestens {s.minNights} Nächte
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal delay={0.1}>
          <PriceCalculator compact />
        </Reveal>
      </section>
    </>
  );
}
