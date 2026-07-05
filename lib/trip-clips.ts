/** Trip-Clips: Typen und Client-Helfer (ohne Node.js-APIs) */

export type TripClip = {
  id: string;
  createdAt: string;
  name: string;
  place: string;
  date?: string;
  caption?: string;
  type: "image" | "video" | "demo";
  mediaFile?: string;
  posterFile?: string;
  mediaUrl?: string;
  posterUrl?: string;
  approved: boolean;
  grad?: string;
};

export type AccessCode = {
  code: string;
  label?: string;
  active: boolean;
  createdAt: string;
};

export const DEMO_CLIPS: TripClip[] = [
  {
    id: "demo-1",
    createdAt: "2026-01-01T00:00:00Z",
    type: "demo",
    grad: "from-pine-600 to-pine-800",
    name: "Lisa & Tom",
    place: "Furkapass",
    caption: "Sonnenaufgang über den Alpen ☀️",
    approved: true,
  },
  {
    id: "demo-2",
    createdAt: "2026-01-01T00:00:00Z",
    type: "demo",
    grad: "from-terra-500 to-amber-700",
    name: "Familie Berger",
    place: "Lago Maggiore",
    caption: "Frühstück mit Seeblick – unbezahlbar.",
    approved: true,
  },
  {
    id: "demo-3",
    createdAt: "2026-01-01T00:00:00Z",
    type: "demo",
    grad: "from-sky-500 to-teal-700",
    name: "Nina",
    place: "Verzascatal",
    caption: "Türkises Wasser, kein Mensch weit und breit.",
    approved: true,
  },
];

export function clipMediaUrl(clip: TripClip): string | null {
  if (clip.mediaUrl) return clip.mediaUrl;
  if (!clip.mediaFile) return null;
  return `/api/trip-clips/media/${encodeURIComponent(clip.mediaFile)}`;
}

export function clipPosterUrl(clip: TripClip): string | null {
  if (clip.posterUrl) return clip.posterUrl;
  if (!clip.posterFile) return null;
  return `/api/trip-clips/media/${encodeURIComponent(clip.posterFile)}`;
}

export function fmtClipDate(d?: string): string {
  if (!d) return "";
  const p = d.split("-");
  return p.length === 3 ? `${p[2]}.${p[1]}.${p[0]}` : d;
}
