/** Statische Inhalte: FAQ, Blog, Bewertungen, Kontaktdaten */

export const contact = {
  brand: "Teilzeitcamper",
  legalName: "Teilzeitcamper by Lackwerk Bruderer",
  owner: "David Bruderer",
  street: "Riethüsliweg 5",
  city: "9012 St. Gallen",
  phone: "+41 76 430 83 86",
  email: "info@teilzeitcamper.ch",
  uid: "", // CHE-xxx — eintragen falls MWST-pflichtig
  instagram: "https://instagram.com/teilzeitcamper",
  youtube: "https://youtube.com/@teilzeitcamper",
  tiktok: "https://tiktok.com/@teilzeitcamper",
  mapEmbed:
    "https://www.openstreetmap.org/export/embed.html?bbox=9.355,47.410,9.375,47.425&layer=mapnik&marker=47.4175,9.365",
};

export const faqItems = [
  {
    q: "Welchen Führerschein brauche ich?",
    a: "Der Carado T447 hat ein Gesamtgewicht von 3.5 Tonnen — der normale Führerausweis Kategorie B reicht vollkommen aus. Mindestalter für die Miete: 23 Jahre, mindestens 2 Jahre Fahrpraxis.",
  },
  {
    q: "Wie funktioniert die Übergabe?",
    a: "Wir übergeben das Wohnmobil persönlich in St. Gallen und nehmen uns rund 45 Minuten Zeit: Einweisung in Gas, Wasser, Strom, Heizung, Markise und Fahrverhalten. Du fährst erst los, wenn du dich sicher fühlst — versprochen.",
  },
  {
    q: "Was ist im Mietpreis inbegriffen?",
    a: "Vollkasko-Versicherung (Selbstbehalt CHF 1'000), 200 km pro Tag, Gas, Campingtisch und -stühle, komplette Küchenausstattung, Kaffeemaschine, Veloträger, Markise, Solaranlage sowie WC-Chemie. Endreinigung: CHF 120 pauschal.",
  },
  {
    q: "Sind Haustiere erlaubt?",
    a: "Ja! Dein Hund darf gegen eine Pauschale von CHF 60 (Spezialreinigung) mitreisen. Bitte eigene Decken mitbringen und den Vierbeiner nicht auf die Polster lassen.",
  },
  {
    q: "Wie hoch sind Kaution und Anzahlung?",
    a: "Die Kaution beträgt CHF 1'500 und wird bei der Übergabe hinterlegt (Karte oder Twint). Bei der Buchung wird eine Anzahlung von 30% fällig, der Rest 30 Tage vor Mietbeginn.",
  },
  {
    q: "Kann ich im Winter mieten?",
    a: "Ja, der Camper ist wintertauglich (Truma-Heizung, isolierter Aufbau, beheizter Abwassertank). Mit dem Winterpaket (CHF 80) bekommst du Schneeketten und Isomatten dazu.",
  },
  {
    q: "Was passiert bei einer Panne oder einem Unfall?",
    a: "Du bist über unsere Versicherung mit 24h-Assistance geschützt. Im Handschuhfach findest du die Notfallmappe mit allen Nummern — und uns erreichst du im Notfall jederzeit persönlich.",
  },
  {
    q: "Kann ich die Buchung stornieren?",
    a: "Bis 60 Tage vor Mietbeginn: kostenlos. 59–30 Tage: 30% des Mietpreises. 29–7 Tage: 50%. Danach 80%. Wir empfehlen eine Annullationsversicherung — Details auf der Versicherungsseite.",
  },
  {
    q: "Wo darf ich in der Schweiz übernachten?",
    a: "Auf Campingplätzen und offiziellen Stellplätzen jederzeit. «Wildcampen» ist kantonal geregelt — eine Nacht auf Rastplätzen ist oft toleriert. Unser KI-Berater und der Blog geben dir legale Spots und Routentipps.",
  },
  {
    q: "Wie viele Kilometer sind inklusive?",
    a: "200 km pro Miettag, kumuliert über die ganze Miete. Jeder weitere Kilometer kostet CHF 0.35. Für die klassische Schweiz-Rundreise reicht das locker.",
  },
];

export type BlogPost = {
  slug: string;
  title: string;
  teaser: string;
  date: string;
  readMin: number;
  image: string;
  tags: string[];
  body: string[]; // Absätze
};

export const blogPosts: BlogPost[] = [
  {
    slug: "grand-tour-alpenpaesse",
    title: "Die grosse Alpenpass-Runde: Grimsel, Furka, Gotthard in 5 Tagen",
    teaser: "Drei legendäre Pässe, türkisblaue Stauseen und die schönsten Stellplätze über 1'500 m — unsere Lieblingsroute für den Sommer.",
    date: "2026-06-18",
    readMin: 7,
    image: "/images/fleet/exterior-side-profile.jpg",
    tags: ["Route", "Sommer", "Alpen"],
    body: [
      "Es gibt Routen, die fährt man einmal — und Routen, die fährt man immer wieder. Die grosse Alpenpass-Runde gehört zur zweiten Sorte. Fünf Tage, drei Pässe, unzählige «Wow»-Momente: Das ist die Route, die wir jedem empfehlen, der zum ersten Mal mit dem Wohnmobil in den Alpen unterwegs ist.",
      "Tag 1 führt dich von St. Gallen über Luzern ins Haslital. Übernachte auf dem Camping Aareschlucht in Innertkirchen — ruhig, günstig, perfekter Ausgangspunkt. Tag 2: Der Grimselpass. Fahr früh los (vor 9 Uhr hast du die Kehren fast für dich), halte an der Staumauer des Grimselsees und trink einen Kaffee aus der Bordmaschine mit Blick auf den Gletscher.",
      "Tag 3 ist der Königstag: Furkapass. Die Passhöhe auf 2'429 m erreichst du mit dem T447 problemlos — 140 PS und 6 Gänge reichen entspannt, wenn du die Motorbremse nutzt. Auf der Urner Seite wartet der berühmte Blick auf den Rhonegletscher. Übernachtung: Stellplatz Andermatt Gotthard, mit Bergbahn-Anschluss direkt vor der Tür.",
      "Tag 4 und 5: Über den Gotthard — nimm die alte Tremola-Strasse talwärts, das Kopfsteinpflaster ist ein Erlebnis (langsam fahren!). Im Tessin belohnst du dich mit Gelato in Bellinzona, bevor es über den San Bernardino gemütlich zurück in die Ostschweiz geht.",
      "Praktisch: Rechne mit rund 650 km, also gut innerhalb der inkludierten Kilometer. Gas für Heizung und Kühlschrank ist an Bord, Wasser füllst du auf jedem Campingplatz nach. Beste Reisezeit: Mitte Juni bis Ende September — vorher sind die Pässe teils gesperrt.",
    ],
  },
  {
    slug: "packliste-erste-reise",
    title: "Die perfekte Packliste für deine erste Wohnmobil-Reise",
    teaser: "Was wirklich mit muss, was du getrost zu Hause lässt — und die fünf Dinge, die alle vergessen.",
    date: "2026-05-30",
    readMin: 5,
    image: "/images/fleet/interior-kitchen.jpg",
    tags: ["Tipps", "Einsteiger"],
    body: [
      "Die gute Nachricht zuerst: Im Teilzeitcamper ist schon fast alles drin. Geschirr, Pfannen, Besteck, Kaffeemaschine, Campingmöbel, Auffahrkeile, Stromkabel — alles an Bord. Du packst also nur noch dein persönliches Gepäck. Und da gilt: weniger ist mehr.",
      "Kleidung im Zwiebelprinzip: In den Bergen kann es auch im Juli 8 Grad kalt werden. Pack pro Person eine warme Schicht mehr ein, als du denkst — aber insgesamt weniger Outfits. Nach drei Tagen Camping trägt sowieso jeder dasselbe Lieblings-Hoodie.",
      "Die fünf Dinge, die alle vergessen: 1. Stirnlampe (Hände frei beim nächtlichen Weg übers Zeltplatzgelände), 2. Badeschlappen für die Sanitärgebäude, 3. eine lange Handyladekabel-Variante, 4. Wäscheleine mit Klammern, 5. das Lieblingsgewürz — Salz und Pfeffer sind an Bord, dein Za'atar nicht.",
      "Lebensmittel: Kauf nicht alles vorher ein! Der 142-Liter-Kühlschrank fasst viel, aber der halbe Spass ist der Einkauf im Dorfladen unterwegs. Starte mit dem Frühstück für zwei Tage und den Zutaten für ein Znacht — den Rest findest du unterwegs.",
      "Und schliesslich: Bettwäsche kannst du bei uns für CHF 35 pro Person dazubuchen — frisch bezogen bei Übergabe. Ein Handgriff weniger, und du startest direkt ins Abenteuer.",
    ],
  },
  {
    slug: "herbst-graubuenden",
    title: "Goldener Herbst in Graubünden: Die Lärchen-Route",
    teaser: "Wenn das Engadin golden leuchtet: Stellplätze, Wanderungen und Bündner Spezialitäten für die schönste Nebensaison-Reise.",
    date: "2026-04-12",
    readMin: 6,
    image: "/images/fleet/exterior-rear-quarter.jpg",
    tags: ["Route", "Herbst", "Graubünden"],
    body: [
      "Der Oktober ist unser Geheimtipp-Monat: Zwischensaison-Preise, leere Strassen, und das Engadin verwandelt sich in ein goldenes Meer aus Lärchen. Diese Route führt dich in vier bis sechs Tagen durch die schönsten Ecken Graubündens.",
      "Start über die Via Mala und den Julierpass nach Silvaplana. Der TCS-Campingplatz direkt am See ist im Herbst herrlich ruhig — und morgens spiegeln sich die verschneiten Gipfel im Wasser, während die Lärchen am Ufer leuchten.",
      "Das Highlight: die Wanderung von Muottas Muragl Richtung Alp Languard (Panoramaweg, 2.5 h). Vom Stellplatz Punt Muragl bringt dich die Standseilbahn hoch. Danach: Nusstorte in Pontresina, natürlich.",
      "Weiter durchs Val Müstair oder über den Ofenpass in den Schweizerischen Nationalpark. Im Herbst röhren hier die Hirsche — mit etwas Glück hörst du sie abends direkt vom Camper aus. Der Stellplatz in Zernez ist der perfekte Ausgangspunkt.",
      "Rückweg über die Lenzerheide mit Zwischenhalt in Chur: Die Altstadt ist die älteste der Schweiz und einen Bummel wert. Insgesamt rund 400 km — gemütlich, günstig, golden. Herbst-Camping at its best.",
    ],
  },
];

/**
 * Bewertungen — PLATZHALTER im Stil echter Gästestimmen.
 * TODO vor Launch: durch echte Google-Reviews ersetzen
 * (Google Business Profil verknüpfen, siehe README «Google Reviews»).
 */
export const reviews = [
  {
    name: "Sandra & Marc K.",
    location: "Winterthur",
    stars: 5,
    date: "August 2025",
    text: "Übergabe mega herzlich und geduldig erklärt — wir waren zum ersten Mal mit einem Wohnmobil unterwegs und haben uns ab Minute eins sicher gefühlt. Der Camper war blitzsauber und riecht nicht mal nach Camper!",
  },
  {
    name: "Familie Steiner",
    location: "Zürich",
    stars: 5,
    date: "Juli 2025",
    text: "Zwei Wochen Südfrankreich mit zwei Kindern — das Hubbett ist Gold wert. Die Kids wollten gar nicht mehr raus. Kommunikation vor der Reise schnell und unkompliziert. Jederzeit wieder!",
  },
  {
    name: "Reto B.",
    location: "St. Gallen",
    stars: 5,
    date: "Oktober 2025",
    text: "Herbstferien im Engadin. Heizung top, Betten bequemer als zu Hause (ehrlich!). Man merkt, dass hier jemand mit Liebe vermietet und nicht eine anonyme Flotte verwaltet.",
  },
  {
    name: "Céline M.",
    location: "Bern",
    stars: 5,
    date: "Juni 2025",
    text: "Der Preisrechner auf der Website stimmt auf den Franken, keine versteckten Kosten. Velos auf den Träger, los gings. Absolute Empfehlung für alle, die es persönlich mögen.",
  },
  {
    name: "Thomas & Anja W.",
    location: "Konstanz (DE)",
    stars: 5,
    date: "September 2025",
    text: "Wir mieten seit Jahren Wohnmobile — selten war eines so gepflegt. Solaranlage hat uns drei Tage autark am Comersee gehalten. Danke für die Restauranttipps!",
  },
];

export const stats = [
  { value: 4.9, suffix: "★", label: "Durchschnittsbewertung" },
  { value: 120, suffix: "+", label: "Reisen ermöglicht" },
  { value: 38, suffix: "'000 km", label: "Abenteuer gefahren" },
  { value: 100, suffix: "%", label: "Herzblut" },
];
