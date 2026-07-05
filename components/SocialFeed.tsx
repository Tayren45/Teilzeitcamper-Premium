"use client";

/**
 * Social-Strip: Instagram / YouTube Shorts / TikTok.
 * Zeigt eigene Fotos als Kacheln, verlinkt auf die Profile.
 * Echte Feed-Einbettung (Instagram Basic Display API o.ä.): siehe README.
 */

import Image from "next/image";
import { motion } from "framer-motion";
import { contact } from "@/lib/content";

const tiles = [
  { src: "/images/fleet/exterior-side-profile.jpg", label: "Passstrasse statt Pendlerstau", platform: "Instagram", href: contact.instagram },
  { src: "/images/fleet/interior-kitchen.jpg", label: "Znacht mit Aussicht", platform: "Instagram", href: contact.instagram },
  { src: "/images/fleet/exterior-garage-bike.jpg", label: "Velos? Passen locker.", platform: "TikTok", href: contact.tiktok },
  { src: "/images/fleet/interior-beds-made.jpg", label: "Bettwäsche-Service", platform: "Instagram", href: contact.instagram },
  { src: "/images/fleet/exterior-rear.jpg", label: "Roadtrip-Vlog Folge 3", platform: "YouTube", href: contact.youtube },
  { src: "/images/fleet/interior-overview.jpg", label: "Roomtour in 60 Sekunden", platform: "YouTube", href: contact.youtube },
];

const icons: Record<string, string> = { Instagram: "📸", YouTube: "▶️", TikTok: "🎵" };

export default function SocialFeed() {
  return (
    <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {tiles.map((t, i) => (
        <motion.a
          key={i}
          href={t.href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.5 }}
          className="group relative aspect-[9/14] w-44 flex-none snap-start overflow-hidden rounded-2xl sm:w-52"
        >
          <Image
            src={t.src}
            alt={t.label}
            fill
            sizes="208px"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-pine-950/85 via-transparent to-pine-950/20" />
          <span className="absolute left-3 top-3 rounded-full glass px-2.5 py-1 text-xs font-semibold text-white">
            {icons[t.platform]} {t.platform}
          </span>
          <span className="absolute inset-x-3 bottom-3 text-sm font-semibold leading-snug text-white">
            {t.label}
          </span>
        </motion.a>
      ))}
    </div>
  );
}
