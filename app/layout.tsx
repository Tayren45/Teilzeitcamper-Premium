import type { Metadata, Viewport } from "next";
import { Manrope, Fraunces } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KIChat from "@/components/KIChat";
import { contact } from "@/lib/content";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const SITE_URL = "https://www.teilzeitcamper.ch";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Teilzeitcamper — Premium Wohnmobil mieten in der Ostschweiz",
    template: "%s | Teilzeitcamper",
  },
  description:
    "Miete den Carado T447 (4 Schlafplätze, Vollkasko, 200 km/Tag inklusive) direkt in St. Gallen. Persönliche Übergabe, transparente Preise, Online-Buchung mit Live-Verfügbarkeit.",
  keywords: [
    "Wohnmobil mieten",
    "Camper mieten Schweiz",
    "Wohnmobilvermietung St. Gallen",
    "Carado T447 mieten",
    "Wohnmobil Ostschweiz",
    "Camper Ferien Schweiz",
  ],
  openGraph: {
    type: "website",
    locale: "de_CH",
    url: SITE_URL,
    siteName: "Teilzeitcamper",
    title: "Teilzeitcamper — Dein Abenteuer beginnt hier.",
    description:
      "Premium-Wohnmobil mieten in der Ostschweiz: persönlich übergeben, liebevoll gepflegt, transparent kalkuliert.",
    images: [{ url: "/images/fleet/hero-front-quarter.jpg", width: 1920, height: 1440, alt: "Carado T447 Wohnmobil" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Teilzeitcamper — Premium Wohnmobil mieten",
    description: "Carado T447 mieten in St. Gallen. Persönlich, transparent, sofort online buchbar.",
    images: ["/images/fleet/hero-front-quarter.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f4" },
    { media: "(prefers-color-scheme: dark)", color: "#090f0c" },
  ],
  width: "device-width",
  initialScale: 1,
};

/** Schema.org: Vermietungsbetrieb + Fahrzeugangebot (Rich Results) */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}#business`,
      name: contact.legalName,
      url: SITE_URL,
      email: contact.email,
      telephone: contact.phone,
      image: `${SITE_URL}/images/fleet/hero-front-quarter.jpg`,
      priceRange: "CHF 145–205 pro Nacht",
      address: {
        "@type": "PostalAddress",
        streetAddress: contact.street,
        addressLocality: "St. Gallen",
        postalCode: "9000",
        addressCountry: "CH",
      },
      geo: { "@type": "GeoCoordinates", latitude: 47.4245, longitude: 9.3767 },
      openingHours: "Mo-Sa 08:00-19:00",
    },
    {
      "@type": "Product",
      name: "Carado T447 Wohnmobil-Miete",
      description: "Teilintegriertes Wohnmobil mit 4 Schlafplätzen, Vollkasko und 200 km/Tag inklusive.",
      image: `${SITE_URL}/images/fleet/exterior-side-profile.jpg`,
      brand: { "@type": "Brand", name: "Carado" },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "CHF",
        lowPrice: 145,
        highPrice: 205,
        offerCount: 3,
        availability: "https://schema.org/InStock",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de-CH" suppressHydrationWarning>
      <body className={`${manrope.variable} ${fraunces.variable} font-sans`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <Navbar />
            <main id="main">{children}</main>
            <Footer />
            <KIChat />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
