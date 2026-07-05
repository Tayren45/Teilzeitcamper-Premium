"use client";

/**
 * KI-Camper-Berater («Lucy»): geführter Beratungs-Chat.
 * Fragt Personenzahl, Budget, Reiseziel, Jahreszeit & Erfahrung ab und
 * erstellt Empfehlung, Routenvorschlag, Packliste und Campingtipps.
 *
 * Läuft komplett lokal (regelbasiert, keine API-Kosten). Upgrade auf die
 * Claude-API für freie Konversation: siehe README «KI-Chat».
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

type Msg = { from: "bot" | "user"; text: string };
type StepId = "persons" | "budget" | "destination" | "season" | "experience" | "done";

type Answers = {
  persons?: string;
  budget?: string;
  destination?: string;
  season?: string;
  experience?: string;
};

const steps: {
  id: StepId;
  question: string;
  options: string[];
}[] = [
  { id: "persons", question: "Hallo! Ich bin Lucy, deine Camper-Beraterin. 👋 Ich stelle dir 5 kurze Fragen und plane dann deine Reise. Mit wie vielen Personen reist du?", options: ["1–2 Personen", "3 Personen", "4 Personen", "Mehr als 4"] },
  { id: "budget", question: "Wie sieht dein Budget pro Nacht aus (ohne Campingplatz)?", options: ["Bis CHF 150", "CHF 150–200", "Über CHF 200", "Egal — Hauptsache schön"] },
  { id: "destination", question: "Wohin zieht es dich?", options: ["Schweizer Alpen", "Südeuropa / Meer", "Skandinavien", "Noch offen"] },
  { id: "season", question: "In welcher Jahreszeit möchtest du reisen?", options: ["Frühling", "Sommer", "Herbst", "Winter"] },
  { id: "experience", question: "Wie viel Camping-Erfahrung bringst du mit?", options: ["Erste Reise überhaupt", "Schon mal gezeltet", "Wohnmobil-Profi"] },
];

function buildRecommendation(a: Answers): string[] {
  const out: string[] = [];

  // Fahrzeug-Empfehlung
  if (a.persons === "Mehr als 4") {
    out.push("Ehrlich gesagt: Für mehr als 4 Personen ist unser Carado T447 zu klein — er hat genau 4 Gurt- und Schlafplätze. Schreib uns trotzdem — wir kennen befreundete Vermieter in der Region und helfen dir weiter. 🤝");
    return out;
  }
  out.push(
    a.persons === "1–2 Personen"
      ? "Perfekt: Im Carado T447 habt ihr zu zweit fast schon dekadent viel Platz — Einzelbetten im Heck (zusammenlegbar!), separates Bad und eine Garage fürs ganze Spielzeug. 🚐"
      : "Der Carado T447 ist wie gemacht für euch: 4 Gurtplätze, 2 Einzelbetten im Heck plus elektrisches Hubbett — abends muss niemand umbauen. 🚐"
  );

  // Budget
  if (a.budget === "Bis CHF 150")
    out.push("💡 Budget-Tipp: In der Nebensaison (Nov–März) kostet die Nacht CHF 145 — und mit dem Code FRUEHBUCHER10 sparst du nochmal 10%, wenn du früh dran bist.");
  else if (a.budget === "CHF 150–200")
    out.push("💡 In der Zwischensaison (April, Mai, Oktober) liegst du mit CHF 175/Nacht genau in deinem Budget — und die Plätze sind halb leer.");
  else out.push("💡 Dann empfehle ich die Hauptsaison im Juni: Hochsommer-Feeling, aber die Schulferien-Preise auf den Campingplätzen starten erst im Juli.");

  // Ziel + Saison → Route
  const d = a.destination;
  const s = a.season;
  if (d === "Schweizer Alpen") {
    out.push(
      s === "Winter"
        ? "🗺️ Routen-Idee: Wintercamping im Berner Oberland — Camping Jungfrau (Lauterbrunnen) als Basis, Skifahren in Wengen, Schlitteln ab Männlichen. Buch das Winterpaket dazu (Schneeketten sind dann Pflichtausrüstung)."
        : "🗺️ Routen-Idee: Die grosse Alpenpass-Runde — Grimsel, Furka, Gotthard in 5 Tagen. Die komplette Route mit Stellplätzen findest du in unserem Blog («Grand Tour Alpenpässe»)."
    );
  } else if (d === "Südeuropa / Meer") {
    out.push(
      s === "Sommer"
        ? "🗺️ Routen-Idee: Über den San Bernardino ans Mittelmeer — 3 Tage Comersee, dann Cinque Terre (Stellplatz in Levanto, mit dem Zug in die Dörfer). Im Juli/August unbedingt Plätze vorreservieren!"
        : "🗺️ Routen-Idee: Südfrankreich in der Nebensaison — Camargue, Gorges du Verdon, Lavendelfelder (Juni) oder Weinlese (September). Leere Strassen, warme Abende, halbe Preise."
    );
  } else if (d === "Skandinavien") {
    out.push("🗺️ Routen-Idee: 14+ Tage einplanen! Fähre Kiel–Göteborg, dann die schwedische Westküste hoch. Dank Jedermannsrecht darfst du fast überall frei stehen — die Solaranlage des T447 macht dich tagelang autark. ⚡");
  } else {
    out.push("🗺️ Noch offen? Mein Favorit für Unentschlossene: 1 Woche Jura & Drei-Seen-Land — nah, unterschätzt, wunderschön. Details gibt's bei der Übergabe von David persönlich.");
  }

  // Erfahrung
  if (a.experience === "Erste Reise überhaupt")
    out.push("🎒 Da es deine erste Reise ist: Wir nehmen uns bei der Übergabe 45 Minuten Zeit für alles (Gas, Wasser, Fahren, Markise). Und lies unsere Packliste im Blog — da steht, was wirklich mit muss (Spoiler: weniger als du denkst).");
  else if (a.experience === "Schon mal gezeltet")
    out.push("🎒 Als Zelt-Umsteiger wirst du grinsen: echtes Bett, eigene Dusche, 142-l-Kühlschrank. Deine Campingkocher-Skills brauchst du trotzdem — der 3-Flamm-Kocher wartet.");
  else out.push("🎒 Als Profi kennst du das Spiel — beim T447 wichtig: 2.95 m Höhe (Parkhäuser!), Gasflaschen sind Schweizer Norm, Entsorgung klassisch über Bodenauslass.");

  // Packliste kompakt
  out.push(
    s === "Winter"
      ? "📦 Mini-Packliste Winter: Thermounterwäsche, Hüttenschuhe, Stirnlampe, Schlitten 😉. Bettwäsche, Küche, Campingmöbel sind an Bord — Winterpaket buchen nicht vergessen."
      : "📦 Mini-Packliste: Stirnlampe, Badeschlappen, Wäscheleine, Lieblingsgewürz, Powerbank. Der Rest (Küche, Möbel, Kaffee!) ist schon eingebaut."
  );

  out.push("Wenn du magst, prüfe gleich die Live-Verfügbarkeit — der Kalender zeigt dir freie Zeiträume in Echtzeit. Gute Reise! 🏔️");
  return out;
}

export default function KIChat() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [typing, setTyping] = useState(false);
  const [done, setDone] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Erste Frage beim Öffnen
  useEffect(() => {
    if (open && msgs.length === 0) {
      setTyping(true);
      const id = setTimeout(() => {
        setMsgs([{ from: "bot", text: steps[0].question }]);
        setTyping(false);
      }, 700);
      return () => clearTimeout(id);
    }
  }, [open, msgs.length]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  function answer(option: string) {
    const step = steps[stepIdx];
    const nextAnswers = { ...answers, [step.id]: option };
    setAnswers(nextAnswers);
    setMsgs((m) => [...m, { from: "user", text: option }]);
    setTyping(true);

    setTimeout(() => {
      if (stepIdx + 1 < steps.length) {
        setMsgs((m) => [...m, { from: "bot", text: steps[stepIdx + 1].question }]);
        setStepIdx(stepIdx + 1);
        setTyping(false);
      } else {
        // Empfehlung nacheinander „eintippen"
        const rec = buildRecommendation(nextAnswers);
        rec.forEach((text, i) => {
          setTimeout(() => {
            setMsgs((m) => [...m, { from: "bot", text }]);
            if (i === rec.length - 1) {
              setTyping(false);
              setDone(true);
            }
          }, 900 * (i + 1));
        });
        setStepIdx(stepIdx + 1);
      }
    }, 800);
  }

  function reset() {
    setMsgs([]);
    setAnswers({});
    setStepIdx(0);
    setDone(false);
  }

  const currentOptions = !done && stepIdx < steps.length && msgs.length > 0 && !typing
    ? steps[stepIdx].options
    : [];

  return (
    <>
      {/* Schwebender Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 18 }}
        onClick={() => setOpen(!open)}
        aria-label={open ? "Berater schliessen" : "KI-Camper-Berater öffnen"}
        className="fixed bottom-5 right-5 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-terra-500 text-2xl text-white shadow-lift transition-transform hover:scale-110 active:scale-95"
      >
        {open ? "✕" : "💬"}
        {!open && (
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="absolute h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative h-3.5 w-3.5 rounded-full border-2 border-white bg-green-400" />
          </span>
        )}
      </motion.button>

      {/* Chat-Fenster */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-label="KI-Camper-Berater"
            className="fixed bottom-24 right-5 z-[80] flex max-h-[70vh] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-3xl glass-strong shadow-lift"
          >
            <div className="flex items-center gap-3 border-b border-pine-200/50 px-5 py-4 dark:border-pine-800/50">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pine-800 text-lg dark:bg-pine-500">🤖</span>
              <div className="flex-1">
                <p className="font-display font-semibold leading-tight">{t("chat.title")} Lucy</p>
                <p className="text-xs text-pine-600 dark:text-pine-300">{t("chat.subtitle")}</p>
              </div>
              {msgs.length > 1 && (
                <button onClick={reset} className="text-xs font-semibold text-terra-500 hover:underline">
                  Neu starten
                </button>
              )}
            </div>

            <div ref={bodyRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {msgs.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.from === "bot"
                      ? "bg-pine-100 dark:bg-pine-900"
                      : "ml-auto bg-pine-800 text-white dark:bg-pine-500"
                  }`}
                >
                  {m.text}
                </motion.div>
              ))}
              {typing && (
                <div className="flex w-16 items-center gap-1 rounded-2xl bg-pine-100 px-4 py-3 dark:bg-pine-900" aria-label="Lucy tippt">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.1, delay: i * 0.2 }}
                      className="h-1.5 w-1.5 rounded-full bg-pine-500"
                    />
                  ))}
                </div>
              )}
              {done && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-1">
                  <Link href="/buchung" className="btn-primary w-full !bg-terra-500 text-sm hover:!bg-terra-400">
                    Verfügbarkeit prüfen →
                  </Link>
                </motion.div>
              )}
            </div>

            {currentOptions.length > 0 && (
              <div className="flex flex-wrap gap-2 border-t border-pine-200/50 px-4 py-3.5 dark:border-pine-800/50">
                {currentOptions.map((o) => (
                  <button
                    key={o}
                    onClick={() => answer(o)}
                    className="rounded-full border border-pine-300 px-3.5 py-1.5 text-sm font-medium transition-all hover:border-terra-500 hover:text-terra-500 active:scale-95 dark:border-pine-700"
                  >
                    {o}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
