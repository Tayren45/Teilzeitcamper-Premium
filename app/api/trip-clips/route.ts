/**
 * Trip-Clips API
 */

import { NextRequest, NextResponse } from "next/server";
import { DEMO_CLIPS, type TripClip } from "@/lib/trip-clips";
import { readClips, readCodes, verifyAccessCode, writeClips, writeCodes } from "@/lib/trip-clips-db";
import { saveMedia, deleteMedia } from "@/lib/media";

const ADMIN_KEY = process.env.ADMIN_KEY || "teilzeit-admin";
const MAX_BYTES = 52_428_800;
const ALLOWED_IMAGE = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_VIDEO = new Set(["video/mp4", "video/quicktime", "video/webm"]);

function isAdmin(req: NextRequest) {
  return req.headers.get("x-admin-key") === ADMIN_KEY;
}

export async function GET(req: NextRequest) {
  const clips = await readClips();
  if (isAdmin(req)) {
    const codes = await readCodes();
    return NextResponse.json({ clips, codes });
  }
  return NextResponse.json({ clips: [...clips.filter((c) => c.approved), ...DEMO_CLIPS] });
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const code = String(form.get("code") || "");
  if (!(await verifyAccessCode(code))) {
    return NextResponse.json({ error: "Ungültiger oder abgelaufener Zugangscode." }, { status: 403 });
  }

  const name = String(form.get("name") || "").slice(0, 80);
  const place = String(form.get("place") || "").slice(0, 120);
  const date = String(form.get("date") || "").slice(0, 10);
  const caption = String(form.get("caption") || "").slice(0, 500);
  const file = form.get("file");
  const poster = form.get("poster");

  if (!name.trim() || !place.trim() || !(file instanceof File)) {
    return NextResponse.json({ error: "Name, Ort und Foto/Video sind Pflicht." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Datei zu gross (max. 50 MB)." }, { status: 400 });
  }

  const isVideo = file.type.startsWith("video/");
  const isImage = file.type.startsWith("image/");
  if (isVideo && !ALLOWED_VIDEO.has(file.type)) {
    return NextResponse.json({ error: "Videoformat nicht unterstützt." }, { status: 400 });
  }
  if (isImage && !ALLOWED_IMAGE.has(file.type)) {
    return NextResponse.json({ error: "Bildformat nicht unterstützt." }, { status: 400 });
  }
  if (!isVideo && !isImage) {
    return NextResponse.json({ error: "Nur Bilder oder Videos erlaubt." }, { status: 400 });
  }

  const id = `clip-${Date.now().toString(36)}`;
  const ext = isVideo
    ? file.type.includes("webm") ? "webm" : file.type.includes("quicktime") ? "mov" : "mp4"
    : "jpg";

  const mediaFile = `${id}.${ext}`;
  const mediaStored = await saveMedia(mediaFile, Buffer.from(await file.arrayBuffer()), file.type || "application/octet-stream");

  let posterFile: string | undefined;
  let posterUrl: string | undefined;
  if (poster instanceof File && poster.size > 0 && poster.size < 5_000_000) {
    posterFile = `${id}-poster.jpg`;
    const posterStored = await saveMedia(posterFile, Buffer.from(await poster.arrayBuffer()), "image/jpeg");
    if (posterStored.startsWith("http")) posterUrl = posterStored;
  }

  const clip: TripClip = {
    id,
    createdAt: new Date().toISOString(),
    name: name.trim(),
    place: place.trim(),
    date: /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined,
    caption: caption.trim() || undefined,
    type: isVideo ? "video" : "image",
    mediaFile: mediaStored.startsWith("http") ? undefined : mediaFile,
    mediaUrl: mediaStored.startsWith("http") ? mediaStored : undefined,
    posterFile: posterUrl ? undefined : posterFile,
    posterUrl,
    approved: true,
  };

  const clips = await readClips();
  clips.unshift(clip);
  await writeClips(clips);
  return NextResponse.json({ ok: true, clip });
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const body = (await req.json()) as {
    clipId?: string;
    approved?: boolean;
    code?: string;
    label?: string;
    active?: boolean;
    action?: "addCode" | "toggleCode" | "deleteCode";
  };

  if (body.action === "addCode" && body.code) {
    const codes = await readCodes();
    const c = body.code.trim().toUpperCase();
    if (!c) return NextResponse.json({ error: "Code leer." }, { status: 400 });
    if (codes.some((x) => x.code.toUpperCase() === c)) {
      return NextResponse.json({ error: "Code existiert bereits." }, { status: 409 });
    }
    codes.push({ code: c, label: body.label, active: true, createdAt: new Date().toISOString() });
    await writeCodes(codes);
    return NextResponse.json({ ok: true, codes });
  }

  if (body.action === "toggleCode" && body.code) {
    const codes = await readCodes();
    const entry = codes.find((x) => x.code === body.code);
    if (!entry) return NextResponse.json({ error: "Code nicht gefunden." }, { status: 404 });
    entry.active = body.active ?? !entry.active;
    await writeCodes(codes);
    return NextResponse.json({ ok: true, codes });
  }

  if (body.action === "deleteCode" && body.code) {
    const codes = await readCodes();
    await writeCodes(codes.filter((x) => x.code !== body.code));
    return NextResponse.json({ ok: true });
  }

  if (!body.clipId) {
    return NextResponse.json({ error: "clipId fehlt." }, { status: 400 });
  }

  const clips = await readClips();
  const clip = clips.find((c) => c.id === body.clipId);
  if (!clip) return NextResponse.json({ error: "Clip nicht gefunden." }, { status: 404 });

  if (typeof body.approved === "boolean") clip.approved = body.approved;
  await writeClips(clips);
  return NextResponse.json({ ok: true, clip });
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id || id.startsWith("demo-")) {
    return NextResponse.json({ error: "Ungültige Clip-ID." }, { status: 400 });
  }

  const clips = await readClips();
  const clip = clips.find((c) => c.id === id);
  if (!clip) return NextResponse.json({ error: "Clip nicht gefunden." }, { status: 404 });

  if (clip.mediaFile || clip.mediaUrl) {
    await deleteMedia(clip.mediaFile || "", clip.mediaUrl);
  }
  if (clip.posterFile || clip.posterUrl) {
    await deleteMedia(clip.posterFile || "", clip.posterUrl);
  }

  await writeClips(clips.filter((c) => c.id !== id));
  return NextResponse.json({ ok: true });
}
