# Deployment auf Vercel

## 1. Repository verbinden

```bash
cd ~/Teilzeitcamper-Premium
git add .
git commit -m "Teilzeitcamper Premium: Stripe, Trip-Clips, Vercel-ready"
# GitHub-Repo erstellen und pushen, dann auf vercel.com importieren
# — oder: npx vercel (CLI)
```

## 2. Storage (Pflicht auf Vercel!)

Ohne persistenten Speicher gehen Buchungen & Clips bei jedem Deploy verloren.

| Service | Env-Variablen | Zweck |
| --- | --- | --- |
| **Upstash Redis** | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Buchungen, Nachrichten, Codes |
| **Vercel Blob** | `BLOB_READ_WRITE_TOKEN` | Trip-Clip Fotos/Videos |

Einrichten: Vercel Dashboard → **Storage** → Upstash Redis + Blob → **Connect to Project**.

Lokal ohne diese Variablen: Daten in `.data/` (Dateisystem).

## 3. Stripe (TWINT + Karte)

1. [Stripe Dashboard](https://dashboard.stripe.com) → Testmodus
2. **Settings → Payment methods → TWINT** aktivieren (Währung CHF)
3. Env in Vercel setzen:
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. **Webhook** anlegen:
   - URL: `https://www.teilzeitcamper.ch/api/stripe/webhook`
   - Event: `checkout.session.completed`
   - Secret → `STRIPE_WEBHOOK_SECRET`
5. `NEXT_PUBLIC_SITE_URL=https://www.teilzeitcamper.ch`

Flow: Gast bucht → Redirect zu Stripe Checkout (30% Anzahlung) → Webhook bestätigt Buchung.

Admin kann unter `/admin` jederzeit einen **Zahlungslink** erzeugen.

## 4. E-Mail (optional)

[Resend](https://resend.com) → API-Key → `RESEND_API_KEY`  
Domain `teilzeitcamper.ch` verifizieren für `NOTIFY_FROM`.

## 5. Domain

Vercel → Project Settings → Domains → `teilzeitcamper.ch` + `www.teilzeitcamper.ch`

## Checkliste vor Go-Live

- [ ] `ADMIN_KEY` geändert
- [ ] Upstash + Blob verbunden
- [ ] Stripe Live-Keys + TWINT aktiv
- [ ] Webhook auf Production-URL
- [ ] UID in `lib/content.ts` (falls MWST-pflichtig)
- [ ] Echte Google-Reviews in `lib/content.ts`
