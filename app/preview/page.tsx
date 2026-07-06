import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { contact } from "@/lib/content";

export const metadata = {
  title: "Vorschau & Launch-Checkliste",
  robots: { index: false, follow: false },
};

const pages = [
  { href: "/", label: "Startseite", desc: "Hero, Preisrechner, Bewertungen" },
  { href: "/fahrzeuge/carado-t447", label: "Carado T447", desc: "Galerie, 360°, Grundriss" },
  { href: "/buchung", label: "Buchung", desc: "4-Schritte-Assistent + Kalender" },
  { href: "/trip-clips", label: "Trip-Clips", desc: "Gäste-Feed mit Zugangscode" },
  { href: "/preise", label: "Preise", desc: "Saisonpreise & Extras" },
  { href: "/faq", label: "FAQ", desc: "Häufige Fragen" },
  { href: "/kontakt", label: "Kontakt", desc: "Formular & Karte" },
  { href: "/admin", label: "Admin", desc: "Buchungen, Clips, Nachrichten" },
];

function envCheck(label: string, ok: boolean, hint: string) {
  return { label, ok, hint };
}

export default function PreviewPage() {
  const vercelEnv = process.env.VERCEL_ENV ?? "local";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3123";
  const isProd = vercelEnv === "production";

  const checks = [
    envCheck("Upstash Redis", Boolean(process.env.UPSTASH_REDIS_REST_URL), "Buchungen & Nachrichten persistent"),
    envCheck("Vercel Blob", Boolean(process.env.BLOB_READ_WRITE_TOKEN), "Trip-Clip Fotos/Videos"),
    envCheck("Stripe", Boolean(process.env.STRIPE_SECRET_KEY), "TWINT, Karte, PayPal"),
    envCheck("Resend E-Mail", Boolean(process.env.RESEND_API_KEY), "Benachrichtigungen an David"),
    envCheck("Admin-Key", Boolean(process.env.ADMIN_KEY), "Zugang /admin"),
    envCheck("Site-URL", Boolean(process.env.NEXT_PUBLIC_SITE_URL), siteUrl),
  ];

  const done = checks.filter((c) => c.ok).length;

  return (
    <>
      <div className="border-b border-amber-300/60 bg-amber-100 px-4 py-2.5 text-center text-sm font-semibold text-amber-900 dark:border-amber-700/50 dark:bg-amber-950/60 dark:text-amber-200">
        🔒 Interne Vorschau — nicht für Suchmaschinen indexiert · Env:{" "}
        <span className="font-mono">{vercelEnv}</span>
        {isProd && " · Production"}
      </div>

      <PageHero
        kicker="Teilzeitcamper"
        title="Vorschau & Launch-Checkliste"
        lead="Alle Seiten auf einen Blick — und was vor dem öffentlichen Go-Live noch fehlt."
      />

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <Reveal>
          <div className="glass grid gap-4 rounded-3xl p-6 shadow-soft sm:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-pine-500">Umgebung</p>
              <p className="mt-1 font-display text-2xl font-semibold capitalize">{vercelEnv}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-pine-500">Site-URL</p>
              <p className="mt-1 truncate font-mono text-sm">{siteUrl}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-pine-500">Konfiguration</p>
              <p className="mt-1 font-display text-2xl font-semibold">
                {done}/{checks.length}{" "}
                <span className="text-base font-normal text-pine-600 dark:text-pine-300">bereit</span>
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold">Seiten durchklicken</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {pages.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="card-hover glass rounded-2xl p-4 shadow-soft transition-colors hover:border-terra-400/50"
                >
                  <span className="font-semibold text-terra-500">{p.label}</span>
                  <span className="mt-1 block text-sm text-pine-600 dark:text-sand-100/70">{p.desc}</span>
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-display text-2xl font-semibold">Launch-Checkliste</h2>
            <ul className="mt-5 space-y-3">
              {checks.map((c) => (
                <li
                  key={c.label}
                  className={`flex items-start gap-3 rounded-2xl border px-4 py-3 ${
                    c.ok
                      ? "border-green-200 bg-green-50/80 dark:border-green-900 dark:bg-green-950/30"
                      : "border-amber-200 bg-amber-50/80 dark:border-amber-900 dark:bg-amber-950/20"
                  }`}
                >
                  <span className="mt-0.5 text-lg" aria-hidden>
                    {c.ok ? "✓" : "○"}
                  </span>
                  <div>
                    <p className="font-semibold">{c.label}</p>
                    <p className="text-sm text-pine-600 dark:text-sand-100/60">{c.hint}</p>
                  </div>
                </li>
              ))}
              <li className="flex items-start gap-3 rounded-2xl border border-pine-200 px-4 py-3 dark:border-pine-800">
                <span className="mt-0.5 text-lg" aria-hidden>○</span>
                <div>
                  <p className="font-semibold">DNS teilzeitcamper.ch</p>
                  <p className="text-sm text-pine-600 dark:text-sand-100/60">
                    A-Records oder Vercel-Nameserver beim Registrar setzen
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-2xl border border-pine-200 px-4 py-3 dark:border-pine-800">
                <span className="mt-0.5 text-lg" aria-hidden>○</span>
                <div>
                  <p className="font-semibold">UID / Google-Reviews</p>
                  <p className="text-sm text-pine-600 dark:text-sand-100/60">
                    In <code className="font-mono text-xs">lib/content.ts</code> eintragen
                  </p>
                </div>
              </li>
            </ul>
            <p className="mt-6 text-sm text-pine-500">
              Kontakt: {contact.phone} · {contact.email} · {contact.street}, {contact.city}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mt-12 text-center">
          <Link href="/" className="btn-primary">
            Zur öffentlichen Startseite →
          </Link>
        </Reveal>
      </section>
    </>
  );
}
