/** Kontaktanfragen */

import { readJson, writeJson } from "@/lib/persist";

export type ContactMessage = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  read: boolean;
};

const KEY = "messages";

export async function readMessages(): Promise<ContactMessage[]> {
  return readJson<ContactMessage[]>(KEY, []);
}

export async function writeMessages(messages: ContactMessage[]) {
  await writeJson(KEY, messages);
}
