"use client";

/**
 * Trip-Clips: Gäste-Feed mit Zugangscode-Upload.
 * Medien werden serverseitig in .data/trip-clips-media gespeichert.
 */

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clipMediaUrl, clipPosterUrl, fmtClipDate, type TripClip } from "@/lib/trip-clips";

function downscaleImage(file: File, max = 1280): Promise<Blob> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * s);
      c.height = Math.round(img.height * s);
      c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
      c.toBlob((b) => {
        URL.revokeObjectURL(url);
        resolve(b || file);
      }, "image/jpeg", 0.82);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}

function capturePoster(file: File): Promise<Blob | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    let done = false;
    const finish = (blob: Blob | null) => {
      if (done) return;
      done = true;
      URL.revokeObjectURL(url);
      resolve(blob);
    };
    v.muted = true;
    v.playsInline = true;
    v.preload = "metadata";
    v.src = url;
    v.onloadeddata = () => {
      try {
        v.currentTime = Math.min(1, (v.duration || 2) / 2);
      } catch {
        finish(null);
      }
    };
    v.onseeked = () => {
      try {
        const s = Math.min(1, 640 / (v.videoWidth || 640));
        const c = document.createElement("canvas");
        c.width = Math.round((v.videoWidth || 640) * s);
        c.height = Math.round((v.videoHeight || 360) * s);
        c.getContext("2d")?.drawImage(v, 0, 0, c.width, c.height);
        c.toBlob((b) => finish(b), "image/jpeg", 0.7);
      } catch {
        finish(null);
      }
    };
    v.onerror = () => finish(null);
    setTimeout(() => finish(null), 4000);
  });
}

function ClipCard({ clip }: { clip: TripClip }) {
  const [playing, setPlaying] = useState(false);
  const mediaUrl = clipMediaUrl(clip);
  const posterUrl = clipPosterUrl(clip);

  return (
    <article className="group overflow-hidden rounded-3xl glass shadow-soft">
      <div className="relative aspect-[4/5] overflow-hidden bg-pine-900">
        {clip.type === "demo" ? (
          <div className={`flex h-full w-full items-end bg-gradient-to-br ${clip.grad}`}>
            <span className="absolute left-3 top-3 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              Beispiel
            </span>
          </div>
        ) : clip.type === "image" && mediaUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mediaUrl} alt={clip.place} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
        ) : clip.type === "video" && mediaUrl ? (
          playing ? (
            <video src={mediaUrl} controls autoPlay playsInline className="h-full w-full object-cover" />
          ) : (
            <>
              {posterUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={posterUrl} alt={clip.place} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="flex h-full items-center justify-center bg-pine-800 text-4xl">🎬</div>
              )}
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label="Clip abspielen"
                className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/35"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-2xl shadow-lift">▶</span>
              </button>
            </>
          )
        ) : null}
        <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          📍 {clip.place}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-semibold">{clip.name}</span>
          {clip.date && <span className="text-xs text-pine-500">{fmtClipDate(clip.date)}</span>}
        </div>
        {clip.caption && <p className="mt-1.5 text-sm leading-relaxed text-pine-600 dark:text-sand-100/70">{clip.caption}</p>}
      </div>
    </article>
  );
}

export default function TripClipsSection() {
  const [clips, setClips] = useState<TripClip[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadOk, setUploadOk] = useState(false);
  const [form, setForm] = useState({ name: "", place: "", date: "", caption: "" });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const loadClips = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/trip-clips");
      const data = await res.json();
      setClips(data.clips ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClips();
    const saved = sessionStorage.getItem("tc-clip-code");
    if (saved) {
      setCode(saved);
      setUnlocked(true);
    }
  }, [loadClips]);

  function openModal() {
    setModalOpen(true);
    setUploadOk(false);
    setUploadError(null);
  }

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setCodeError(null);
    const c = codeInput.trim();
    if (c.length < 4) {
      setCodeError("Bitte gültigen Zugangscode eingeben.");
      return;
    }
    const res = await fetch("/api/trip-clips/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: c }),
    });
    const data = await res.json();
    if (!data.valid) {
      setCodeError("Ungültiger oder abgelaufener Zugangscode.");
      return;
    }
    setCode(c.toUpperCase());
    setUnlocked(true);
    sessionStorage.setItem("tc-clip-code", c.toUpperCase());
  }

  async function submitClip(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !code) return;
    setUploading(true);
    setUploadError(null);
    try {
      const isVideo = file.type.startsWith("video/");
      const blob = isVideo ? file : await downscaleImage(file);
      const fd = new FormData();
      fd.append("code", code);
      fd.append("name", form.name);
      fd.append("place", form.place);
      fd.append("date", form.date);
      fd.append("caption", form.caption);
      fd.append("file", blob, isVideo ? file.name : "photo.jpg");
      if (isVideo) {
        const poster = await capturePoster(file);
        if (poster) fd.append("poster", poster, "poster.jpg");
      }
      const res = await fetch("/api/trip-clips", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload fehlgeschlagen.");
      setUploadOk(true);
      setForm({ name: "", place: "", date: "", caption: "" });
      setFile(null);
      setPreview(null);
      await loadClips();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload fehlgeschlagen.");
    } finally {
      setUploading(false);
    }
  }

  function onFileChange(f: File | null) {
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-terra-500">Community</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Trip-Clips unserer Gäste
          </h2>
          <p className="mt-2 max-w-xl text-pine-700 dark:text-sand-100/70">
            Mit deinem Zugangscode nach der Miete teilst du Fotos und Clips deiner Route — für alle, die Lust auf
            Abenteuer bekommen sollen.
          </p>
        </div>
        <button type="button" onClick={openModal} className="btn-primary">
          Trip-Clip posten 📸
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[4/5] animate-pulse rounded-3xl bg-pine-100 dark:bg-pine-900" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {clips.map((clip, i) => (
            <motion.div key={clip.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <ClipCard clip={clip} />
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 sm:items-center"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl glass-strong p-6 shadow-lift sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-xl font-semibold">Trip-Clip teilen</h3>
                <button type="button" onClick={() => setModalOpen(false)} aria-label="Schliessen" className="text-2xl leading-none opacity-60 hover:opacity-100">×</button>
              </div>

              {!unlocked ? (
                <form onSubmit={unlock} className="mt-6 space-y-4">
                  <p className="text-sm text-pine-600 dark:text-pine-300">
                    Den Zugangscode erhältst du mit deiner Buchungsbestätigung per E-Mail.
                  </p>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold">Zugangscode</span>
                    <input
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                      placeholder="z.B. SOMMER25-LISA"
                      className="w-full rounded-xl border border-pine-200 bg-white/70 px-3.5 py-2.5 font-mono uppercase outline-none focus:ring-2 focus:ring-pine-500 dark:border-pine-800 dark:bg-night-800"
                    />
                  </label>
                  {codeError && <p className="text-sm font-semibold text-terra-500">{codeError}</p>}
                  <button type="submit" className="btn-primary w-full">Code prüfen</button>
                  <p className="text-center text-xs text-pine-400">Demo: TEILZEIT24 · BERGFEX · ROADTRIP</p>
                </form>
              ) : uploadOk ? (
                <div className="mt-6 text-center">
                  <p className="text-4xl">🎉</p>
                  <p className="mt-3 font-semibold">Clip veröffentlicht!</p>
                  <p className="mt-1 text-sm text-pine-600 dark:text-pine-300">Danke fürs Teilen — andere Gäste freuen sich.</p>
                  <button type="button" onClick={() => setModalOpen(false)} className="btn-primary mt-6 w-full">Fertig</button>
                </div>
              ) : (
                <form onSubmit={submitClip} className="mt-6 space-y-4">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold">Dein Name *</span>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-xl border border-pine-200 bg-white/70 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-pine-500 dark:border-pine-800 dark:bg-night-800" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold">Ort / Stopp *</span>
                    <input required value={form.place} onChange={(e) => setForm({ ...form, place: e.target.value })} placeholder="z.B. Furkapass"
                      className="w-full rounded-xl border border-pine-200 bg-white/70 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-pine-500 dark:border-pine-800 dark:bg-night-800" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold">Datum</span>
                    <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full rounded-xl border border-pine-200 bg-white/70 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-pine-500 dark:border-pine-800 dark:bg-night-800" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold">Foto oder Video *</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
                      required
                      onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
                      className="w-full text-sm"
                    />
                    {preview && file?.type.startsWith("image/") && (
                      <div className="relative mt-2 aspect-video overflow-hidden rounded-xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preview} alt="Vorschau" className="h-full w-full object-cover" />
                      </div>
                    )}
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold">Kurzer Text</span>
                    <textarea rows={3} value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} placeholder="Was war der Highlight-Moment?"
                      className="w-full rounded-xl border border-pine-200 bg-white/70 px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-pine-500 dark:border-pine-800 dark:bg-night-800" />
                  </label>
                  {uploadError && <p className="text-sm font-semibold text-terra-500">{uploadError}</p>}
                  <button type="submit" disabled={uploading} className="btn-primary w-full disabled:opacity-50">
                    {uploading ? "Wird hochgeladen…" : "Trip-Clip veröffentlichen"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
