/**
 * Benachrichtigungen an David (Buchungen, Kontakt).
 * Mit RESEND_API_KEY → E-Mail, sonst Log in Redis/Datei.
 */

import { readJson, writeJson } from "@/lib/persist";

type NotificationLog = {
  id: string;
  createdAt: string;
  subject: string;
  body: string;
  sent: boolean;
};

const KEY = "notifications";

async function appendLog(entry: Omit<NotificationLog, "id" | "createdAt">) {
  const logs = await readJson<NotificationLog[]>(KEY, []);
  logs.unshift({
    id: `n-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    ...entry,
  });
  await writeJson(KEY, logs.slice(0, 200));
}

export async function notifyOwner(subject: string, body: string): Promise<void> {
  const to = process.env.NOTIFY_EMAIL || "info@teilzeitcamper.ch";
  const from = process.env.NOTIFY_FROM || "Teilzeitcamper <noreply@teilzeitcamper.ch>";
  const key = process.env.RESEND_API_KEY;

  if (key) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to, subject, text: body }),
      });
      if (res.ok) {
        await appendLog({ subject, body, sent: true });
        return;
      }
    } catch {
      /* Fallback auf Log */
    }
  }

  await appendLog({ subject, body, sent: false });
}
