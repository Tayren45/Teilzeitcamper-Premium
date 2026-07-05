/** Trip-Clips: Server-seitige Persistenz */

import type { AccessCode, TripClip } from "@/lib/trip-clips";
import { readJson, writeJson } from "@/lib/persist";

const CLIPS_KEY = "trip-clips";
const CODES_KEY = "access-codes";

const SEED_CODES: AccessCode[] = [
  { code: "TEILZEIT24", label: "Allgemein 2024", active: true, createdAt: "2026-01-01T00:00:00Z" },
  { code: "BERGFEX", label: "Aktion", active: true, createdAt: "2026-01-01T00:00:00Z" },
  { code: "ROADTRIP", label: "Aktion", active: true, createdAt: "2026-01-01T00:00:00Z" },
];

export async function readClips(): Promise<TripClip[]> {
  return readJson<TripClip[]>(CLIPS_KEY, []);
}

export async function writeClips(clips: TripClip[]) {
  await writeJson(CLIPS_KEY, clips);
}

export async function readCodes(): Promise<AccessCode[]> {
  const data = await readJson<AccessCode[] | null>(CODES_KEY, null);
  if (data === null) {
    await writeCodes(SEED_CODES);
    return [...SEED_CODES];
  }
  return data;
}

export async function writeCodes(codes: AccessCode[]) {
  await writeJson(CODES_KEY, codes);
}

export async function verifyAccessCode(code: string): Promise<boolean> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return false;
  const codes = await readCodes();
  return codes.some((c) => c.code.toUpperCase() === normalized && c.active);
}
