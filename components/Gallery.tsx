"use client";

/** Bildergalerie mit Kategorie-Filter und Vollbild-Lightbox (Tastatur: ←/→/Esc) */

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GalleryImage } from "@/lib/vehicle";

const filters = [
  { id: "alle", label: "Alle" },
  { id: "aussen", label: "Aussen" },
  { id: "innen", label: "Innen" },
  { id: "details", label: "Details" },
] as const;

export default function Gallery({ images }: { images: GalleryImage[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("alle");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const shown = filter === "alle" ? images : images.filter((i) => i.category === filter);

  const step = useCallback(
    (dir: 1 | -1) =>
      setLightbox((i) => (i === null ? null : (i + dir + shown.length) % shown.length)),
    [shown.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, step]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => { setFilter(f.id); setLightbox(null); }}
            aria-pressed={filter === f.id}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-95 ${
              filter === f.id
                ? "bg-pine-800 text-white shadow-soft dark:bg-pine-500"
                : "border border-pine-200 hover:border-pine-500 dark:border-pine-800"
            }`}
          >
            {f.label}
            <span className="ml-1.5 text-xs opacity-60">
              {f.id === "alle" ? images.length : images.filter((i) => i.category === f.id).length}
            </span>
          </button>
        ))}
      </div>

      <motion.div layout className="columns-2 gap-3 md:columns-3 [&>*]:mb-3">
        <AnimatePresence mode="popLayout">
          {shown.map((img, i) => (
            <motion.button
              layout
              key={img.src}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.35 }}
              onClick={() => setLightbox(i)}
              className="group relative block w-full overflow-hidden rounded-2xl"
              aria-label={`${img.alt} — Vollbild öffnen`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.w === 4 ? 800 : 600}
                height={img.w === 4 ? 600 : 800}
                sizes="(max-width: 768px) 50vw, 33vw"
                className="w-full transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-pine-950/0 transition-colors duration-300 group-hover:bg-pine-950/25" />
              <span className="absolute bottom-3 left-3 translate-y-2 rounded-full glass px-3 py-1 text-xs font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {img.alt}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && shown[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-pine-950/95 p-4 backdrop-blur-xl"
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Bildergalerie Vollbild"
          >
            <motion.div
              key={shown[lightbox].src}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative max-h-[85vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={shown[lightbox].src}
                alt={shown[lightbox].alt}
                width={1600}
                height={1200}
                sizes="90vw"
                className="mx-auto max-h-[85vh] w-auto rounded-2xl object-contain"
                priority
              />
              <p className="mt-3 text-center text-sm text-white/80">
                {shown[lightbox].alt} · {lightbox + 1}/{shown.length}
              </p>
            </motion.div>

            <button onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Vorheriges Bild"
              className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full glass text-xl text-white transition-transform hover:scale-110 sm:left-6">←</button>
            <button onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Nächstes Bild"
              className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full glass text-xl text-white transition-transform hover:scale-110 sm:right-6">→</button>
            <button onClick={() => setLightbox(null)} aria-label="Schliessen"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full glass text-lg text-white transition-transform hover:rotate-90">✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
