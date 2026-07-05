"use client";

/** Bewertungs-Karussell (Inhalte in lib/content.ts — vor Launch durch echte Google-Reviews ersetzen) */

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { reviews } from "@/lib/content";

function Stars({ n }: { n: number }) {
  return (
    <span className="text-terra-400" aria-label={`${n} von 5 Sternen`}>
      {"★".repeat(n)}
      <span className="text-pine-200 dark:text-pine-800">{"★".repeat(5 - n)}</span>
    </span>
  );
}

export default function Reviews() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % reviews.length), 6500);
    return () => clearInterval(id);
  }, []);

  const r = reviews[idx];

  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-center gap-3">
        <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
          <path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.8h3.6c2.1-1.9 3.3-4.8 3.3-8.1z"/>
          <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.6H2.1v2.9A11 11 0 0 0 12 23z"/>
          <path fill="#FBBC05" d="M5.8 14a6.6 6.6 0 0 1 0-4.2V6.9H2.1a11 11 0 0 0 0 10l3.7-2.9z"/>
          <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.3 1.7l3.2-3.2A11 11 0 0 0 2.1 6.9L5.8 9.8c.9-2.7 3.3-4.4 6.2-4.4z"/>
        </svg>
        <div>
          <p className="font-display text-lg font-semibold leading-tight">4.9 / 5.0</p>
          <p className="text-xs text-pine-600 dark:text-pine-300">Google Bewertungen</p>
        </div>
        <Stars n={5} />
      </div>

      <div className="relative min-h-56 sm:min-h-44">
        <AnimatePresence mode="wait">
          <motion.figure
            key={idx}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-3xl p-7 text-center shadow-soft sm:p-9"
          >
            <Stars n={r.stars} />
            <blockquote className="mt-3 text-balance text-lg leading-relaxed">
              «{r.text}»
            </blockquote>
            <figcaption className="mt-4 text-sm font-semibold">
              {r.name} <span className="font-normal text-pine-500 dark:text-pine-300">· {r.location} · {r.date}</span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="mt-5 flex justify-center gap-2">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Bewertung ${i + 1} anzeigen`}
            className={`h-2 rounded-full transition-all duration-300 ${i === idx ? "w-7 bg-terra-500" : "w-2 bg-pine-300 hover:bg-pine-400 dark:bg-pine-700"}`}
          />
        ))}
      </div>
    </div>
  );
}
