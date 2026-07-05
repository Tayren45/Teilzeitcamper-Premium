/**
 * Medien-Upload: lokal (.data/trip-clips-media/) oder Vercel Blob.
 * Setze BLOB_READ_WRITE_TOKEN für Production auf Vercel.
 */

import { promises as fs } from "fs";
import path from "path";
import { put, del } from "@vercel/blob";

const LOCAL_DIR = path.join(process.cwd(), ".data/trip-clips-media");

export async function saveMedia(filename: string, data: Buffer, contentType: string): Promise<string> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`trip-clips/${filename}`, data, {
      access: "public",
      contentType,
      addRandomSuffix: false,
    });
    return blob.url;
  }
  await fs.mkdir(LOCAL_DIR, { recursive: true });
  await fs.writeFile(path.join(LOCAL_DIR, filename), data);
  return `/api/trip-clips/media/${encodeURIComponent(filename)}`;
}

export async function deleteMedia(filename: string, publicUrl?: string): Promise<void> {
  if (publicUrl?.startsWith("http") && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      await del(publicUrl);
    } catch {
      /* ignore */
    }
    return;
  }
  try {
    await fs.unlink(path.join(LOCAL_DIR, filename));
  } catch {
    /* ignore */
  }
}

export async function readLocalMedia(filename: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(path.join(LOCAL_DIR, filename));
  } catch {
    return null;
  }
}

export const LOCAL_MEDIA_DIR = LOCAL_DIR;
