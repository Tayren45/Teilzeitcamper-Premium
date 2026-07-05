"use client";

/**
 * Leichtgewichtige Mehrsprachigkeit (DE/EN/FR/IT).
 * Deutsch ist die Vollsprache; EN/FR/IT übersetzen Navigation, Hero,
 * Buttons und Kernaussagen. Für vollständige Locale-Routen (/en/…)
 * ist der Umstieg auf next-intl im README dokumentiert.
 */

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "de" | "en" | "fr" | "it";

const dict = {
  de: {
    "nav.home": "Home",
    "nav.vehicles": "Fahrzeuge",
    "nav.booking": "Buchung",
    "nav.prices": "Preise",
    "nav.insurance": "Versicherungen",
    "nav.faq": "FAQ",
    "nav.about": "Über uns",
    "nav.blog": "Blog",
    "nav.tripclips": "Trip-Clips",
    "nav.contact": "Kontakt",
    "cta.book": "Jetzt buchen",
    "cta.discover": "Fahrzeug entdecken",
    "cta.request": "Anfrage senden",
    "cta.calc": "Preis berechnen",
    "hero.title": "Dein Abenteuer beginnt hier.",
    "hero.subtitle": "Premium-Wohnmobil mieten in der Ostschweiz — persönlich übergeben, liebevoll gepflegt, bereit für deine Route.",
    "hero.availability": "Live-Verfügbarkeit",
    "hero.available": "Nächster freier Zeitraum",
    "badge.insured": "Vollkasko inklusive",
    "badge.km": "200 km/Tag inklusive",
    "badge.pets": "Haustiere willkommen",
    "footer.tagline": "Wohnmobil-Vermietung mit Herz aus der Ostschweiz.",
    "chat.title": "Camper-Berater",
    "chat.subtitle": "Findet in 5 Fragen deinen Reisestil",
  },
  en: {
    "nav.home": "Home",
    "nav.vehicles": "Vehicles",
    "nav.booking": "Booking",
    "nav.prices": "Pricing",
    "nav.insurance": "Insurance",
    "nav.faq": "FAQ",
    "nav.about": "About",
    "nav.blog": "Blog",
    "nav.tripclips": "Trip-Clips",
    "nav.contact": "Contact",
    "cta.book": "Book now",
    "cta.discover": "Discover the camper",
    "cta.request": "Send request",
    "cta.calc": "Calculate price",
    "hero.title": "Your adventure starts here.",
    "hero.subtitle": "Rent a premium motorhome in Eastern Switzerland — personally handed over, lovingly maintained, ready for your route.",
    "hero.availability": "Live availability",
    "hero.available": "Next available period",
    "badge.insured": "Full insurance included",
    "badge.km": "200 km/day included",
    "badge.pets": "Pets welcome",
    "footer.tagline": "Motorhome rental with heart from Eastern Switzerland.",
    "chat.title": "Camper advisor",
    "chat.subtitle": "Finds your travel style in 5 questions",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.vehicles": "Véhicules",
    "nav.booking": "Réservation",
    "nav.prices": "Prix",
    "nav.insurance": "Assurances",
    "nav.faq": "FAQ",
    "nav.about": "À propos",
    "nav.blog": "Blog",
    "nav.tripclips": "Trip-Clips",
    "nav.contact": "Contact",
    "cta.book": "Réserver",
    "cta.discover": "Découvrir le camping-car",
    "cta.request": "Envoyer la demande",
    "cta.calc": "Calculer le prix",
    "hero.title": "Ton aventure commence ici.",
    "hero.subtitle": "Loue un camping-car premium en Suisse orientale — remis en mains propres, entretenu avec soin, prêt pour ta route.",
    "hero.availability": "Disponibilité en direct",
    "hero.available": "Prochaine période libre",
    "badge.insured": "Assurance casco incluse",
    "badge.km": "200 km/jour inclus",
    "badge.pets": "Animaux bienvenus",
    "footer.tagline": "Location de camping-cars avec cœur, depuis la Suisse orientale.",
    "chat.title": "Conseiller camping-car",
    "chat.subtitle": "Trouve ton style de voyage en 5 questions",
  },
  it: {
    "nav.home": "Home",
    "nav.vehicles": "Veicoli",
    "nav.booking": "Prenotazione",
    "nav.prices": "Prezzi",
    "nav.insurance": "Assicurazioni",
    "nav.faq": "FAQ",
    "nav.about": "Chi siamo",
    "nav.blog": "Blog",
    "nav.tripclips": "Trip-Clips",
    "nav.contact": "Contatto",
    "cta.book": "Prenota ora",
    "cta.discover": "Scopri il camper",
    "cta.request": "Invia richiesta",
    "cta.calc": "Calcola il prezzo",
    "hero.title": "La tua avventura inizia qui.",
    "hero.subtitle": "Noleggia un camper premium nella Svizzera orientale — consegnato personalmente, curato con amore, pronto per il tuo viaggio.",
    "hero.availability": "Disponibilità live",
    "hero.available": "Prossimo periodo libero",
    "badge.insured": "Casco totale inclusa",
    "badge.km": "200 km/giorno inclusi",
    "badge.pets": "Animali benvenuti",
    "footer.tagline": "Noleggio camper con il cuore, dalla Svizzera orientale.",
    "chat.title": "Consulente camper",
    "chat.subtitle": "Trova il tuo stile di viaggio in 5 domande",
  },
} as const;

type DictKey = keyof (typeof dict)["de"];

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey) => string;
}>({ lang: "de", setLang: () => {}, t: (k) => dict.de[k] });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("de");

  useEffect(() => {
    const saved = localStorage.getItem("tc-lang") as Lang | null;
    if (saved && saved in dict) setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("tc-lang", l);
    document.documentElement.lang = l === "de" ? "de-CH" : l;
  };

  const t = (key: DictKey) => dict[lang][key] ?? dict.de[key];

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
export const languages: { id: Lang; label: string }[] = [
  { id: "de", label: "DE" },
  { id: "en", label: "EN" },
  { id: "fr", label: "FR" },
  { id: "it", label: "IT" },
];
