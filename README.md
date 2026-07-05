# Teilzeitcamper — Premium-Website

Moderne Wohnmobilvermietungs-Website (Next.js 15, App Router) für **Teilzeitcamper by
Lackwerk Bruderer** — Carado T447, St. Gallen. Designsprache: Luxus trifft Abenteuer
(viel Weissraum, riesige Bilder, Glassmorphism, Dark/Light-Mode, Microinteractions).

## Starten

```bash
npm install
npm run dev        # → http://localhost:3123
npm run build      # Produktions-Build
```

Preview-Konfiguration `teilzeitcamper-premium` (Port 3123) liegt in `.claude/launch.json`.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** (Design-Tokens in `app/globals.css` unter `@theme`)
- **Framer Motion** (Scroll-Reveals, Seitenübergänge, Microinteractions)
- **next-themes** (Dark/Light-Mode, systemgesteuert)
- Buchungen & Kontakt: **Upstash Redis** (Production) oder `.data/` (lokal) via `lib/persist.ts`
- Trip-Clip Medien: **Vercel Blob** (Production) oder `.data/trip-clips-media/` (lokal)
- Zahlung: **Stripe Checkout** (TWINT, Karte, PayPal) — siehe `DEPLOY.md`

## Seiten

Home · Fahrzeuge · Fahrzeug-Detail (Galerie mit 37 echten Fotos, Rundum-Viewer,
Grundriss, technische Daten, Preisrechner) · Buchung (4-Schritte-Assistent mit
Live-Kalender) · **Trip-Clips** (Gäste-Feed mit Zugangscode) · Preise · Versicherungen · FAQ (mit FAQ-Schema) · Über uns · Blog
(3 Artikel) · Kontakt (OSM-Karte) · Impressum · Datenschutz · AGB · Admin (Demo).

## Wo pflege ich Inhalte?

| Was | Datei |
| --- | --- |
| Fahrzeugdaten, Ausstattung, Extras, Bilder | `lib/vehicle.ts` |
| Saisonpreise, Rabattcodes, Kaution | `lib/pricing.ts` |
| Kontaktdaten, FAQ, Blog, Bewertungen | `lib/content.ts` |
| Übersetzungen DE/EN/FR/IT | `lib/i18n.tsx` |
| Fotos | `public/images/fleet/` |

**Vor dem Launch noch prüfen:**
UID in `lib/content.ts` (falls MWST-pflichtig) ·
**Beispiel-Bewertungen durch echte Google-Reviews ersetzen** ·
Fahrzeugmasse mit Fahrzeugausweis abgleichen · Datenschutz/AGB juristisch prüfen.

**Deployment:** siehe [`DEPLOY.md`](DEPLOY.md) — Vercel + Upstash + Blob + Stripe.

## Admin

`/admin` — Buchungen, Trip-Clips, Nachrichten, Zugangscodes. Schlüssel via `ADMIN_KEY`.
Stripe-Zahlungslinks für offene Anzahlungen direkt im Dashboard.

## Ausbaustufen (optional)

1. **PostgreSQL + Prisma** statt Redis für komplexere Abfragen
2. **Gast-Bestätigungsmail** nach Buchung (Resend-Template)
3. **KI-Chat mit Claude API**: `components/KIChat.tsx` ist regelbasiert. Für freie
   Konversation `/api/chat` mit `@anthropic-ai/sdk` anbinden.
4. **Google Reviews live**: Google Business Profile API; Daten in `lib/content.ts → reviews`.
5. **Instagram/TikTok-Feed live**: Instagram Basic Display API in `components/SocialFeed.tsx`.
6. **Analytics**: Plausible (cookielos) oder GA4 — Consent-Banner + Datenschutz anpassen.
7. **Volle Locale-Routen** (`/en/…`): auf `next-intl` migrieren.
8. **Hero-Video**: `public/videos/hero.mp4` in `components/Hero.tsx`.

## Performance

Alle Bilder laufen über `next/image` (AVIF/WebP, responsive Grössen, Lazy-Loading),
Fonts über `next/font` (kein Layout-Shift), Animationen respektieren
`prefers-reduced-motion`. Für Lighthouse 100 vor dem Launch: Bilder zusätzlich auf
~1600px verkleinern und `npm run build && npm start` testen (Dev-Modus ist langsamer).
