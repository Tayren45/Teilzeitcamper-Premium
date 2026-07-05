/**
 * Fahrzeugdaten — Carado T447 (Teilintegriert, Fiat Ducato)
 *
 * HINWEIS: Masse/Gewichte vor Launch mit dem Fahrzeugausweis abgleichen.
 * Bilder liegen unter /public/images/fleet/ (echte Fotos des Fahrzeugs).
 */

export type GalleryImage = {
  src: string;
  alt: string;
  category: "aussen" | "innen" | "details";
  w: number; // Seitenverhältnis-Hinweis: 4:3 quer oder 3:4 hoch
  h: number;
};

export const vehicle = {
  slug: "carado-t447",
  name: "Carado T447",
  claim: "Teilintegriertes Wohnmobil mit Einzelbetten & Hubbett",
  basis: "Fiat Ducato 2.3 MultiJet",
  year: 2023,
  seats: 4,
  sleeps: 4,
  license: "Führerausweis Kat. B (bis 3.5 t)",
  hero: "/images/fleet/hero-front-quarter.jpg",
  card: "/images/fleet/exterior-side-profile.jpg",
  specs: [
    { label: "Länge", value: "7.36 m" },
    { label: "Breite", value: "2.32 m" },
    { label: "Höhe", value: "2.95 m" },
    { label: "Gesamtgewicht", value: "3'500 kg (Kat. B)" },
    { label: "Motor", value: "2.3 MultiJet Diesel, 140 PS" },
    { label: "Getriebe", value: "6-Gang manuell" },
    { label: "Verbrauch", value: "ca. 10–11 l / 100 km" },
    { label: "Frischwasser", value: "122 l" },
    { label: "Abwasser", value: "92 l" },
    { label: "Kühlschrank", value: "142 l mit Gefrierfach" },
    { label: "Sitzplätze (Fahrt)", value: "4 mit Gurt" },
    { label: "Schlafplätze", value: "4 (2 Einzelbetten + Hubbett)" },
  ],
  layout: [
    "Zwei Längs-Einzelbetten im Heck (zusammenlegbar zur Liegewiese)",
    "Elektrisches Hubbett über der Sitzgruppe für 2 Personen",
    "Halbdinette mit drehbaren Pilotensitzen",
    "Kompaktbad mit separater Duschkabine, WC & Waschbecken",
    "Küchenzeile mit 3-Flamm-Kocher, Spüle & Apothekerauszug",
    "Grosse Heckgarage — Platz für Velos, Stühle & Gepäck",
  ],
  included: [
    { icon: "🛡️", title: "Vollkasko-Versicherung", desc: "Selbstbehalt CHF 1'000, Innenraum versichert" },
    { icon: "🛣️", title: "200 km pro Tag inklusive", desc: "Weitere Kilometer CHF 0.35/km" },
    { icon: "☀️", title: "Solaranlage", desc: "Autark unterwegs — Batterie lädt beim Stehen" },
    { icon: "⛱️", title: "Markise", desc: "Grosse Seitenmarkise für schattige Stunden" },
    { icon: "🚲", title: "Thule-Veloträger", desc: "Für bis zu 4 Velos, hinten montiert" },
    { icon: "☕", title: "Kaffeemaschine", desc: "Frischer Kaffee auch am Bergsee" },
    { icon: "🍳", title: "Küche komplett", desc: "Geschirr, Pfannen, Besteck für 4 Personen" },
    { icon: "🪑", title: "Campingmöbel", desc: "Tisch + 4 Stühle in der Heckgarage" },
    { icon: "🔥", title: "Gas & Betriebsmittel", desc: "2 Gasflaschen, Auffahrkeile, Kabelrolle, WC-Chemie" },
  ],
  extras: [
    { id: "bedding", name: "Bettwäsche & Frottier", price: 35, unit: "pro Person", desc: "Duvet, Kissen, Fixleintuch, Badetücher" },
    { id: "grill", name: "Gasgrill", price: 40, unit: "pro Miete", desc: "Kompakter Gasgrill inkl. Kartusche" },
    { id: "wifi", name: "Mobiles WLAN", price: 8, unit: "pro Nacht", desc: "4G/5G-Hotspot mit 50 GB Daten" },
    { id: "pet", name: "Haustier", price: 60, unit: "pro Miete", desc: "Dein Hund reist mit (inkl. Spezialreinigung)" },
    { id: "winter", name: "Winterpaket", price: 80, unit: "pro Miete", desc: "Schneeketten, Isomatten, Abwasser-Frostschutz" },
  ],
  gallery: [
    // Aussen
    { src: "/images/fleet/hero-front-quarter.jpg", alt: "Carado T447 Frontansicht auf offener Strasse", category: "aussen", w: 4, h: 3 },
    { src: "/images/fleet/exterior-side-profile.jpg", alt: "Seitenprofil des Carado T447 vor Alpenpanorama", category: "aussen", w: 4, h: 3 },
    { src: "/images/fleet/exterior-front.jpg", alt: "Frontansicht Fiat Ducato Basisfahrzeug", category: "aussen", w: 4, h: 3 },
    { src: "/images/fleet/exterior-front-quarter-2.jpg", alt: "Dreiviertel-Frontansicht des Wohnmobils", category: "aussen", w: 4, h: 3 },
    { src: "/images/fleet/exterior-side-awning.jpg", alt: "Seitenansicht mit Markise", category: "aussen", w: 4, h: 3 },
    { src: "/images/fleet/exterior-rear.jpg", alt: "Heckansicht mit Thule-Veloträger", category: "aussen", w: 4, h: 3 },
    { src: "/images/fleet/exterior-rear-quarter.jpg", alt: "Heck-Seitenansicht auf Landstrasse", category: "aussen", w: 4, h: 3 },
    { src: "/images/fleet/exterior-rear-side.jpg", alt: "Heckpartie mit Veloträger, Seitenperspektive", category: "aussen", w: 4, h: 3 },
    { src: "/images/fleet/exterior-side-street.jpg", alt: "Volles Seitenprofil des Carado T447", category: "aussen", w: 4, h: 3 },
    { src: "/images/fleet/exterior-front-home.jpg", alt: "Frontansicht mit Panoramadach", category: "aussen", w: 4, h: 3 },
    { src: "/images/fleet/exterior-rear-home.jpg", alt: "Heckansicht mit Fahrradträger", category: "aussen", w: 4, h: 3 },
    { src: "/images/fleet/exterior-entry-door.jpg", alt: "Aufbautür mit elektrischer Trittstufe", category: "aussen", w: 3, h: 4 },
    { src: "/images/fleet/exterior-entry-open.jpg", alt: "Offene Aufbautür mit Blick in den Wohnraum", category: "aussen", w: 4, h: 3 },
    { src: "/images/fleet/exterior-garage-bike.jpg", alt: "Heckgarage mit Platz für Velos und Campingmöbel", category: "aussen", w: 3, h: 4 },
    // Innen
    { src: "/images/fleet/interior-overview.jpg", alt: "Wohnraum mit Halbdinette und drehbaren Pilotensitzen", category: "innen", w: 4, h: 3 },
    { src: "/images/fleet/interior-kitchen.jpg", alt: "Küche mit 3-Flamm-Kocher und Spüle", category: "innen", w: 3, h: 4 },
    { src: "/images/fleet/interior-fridge.jpg", alt: "142-Liter-Kühlschrank mit Gefrierfach", category: "innen", w: 3, h: 4 },
    { src: "/images/fleet/interior-beds.jpg", alt: "Einzelbetten im Heck mit Mittelaufstieg", category: "innen", w: 4, h: 3 },
    { src: "/images/fleet/interior-beds-made.jpg", alt: "Frisch bezogene Einzelbetten", category: "innen", w: 4, h: 3 },
    { src: "/images/fleet/interior-bedroom-window.jpg", alt: "Schlafzimmerfenster mit Verdunkelung", category: "innen", w: 4, h: 3 },
    { src: "/images/fleet/interior-bedroom-skylight.jpg", alt: "Schlafbereich mit Dachfenster und Stauschränken", category: "innen", w: 4, h: 3 },
    { src: "/images/fleet/interior-dropdown-bed.jpg", alt: "Hubbett über der Sitzgruppe", category: "innen", w: 3, h: 4 },
    { src: "/images/fleet/interior-bathroom.jpg", alt: "Bad mit WC, Waschbecken und Spiegelschrank", category: "innen", w: 3, h: 4 },
    { src: "/images/fleet/interior-shower.jpg", alt: "Separate Duschkabine", category: "innen", w: 3, h: 4 },
    { src: "/images/fleet/interior-cockpit.jpg", alt: "Cockpit des Fiat Ducato", category: "innen", w: 4, h: 3 },
    { src: "/images/fleet/interior-seat-bench.jpg", alt: "Sitzbank der Halbdinette", category: "innen", w: 3, h: 4 },
    // Details
    { src: "/images/fleet/exterior-awning-detail.jpg", alt: "Markise und Aufbaudetail", category: "details", w: 4, h: 3 },
    { src: "/images/fleet/interior-skylight.jpg", alt: "Panorama-Dachfenster", category: "details", w: 4, h: 3 },
    { src: "/images/fleet/interior-skylight-lockers.jpg", alt: "Dachfenster und Hängeschränke", category: "details", w: 4, h: 3 },
    { src: "/images/fleet/interior-locker.jpg", alt: "Geräumiger Hängeschrank", category: "details", w: 4, h: 3 },
    { src: "/images/fleet/interior-bed-storage.jpg", alt: "Stauraum unter dem Bett mit Leiter", category: "details", w: 3, h: 4 },
    { src: "/images/fleet/interior-storage-ladder.jpg", alt: "Stauklappe mit Hubbett-Leiter", category: "details", w: 3, h: 4 },
    { src: "/images/fleet/exterior-garage-door.jpg", alt: "Serviceklappe der Heckgarage", category: "details", w: 3, h: 4 },
    { src: "/images/fleet/exterior-water-hatch.jpg", alt: "Frischwasser-Einfüllstutzen", category: "details", w: 3, h: 4 },
    { src: "/images/fleet/exterior-service-hatch.jpg", alt: "Entsorgungsklappe", category: "details", w: 4, h: 3 },
    { src: "/images/fleet/exterior-front-detail.jpg", alt: "Front mit grossem Aussenspiegel", category: "details", w: 4, h: 3 },
  ] as GalleryImage[],
  /** Frames für die interaktive Rundum-Ansicht (Drag = ums Fahrzeug gehen) */
  view360: [
    "/images/fleet/exterior-front.jpg",
    "/images/fleet/hero-front-quarter.jpg",
    "/images/fleet/exterior-side-profile.jpg",
    "/images/fleet/exterior-side-awning.jpg",
    "/images/fleet/exterior-rear-quarter.jpg",
    "/images/fleet/exterior-rear.jpg",
    "/images/fleet/exterior-rear-side.jpg",
    "/images/fleet/exterior-side-street.jpg",
    "/images/fleet/exterior-front-home.jpg",
  ],
};

export type Vehicle = typeof vehicle;
