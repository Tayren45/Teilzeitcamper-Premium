"use client";

/**
 * Admin-Bereich (Demo-Login, Key: ADMIN_KEY / Standard «teilzeit-admin»).
 * Buchungen, Trip-Clips, Kontaktanfragen und Zugangscodes verwalten.
 */

import { useEffect, useMemo, useState } from "react";
import { chf } from "@/lib/pricing";
import { fmtDate, type Booking } from "@/lib/bookings";
import { vehicle } from "@/lib/vehicle";
import type { TripClip, AccessCode } from "@/lib/trip-clips";
import type { ContactMessage } from "@/lib/messages";

type Tab = "bookings" | "clips" | "messages" | "codes";

const statusStyle: Record<Booking["status"], string> = {
  angefragt: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  bestätigt: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  storniert: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

const tabs: { id: Tab; label: string }[] = [
  { id: "bookings", label: "Buchungen" },
  { id: "clips", label: "Trip-Clips" },
  { id: "messages", label: "Nachrichten" },
  { id: "codes", label: "Zugangscodes" },
];

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [clips, setClips] = useState<TripClip[]>([]);
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [newCode, setNewCode] = useState("");
  const [newCodeLabel, setNewCodeLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const headers = (adminKey: string) => ({ "x-admin-key": adminKey });

  async function loadBookings(adminKey: string) {
    const res = await fetch("/api/bookings", { headers: headers(adminKey) });
    const data = await res.json();
    if (!data.bookings) throw new Error("Falscher Admin-Schlüssel.");
    setBookings(data.bookings);
  }

  async function loadClips(adminKey: string) {
    const res = await fetch("/api/trip-clips", { headers: headers(adminKey) });
    const data = await res.json();
    setClips(data.clips ?? []);
    setCodes(data.codes ?? []);
  }

  async function loadMessages(adminKey: string) {
    const res = await fetch("/api/contact", { headers: headers(adminKey) });
    const data = await res.json();
    setMessages(data.messages ?? []);
  }

  async function load(adminKey: string) {
    setLoading(true);
    setError(null);
    try {
      await loadBookings(adminKey);
      setAuthed(true);
      sessionStorage.setItem("tc-admin-key", adminKey);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const saved = sessionStorage.getItem("tc-admin-key");
    if (saved) {
      setKey(saved);
      load(saved);
    }
  }, []);

  useEffect(() => {
    if (!authed || !key) return;
    if (tab === "clips" || tab === "codes") loadClips(key);
    if (tab === "messages") loadMessages(key);
  }, [tab, authed, key]);

  async function setStatus(id: string, status: Booking["status"]) {
    await fetch("/api/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...headers(key) },
      body: JSON.stringify({ id, status }),
    });
    loadBookings(key);
  }

  async function toggleClip(id: string, approved: boolean) {
    await fetch("/api/trip-clips", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...headers(key) },
      body: JSON.stringify({ clipId: id, approved }),
    });
    loadClips(key);
  }

  async function deleteClip(id: string) {
    await fetch(`/api/trip-clips?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: headers(key),
    });
    loadClips(key);
  }

  async function addCode(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/trip-clips", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...headers(key) },
      body: JSON.stringify({ action: "addCode", code: newCode, label: newCodeLabel }),
    });
    setNewCode("");
    setNewCodeLabel("");
    loadClips(key);
  }

  async function toggleCode(code: string, active: boolean) {
    await fetch("/api/trip-clips", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...headers(key) },
      body: JSON.stringify({ action: "toggleCode", code, active }),
    });
    loadClips(key);
  }

  async function markRead(id: string) {
    await fetch("/api/contact", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...headers(key) },
      body: JSON.stringify({ id, read: true }),
    });
    loadMessages(key);
  }

  const stats = useMemo(() => {
    const active = bookings.filter((b) => b.status !== "storniert");
    const year = new Date().getFullYear();
    const nightsBooked = active.reduce((acc, b) => {
      const s = new Date(b.start), e = new Date(b.end);
      if (s.getFullYear() !== year && e.getFullYear() !== year) return acc;
      return acc + Math.round((e.getTime() - s.getTime()) / 86_400_000);
    }, 0);
    return {
      revenue: active.reduce((a, b) => a + b.total, 0),
      open: bookings.filter((b) => b.status === "angefragt").length,
      confirmed: bookings.filter((b) => b.status === "bestätigt").length,
      occupancy: Math.min(100, Math.round((nightsBooked / 365) * 100)),
      unread: messages.filter((m) => !m.read).length,
      clipCount: clips.filter((c) => c.type !== "demo").length,
    };
  }, [bookings, messages, clips]);

  if (!authed) {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 pt-24">
        <div className="glass-strong rounded-3xl p-8 shadow-lift">
          <h1 className="font-display text-2xl font-semibold">Admin-Bereich</h1>
          <p className="mt-1 text-sm text-pine-600 dark:text-pine-300">Nur für {vehicle.name}-Besitzer 😉</p>
          <form onSubmit={(e) => { e.preventDefault(); load(key); }} className="mt-6 space-y-4">
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Admin-Schlüssel"
              autoFocus
              className="w-full rounded-xl border border-pine-200 bg-white/70 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-pine-500 dark:border-pine-800 dark:bg-night-800"
            />
            {error && <p className="text-sm font-semibold text-terra-500">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? "Prüfe…" : "Anmelden"}
            </button>
            <p className="text-center text-xs text-pine-400">
              Demo-Schlüssel: <code className="font-mono">teilzeit-admin</code>
            </p>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
          <p className="text-sm text-pine-600 dark:text-pine-300">{vehicle.name} · Teilzeitcamper Admin</p>
        </div>
        <button
          onClick={() => { sessionStorage.removeItem("tc-admin-key"); setAuthed(false); }}
          className="btn-secondary border border-pine-300 text-sm dark:border-pine-700"
        >
          Abmelden
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t.id ? "bg-pine-800 text-white dark:bg-pine-500" : "glass hover:text-terra-500"
            }`}
          >
            {t.label}
            {t.id === "messages" && stats.unread > 0 && (
              <span className="ml-1.5 rounded-full bg-terra-500 px-1.5 text-xs text-white">{stats.unread}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "bookings" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Umsatz (aktiv)", value: chf(stats.revenue) },
              { label: "Offene Anfragen", value: String(stats.open) },
              { label: "Bestätigte Buchungen", value: String(stats.confirmed) },
              { label: `Auslastung ${new Date().getFullYear()}`, value: `${stats.occupancy}%` },
            ].map((s) => (
              <div key={s.label} className="glass rounded-2xl p-6 shadow-soft">
                <p className="text-sm text-pine-500 dark:text-pine-300">{s.label}</p>
                <p className="mt-1 font-display text-3xl font-bold">{s.value}</p>
              </div>
            ))}
          </div>
          <div className="glass mt-8 overflow-x-auto rounded-3xl shadow-soft">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-pine-200/60 text-left dark:border-pine-800/60">
                  {["Buchung", "Zeitraum", "Gast", "Total", "Status", "Aktion"].map((h) => (
                    <th key={h} className="px-5 py-4 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((b) => (
                  <tr key={b.id} className="border-b border-pine-200/40 last:border-0 dark:border-pine-800/40">
                    <td className="px-5 py-4 font-mono text-xs">{b.id}</td>
                    <td className="px-5 py-4 whitespace-nowrap">{fmtDate(b.start)} – {fmtDate(b.end)}</td>
                    <td className="px-5 py-4">
                      <span className="font-semibold">{b.name}</span>
                      <span className="block text-xs text-pine-500">{b.email} · {b.persons} Pers.</span>
                    </td>
                    <td className="px-5 py-4 font-semibold whitespace-nowrap">{chf(b.total)}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle[b.status]}`}>{b.status}</span>
                    {b.paymentStatus === "anzahlung_bezahlt" && (
                      <span className="mt-1 block text-xs text-green-600">Anzahlung ✓</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      {b.status === "angefragt" && (
                        <button onClick={() => setStatus(b.id, "bestätigt")} className="rounded-full bg-green-600 px-3 py-1.5 text-xs font-bold text-white">Bestätigen</button>
                      )}
                      {b.paymentStatus !== "anzahlung_bezahlt" && (
                        <button
                          onClick={async () => {
                            const res = await fetch(`/api/stripe/checkout?bookingId=${encodeURIComponent(b.id)}`, { headers: headers(key) });
                            const data = await res.json();
                            if (data.url) window.open(data.url, "_blank");
                          }}
                          className="rounded-full bg-terra-500 px-3 py-1.5 text-xs font-bold text-white"
                        >
                          Zahlungslink
                        </button>
                      )}
                      {b.status !== "storniert" && (
                        <button onClick={() => setStatus(b.id, "storniert")} className="rounded-full border border-red-300 px-3 py-1.5 text-xs font-bold text-red-600 dark:border-red-800 dark:text-red-400">Stornieren</button>
                      )}
                    </div>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "clips" && (
        <div className="glass overflow-x-auto rounded-3xl shadow-soft">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-pine-200/60 text-left dark:border-pine-800/60">
                {["Ort", "Gast", "Typ", "Status", "Aktion"].map((h) => (
                  <th key={h} className="px-5 py-4 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clips.filter((c) => c.type !== "demo").map((c) => (
                <tr key={c.id} className="border-b border-pine-200/40 last:border-0 dark:border-pine-800/40">
                  <td className="px-5 py-4">{c.place}</td>
                  <td className="px-5 py-4">{c.name}</td>
                  <td className="px-5 py-4">{c.type}</td>
                  <td className="px-5 py-4">{c.approved ? "Sichtbar" : "Versteckt"}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => toggleClip(c.id, !c.approved)} className="rounded-full border px-3 py-1 text-xs font-bold">
                        {c.approved ? "Verstecken" : "Zeigen"}
                      </button>
                      <button onClick={() => deleteClip(c.id)} className="rounded-full border border-red-300 px-3 py-1 text-xs font-bold text-red-600">Löschen</button>
                    </div>
                  </td>
                </tr>
              ))}
              {clips.filter((c) => c.type !== "demo").length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-pine-500">Noch keine Gäste-Clips hochgeladen.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === "messages" && (
        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`glass rounded-2xl p-6 shadow-soft ${!m.read ? "ring-2 ring-terra-400/50" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{m.name} · {m.topic}</p>
                  <p className="text-xs text-pine-500">{m.email} · {new Date(m.createdAt).toLocaleString("de-CH")}</p>
                </div>
                {!m.read && (
                  <button onClick={() => markRead(m.id)} className="rounded-full bg-pine-800 px-3 py-1 text-xs font-bold text-white dark:bg-pine-500">Als gelesen</button>
                )}
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{m.message}</p>
            </div>
          ))}
          {messages.length === 0 && <p className="text-center text-pine-500">Keine Kontaktanfragen.</p>}
        </div>
      )}

      {tab === "codes" && (
        <>
          <form onSubmit={addCode} className="glass mb-6 flex flex-wrap gap-3 rounded-2xl p-6 shadow-soft">
            <input value={newCode} onChange={(e) => setNewCode(e.target.value.toUpperCase())} placeholder="Neuer Code" required
              className="rounded-xl border border-pine-200 bg-white/70 px-3 py-2 font-mono uppercase dark:border-pine-800 dark:bg-night-800" />
            <input value={newCodeLabel} onChange={(e) => setNewCodeLabel(e.target.value)} placeholder="Label (z.B. Buchung Lisa)"
              className="min-w-[200px] flex-1 rounded-xl border border-pine-200 bg-white/70 px-3 py-2 dark:border-pine-800 dark:bg-night-800" />
            <button type="submit" className="btn-primary !py-2">Code anlegen</button>
          </form>
          <div className="glass overflow-x-auto rounded-3xl shadow-soft">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-pine-200/60 text-left dark:border-pine-800/60">
                  {["Code", "Label", "Status", "Aktion"].map((h) => (
                    <th key={h} className="px-5 py-4 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {codes.map((c) => (
                  <tr key={c.code} className="border-b border-pine-200/40 last:border-0 dark:border-pine-800/40">
                    <td className="px-5 py-4 font-mono font-semibold">{c.code}</td>
                    <td className="px-5 py-4">{c.label || "—"}</td>
                    <td className="px-5 py-4">{c.active ? "Aktiv" : "Gesperrt"}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggleCode(c.code, !c.active)} className="rounded-full border px-3 py-1 text-xs font-bold">
                        {c.active ? "Sperren" : "Aktivieren"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
