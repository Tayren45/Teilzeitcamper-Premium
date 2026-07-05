"use client";

/**
 * Kontaktformular — sendet an /api/contact (speichert + benachrichtigt David).
 * Fallback: mailto wenn die API nicht erreichbar ist.
 */

import { useState } from "react";
import { contact } from "@/lib/content";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", topic: "Allgemeine Frage", message: "" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Senden fehlgeschlagen.");
      setSent(true);
    } catch (err) {
      const body = encodeURIComponent(`${form.message}\n\n—\n${form.name}\n${form.email}`);
      const subject = encodeURIComponent(`[Website] ${form.topic} — ${form.name}`);
      window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
      setSent(true);
      setError(err instanceof Error ? err.message : null);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="glass rounded-3xl p-8 shadow-soft">
      <h2 className="font-display text-xl font-semibold">Nachricht schreiben</h2>
      <div className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Name *</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-pine-200 bg-white/70 px-3.5 py-2.5 outline-none transition-shadow focus:ring-2 focus:ring-pine-500 dark:border-pine-800 dark:bg-night-800"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">E-Mail *</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-pine-200 bg-white/70 px-3.5 py-2.5 outline-none transition-shadow focus:ring-2 focus:ring-pine-500 dark:border-pine-800 dark:bg-night-800"
            />
          </label>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Thema</span>
          <select
            value={form.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value })}
            className="w-full rounded-xl border border-pine-200 bg-white/70 px-3.5 py-2.5 outline-none transition-shadow focus:ring-2 focus:ring-pine-500 dark:border-pine-800 dark:bg-night-800"
          >
            {["Allgemeine Frage", "Buchungsanfrage", "Frage zur Übergabe", "Feedback", "Partnerschaft"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Nachricht *</span>
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Salü David, …"
            className="w-full rounded-xl border border-pine-200 bg-white/70 px-3.5 py-2.5 outline-none transition-shadow focus:ring-2 focus:ring-pine-500 dark:border-pine-800 dark:bg-night-800"
          />
        </label>
        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
          {submitting ? "Wird gesendet…" : "Nachricht senden ✉️"}
        </button>
        {sent && (
          <p className="rounded-xl bg-green-100 px-4 py-3 text-sm font-medium text-green-800 dark:bg-green-900/40 dark:text-green-300">
            {error
              ? "Server nicht erreichbar — dein E-Mail-Programm öffnet sich mit der fertigen Nachricht."
              : "Danke! Wir melden uns so schnell wie möglich bei dir."}
          </p>
        )}
      </div>
    </form>
  );
}
