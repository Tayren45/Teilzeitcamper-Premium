"use client";

/**
 * Verfügbarkeits-Kalender mit Bereichsauswahl.
 * Belegte Tage kommen live aus /api/bookings.
 */

import { useEffect, useMemo, useState } from "react";
import { isDayBooked, toISO, type BookedRange } from "@/lib/bookings";

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

type Props = {
  value: { start: string | null; end: string | null };
  onChange: (v: { start: string | null; end: string | null }) => void;
};

export default function AvailabilityCalendar({ value, onChange }: Props) {
  const today = useMemo(() => new Date(), []);
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [ranges, setRanges] = useState<BookedRange[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((d) => setRanges(d.ranges ?? []))
      .catch(() => setRanges([]))
      .finally(() => setLoaded(true));
  }, []);

  const days = useMemo(() => {
    const first = new Date(month);
    const startOffset = (first.getDay() + 6) % 7; // Montag = 0
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const cells: (string | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(toISO(new Date(month.getFullYear(), month.getMonth(), d)));
    }
    return cells;
  }, [month]);

  const todayISO = toISO(today);

  function classify(day: string) {
    const booked = isDayBooked(day, ranges);
    const past = day < todayISO;
    const selected =
      value.start && value.end
        ? day >= value.start && day <= value.end
        : value.start === day;
    const isEdge = day === value.start || day === value.end;
    return { booked, past, selected, isEdge };
  }

  function pick(day: string) {
    const { booked, past } = classify(day);
    if (booked || past) return;
    if (!value.start || (value.start && value.end)) {
      onChange({ start: day, end: null });
    } else if (day > value.start) {
      // keine belegten Tage im gewählten Bereich zulassen
      let cursor = value.start;
      const c = new Date(value.start + "T12:00:00");
      let blocked = false;
      while (cursor < day) {
        c.setDate(c.getDate() + 1);
        cursor = toISO(c);
        if (isDayBooked(cursor, ranges)) { blocked = true; break; }
      }
      if (blocked) onChange({ start: day, end: null });
      else onChange({ start: value.start, end: day });
    } else {
      onChange({ start: day, end: null });
    }
  }

  const canGoBack = month > new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <div className="select-none">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => canGoBack && setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          disabled={!canGoBack}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-pine-100 disabled:opacity-30 dark:hover:bg-pine-900"
          aria-label="Vorheriger Monat"
        >←</button>
        <p className="font-semibold">{MONTHS[month.getMonth()]} {month.getFullYear()}</p>
        <button
          type="button"
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-pine-100 dark:hover:bg-pine-900"
          aria-label="Nächster Monat"
        >→</button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-pine-500 dark:text-pine-300">
        {WEEKDAYS.map((w) => <div key={w} className="py-1">{w}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (!day) return <div key={`x-${i}`} />;
          const { booked, past, selected, isEdge } = classify(day);
          const num = Number(day.slice(-2));
          return (
            <button
              type="button"
              key={day}
              onClick={() => pick(day)}
              disabled={booked || past}
              aria-label={`${day}${booked ? " — belegt" : ""}`}
              className={[
                "relative aspect-square rounded-xl text-sm font-medium transition-all duration-200",
                past ? "text-pine-300 dark:text-pine-800" : "",
                booked && !past
                  ? "cursor-not-allowed bg-terra-100 text-terra-400 line-through dark:bg-terra-600/15"
                  : "",
                !booked && !past && !selected ? "hover:scale-105 hover:bg-pine-100 dark:hover:bg-pine-900" : "",
                selected && !isEdge ? "bg-pine-200 text-pine-900 dark:bg-pine-800 dark:text-sand-50" : "",
                isEdge ? "bg-pine-800 text-white shadow-soft dark:bg-pine-500" : "",
              ].join(" ")}
            >
              {num}
              {day === todayISO && <span className="absolute inset-x-0 bottom-1 mx-auto h-1 w-1 rounded-full bg-terra-500" />}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-pine-600 dark:text-pine-300">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-pine-800 dark:bg-pine-500" /> Auswahl</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-terra-100 dark:bg-terra-600/20" /> Belegt</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border border-pine-300 dark:border-pine-700" /> Frei</span>
        {!loaded && <span className="italic">Lade Verfügbarkeit…</span>}
      </div>
    </div>
  );
}
