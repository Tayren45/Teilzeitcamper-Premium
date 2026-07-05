"use client";

/**
 * Vollbild-Hero: filmische Ken-Burns-Slideshow der echten Fahrzeugfotos
 * (Video-Look ohne Video-Datei — ein Hintergrundvideo kann in
 * public/videos/hero.mp4 abgelegt und unten aktiviert werden).
 */

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { nextFreeWindow, fmtDate, type BookedRange } from "@/lib/bookings";

const slides = [
  "/images/fleet/hero-front-quarter.jpg",
  "/images/fleet/exterior-side-profile.jpg",
  "/images/fleet/exterior-rear-quarter.jpg",
];

export default function Hero() {
  const { t } = useLang();
  const [slide, setSlide] = useState(0);
  const [freeWindow, setFreeWindow] = useState<{ start: string; end: string } | null>(null);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % slides.length), 7000);
    return () => clearInterval(id);
  }, []);

  // Live-Verfügbarkeit aus der Buchungs-API
  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((d: { ranges: BookedRange[] }) => setFreeWindow(nextFreeWindow(d.ranges ?? [])))
      .catch(() => setFreeWindow(null));
  }, []);

  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden">
      {/* Slideshow-Hintergrund: alle Ebenen bleiben gemountet (weiche Überblendung, stabiles LCP) */}
      <div className="absolute inset-0 animate-kenburns">
        {slides.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={i === slide ? "Carado T447 Wohnmobil unterwegs in der Schweiz" : ""}
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-[1600ms] ease-in-out ${
              i === slide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Verlaufs-Overlays für Lesbarkeit */}
      <div className="absolute inset-0 bg-gradient-to-t from-pine-950/90 via-pine-950/25 to-pine-950/30" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-r from-pine-950/40 to-transparent" aria-hidden />

      {/* Inhalt */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm font-semibold text-white"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
          </span>
          {freeWindow
            ? `${t("hero.available")}: ${fmtDate(freeWindow.start)}`
            : t("hero.availability")}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.9 }}
          className="max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          {t("hero.title")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9 }}
          className="mt-5 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.9 }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <Link href="/buchung" className="btn-primary !bg-terra-500 text-base hover:!bg-terra-400">
            {t("cta.book")} <span aria-hidden>→</span>
          </Link>
          <Link href="/fahrzeuge/carado-t447" className="btn-secondary glass text-white hover:bg-white/20">
            {t("cta.discover")}
          </Link>
        </motion.div>

        {/* Vertrauens-Badges */}
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-sm font-medium text-white/80"
        >
          {["badge.insured", "badge.km", "badge.pets"].map((k) => (
            <li key={k} className="flex items-center gap-2">
              <svg className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0z" clipRule="evenodd" />
              </svg>
              {t(k as "badge.insured")}
            </li>
          ))}
        </motion.ul>
      </div>

      {/* Scroll-Indikator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        aria-hidden
      >
        <div className="animate-float flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/50 p-1.5">
          <div className="h-2 w-1 rounded-full bg-white/80" />
        </div>
      </motion.div>
    </section>
  );
}
