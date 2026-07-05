"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { contact } from "@/lib/content";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative mt-24 overflow-hidden bg-pine-950 text-sand-100">
      <div className="aurora opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-pine-500 text-lg">⛰</span>
              <span className="font-display text-xl font-semibold">
                teilzeit<span className="text-terra-400">camper</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-sand-100/70">{t("footer.tagline")}</p>
            <div className="mt-5 flex gap-3">
              <a href={contact.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                 className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all hover:scale-110 hover:bg-terra-500">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2m0 1.8c-3.1 0-3.5 0-4.8.1-1.1.1-1.5.2-1.9.3-.5.2-.8.4-1.1.7-.3.3-.5.6-.7 1.1-.1.4-.3.8-.3 1.9-.1 1.3-.1 1.7-.1 4.8s0 3.5.1 4.8c.1 1.1.2 1.5.3 1.9.2.5.4.8.7 1.1.3.3.6.5 1.1.7.4.1.8.3 1.9.3 1.3.1 1.7.1 4.8.1s3.5 0 4.8-.1c1.1-.1 1.5-.2 1.9-.3.5-.2.8-.4 1.1-.7.3-.3.5-.6.7-1.1.1-.4.3-.8.3-1.9.1-1.3.1-1.7.1-4.8s0-3.5-.1-4.8c-.1-1.1-.2-1.5-.3-1.9-.2-.5-.4-.8-.7-1.1-.3-.3-.6-.5-1.1-.7-.4-.1-.8-.3-1.9-.3-1.3-.1-1.7-.1-4.8-.1M12 7.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8m0 8.1a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4m6.3-8.3a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0"/></svg>
              </a>
              <a href={contact.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                 className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all hover:scale-110 hover:bg-terra-500">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.5 15.5v-7l6.3 3.5-6.3 3.5z"/></svg>
              </a>
              <a href={contact.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok"
                 className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all hover:scale-110 hover:bg-terra-500">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M19.6 5.8a5 5 0 0 1-3.5-4.3H12.7v13.9a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.2a6.3 6.3 0 0 0-.9-.1 6.3 6.3 0 1 0 6.3 6.3V8.8a8.3 8.3 0 0 0 4.6 1.4V6.8a5 5 0 0 1-1.1-1z"/></svg>
              </a>
            </div>
          </div>

          <nav aria-label="Footer Entdecken">
            <h3 className="text-sm font-bold uppercase tracking-widest text-sand-100/50">Entdecken</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link className="transition-colors hover:text-terra-400" href="/fahrzeuge">{t("nav.vehicles")}</Link></li>
              <li><Link className="transition-colors hover:text-terra-400" href="/fahrzeuge/carado-t447">Carado T447</Link></li>
              <li><Link className="transition-colors hover:text-terra-400" href="/preise">{t("nav.prices")}</Link></li>
              <li><Link className="transition-colors hover:text-terra-400" href="/blog">{t("nav.blog")}</Link></li>
              <li><Link className="transition-colors hover:text-terra-400" href="/trip-clips">{t("nav.tripclips")}</Link></li>
              <li><Link className="transition-colors hover:text-terra-400" href="/faq">{t("nav.faq")}</Link></li>
            </ul>
          </nav>

          <nav aria-label="Footer Service">
            <h3 className="text-sm font-bold uppercase tracking-widest text-sand-100/50">Service</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link className="transition-colors hover:text-terra-400" href="/buchung">{t("nav.booking")}</Link></li>
              <li><Link className="transition-colors hover:text-terra-400" href="/versicherungen">{t("nav.insurance")}</Link></li>
              <li><Link className="transition-colors hover:text-terra-400" href="/ueber-uns">{t("nav.about")}</Link></li>
              <li><Link className="transition-colors hover:text-terra-400" href="/kontakt">{t("nav.contact")}</Link></li>
              <li><Link className="transition-colors hover:text-terra-400" href="/admin">Admin</Link></li>
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-sand-100/50">Kontakt</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-sand-100/80">
              <li>{contact.legalName}</li>
              <li>{contact.street}, {contact.city}</li>
              <li><a className="transition-colors hover:text-terra-400" href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a></li>
              <li><a className="transition-colors hover:text-terra-400" href={`mailto:${contact.email}`}>{contact.email}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-sand-100/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {contact.legalName}. Alle Rechte vorbehalten.</p>
          <div className="flex gap-6">
            <Link className="transition-colors hover:text-terra-400" href="/impressum">Impressum</Link>
            <Link className="transition-colors hover:text-terra-400" href="/datenschutz">Datenschutz</Link>
            <Link className="transition-colors hover:text-terra-400" href="/agb">AGB</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
