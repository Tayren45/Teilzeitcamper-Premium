"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { useLang, languages } from "@/lib/i18n";

const links = [
  { href: "/", key: "nav.home" },
  { href: "/fahrzeuge", key: "nav.vehicles" },
  { href: "/preise", key: "nav.prices" },
  { href: "/versicherungen", key: "nav.insurance" },
  { href: "/faq", key: "nav.faq" },
  { href: "/ueber-uns", key: "nav.about" },
  { href: "/blog", key: "nav.blog" },
  { href: "/trip-clips", key: "nav.tripclips" },
  { href: "/kontakt", key: "nav.contact" },
] as const;

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-9 w-9" />;
  const dark = resolvedTheme === "dark";
  return (
    <button
      aria-label={dark ? "Light Mode aktivieren" : "Dark Mode aktivieren"}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-full text-lg transition-transform duration-300 hover:rotate-12 hover:scale-110"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { t, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open ? "glass-strong shadow-soft" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Teilzeitcamper Home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-pine-800 text-lg text-white shadow-soft transition-transform duration-300 group-hover:-rotate-6 dark:bg-pine-500">
            ⛰
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            teilzeit<span className="text-terra-500">camper</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:text-terra-500 ${
                pathname === l.href ? "text-terra-500" : ""
              }`}
            >
              {t(l.key)}
              {pathname === l.href && (
                <motion.span
                  layoutId="nav-dot"
                  className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-terra-500"
                />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Sprachwahl */}
          <div className="hidden items-center rounded-full border border-pine-200 p-0.5 text-xs font-semibold sm:flex dark:border-pine-800">
            {languages.map((l) => (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                aria-pressed={lang === l.id}
                className={`rounded-full px-2 py-1 transition-all ${
                  lang === l.id ? "bg-pine-800 text-white dark:bg-pine-500" : "hover:text-terra-500"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <ThemeToggle />
          <Link href="/buchung" className="btn-primary hidden !px-5 !py-2 text-sm md:inline-flex">
            {t("cta.book")}
          </Link>
          {/* Mobile Burger */}
          <button
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menü öffnen"
            aria-expanded={open}
          >
            <span className={`h-0.5 w-6 rounded bg-current transition-all duration-300 ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-6 rounded bg-current transition-all duration-300 ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-6 rounded bg-current transition-all duration-300 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menü */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden lg:hidden"
          >
            <div className="space-y-1 px-4 pb-6 pt-2">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ x: -16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    href={l.href}
                    className={`block rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-pine-100 dark:hover:bg-pine-900 ${
                      pathname === l.href ? "text-terra-500" : ""
                    }`}
                  >
                    {t(l.key)}
                  </Link>
                </motion.div>
              ))}
              <div className="flex items-center gap-2 px-4 pt-3">
                {languages.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLang(l.id)}
                    className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                      lang === l.id ? "bg-pine-800 text-white dark:bg-pine-500" : "border border-pine-200 dark:border-pine-800"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              <div className="px-4 pt-3">
                <Link href="/buchung" className="btn-primary w-full">
                  {t("cta.book")}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
