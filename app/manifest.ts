import type { MetadataRoute } from "next";

/** PWA-Manifest — «Zum Home-Bildschirm hinzufügen» */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Teilzeitcamper — Wohnmobil mieten",
    short_name: "Teilzeitcamper",
    description: "Premium-Wohnmobil mieten in der Ostschweiz.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f4",
    theme_color: "#16382d",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
