/**
 * Kontaktformular — speichert Anfragen und benachrichtigt David.
 */

import { NextRequest, NextResponse } from "next/server";
import { readMessages, writeMessages, type ContactMessage } from "@/lib/messages";
import { notifyOwner } from "@/lib/notify";

const ADMIN_KEY = process.env.ADMIN_KEY || "teilzeit-admin";

export async function GET(req: NextRequest) {
  if (req.headers.get("x-admin-key") !== ADMIN_KEY) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }
  const messages = await readMessages();
  return NextResponse.json({ messages });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const name = String(body.name || "").trim().slice(0, 120);
  const email = String(body.email || "").trim().slice(0, 160);
  const topic = String(body.topic || "Allgemeine Frage").slice(0, 80);
  const message = String(body.message || "").trim().slice(0, 4000);

  if (name.length < 2 || !/.+@.+\..+/.test(email) || message.length < 10) {
    return NextResponse.json({ error: "Bitte alle Pflichtfelder ausfüllen." }, { status: 400 });
  }

  const entry: ContactMessage = {
    id: `msg-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    name,
    email,
    topic,
    message,
    read: false,
  };

  const messages = await readMessages();
  messages.unshift(entry);
  await writeMessages(messages);

  await notifyOwner(
    `[Website] ${topic} — ${name}`,
    `${message}\n\n—\n${name}\n${email}\nThema: ${topic}`
  );

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  if (req.headers.get("x-admin-key") !== ADMIN_KEY) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }
  const { id, read } = (await req.json()) as { id: string; read: boolean };
  const messages = await readMessages();
  const m = messages.find((x) => x.id === id);
  if (!m) return NextResponse.json({ error: "Nachricht nicht gefunden." }, { status: 404 });
  m.read = read;
  await writeMessages(messages);
  return NextResponse.json({ ok: true });
}
