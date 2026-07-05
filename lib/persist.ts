/**
 * Persistenz-Schicht: lokal (.data/) oder Upstash Redis (Vercel Production).
 * Setze UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN für persistenten Betrieb.
 */

import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";

const DATA_DIR = path.join(process.cwd(), ".data");
const KV_PREFIX = "tc:";

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis !== null) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    redis = null;
    return null;
  }
  redis = new Redis({ url, token });
  return redis;
}

function localPath(key: string) {
  return path.join(DATA_DIR, `${key}.json`);
}

export async function readJson<T>(key: string, fallback: T): Promise<T> {
  const kv = getRedis();
  if (kv) {
    const data = await kv.get<T>(`${KV_PREFIX}${key}`);
    return data ?? fallback;
  }
  try {
    const raw = await fs.readFile(localPath(key), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson<T>(key: string, value: T): Promise<void> {
  const kv = getRedis();
  if (kv) {
    await kv.set(`${KV_PREFIX}${key}`, value);
    return;
  }
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(localPath(key), JSON.stringify(value, null, 2));
}

export function isCloudPersist(): boolean {
  return Boolean(getRedis());
}
