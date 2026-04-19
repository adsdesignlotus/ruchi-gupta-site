import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Redis } from "@upstash/redis";
import defaultPhotoLinks from "@/data/event-photo-links.json";
import { getAllEventSlugs } from "@/lib/event-slugs";

const REDIS_KEY = "event-photo-links:v1";

export type EventPhotoLinkEntry = {
  enabled: boolean;
  googleDriveUrl: string;
  cloudinaryUrl: string;
};

export type EventPhotoLinksMap = Record<string, EventPhotoLinkEntry>;

function tryRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function emptyEntry(): EventPhotoLinkEntry {
  return {
    enabled: false,
    googleDriveUrl: "",
    cloudinaryUrl: "",
  };
}

function normalizeEntry(raw: unknown): EventPhotoLinkEntry {
  if (!raw || typeof raw !== "object") return emptyEntry();
  const o = raw as Record<string, unknown>;
  let enabled = false;
  if (o.enabled === true || o.enabled === 1) enabled = true;
  else if (o.enabled === false || o.enabled === 0) enabled = false;
  else if (typeof o.enabled === "string") {
    enabled = o.enabled.trim().toLowerCase() === "true" || o.enabled === "1";
  }
  return {
    enabled,
    googleDriveUrl:
      typeof o.googleDriveUrl === "string" ? o.googleDriveUrl.trim() : "",
    cloudinaryUrl:
      typeof o.cloudinaryUrl === "string" ? o.cloudinaryUrl.trim() : "",
  };
}

function parseDefaultsObject(d: unknown): EventPhotoLinksMap {
  if (!d || typeof d !== "object" || Array.isArray(d)) return {};
  const out: EventPhotoLinksMap = {};
  for (const [slug, v] of Object.entries(d as Record<string, unknown>)) {
    out[slug] = normalizeEntry(v);
  }
  return out;
}

function readDefaultsFile(): EventPhotoLinksMap {
  if (import.meta.env.DEV) {
    try {
      const path = join(process.cwd(), "src/data/event-photo-links.json");
      const raw = readFileSync(path, "utf8");
      return parseDefaultsObject(JSON.parse(raw) as unknown);
    } catch {
      /* use bundled fallback */
    }
  }
  return parseDefaultsObject(defaultPhotoLinks as unknown);
}

async function readRedisOverlay(): Promise<EventPhotoLinksMap | null> {
  const redis = tryRedis();
  if (!redis) return null;
  const raw = await redis.get(REDIS_KEY);
  if (raw == null) return {};
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const out: EventPhotoLinksMap = {};
      for (const [k, v] of Object.entries(parsed)) {
        out[k] = normalizeEntry(v);
      }
      return out;
    } catch {
      return {};
    }
  }
  if (typeof raw === "object" && raw !== null && !Array.isArray(raw)) {
    const out: EventPhotoLinksMap = {};
    for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
      out[k] = normalizeEntry(v);
    }
    return out;
  }
  return {};
}

export async function getMergedPhotoLinksMap(): Promise<EventPhotoLinksMap> {
  const slugs = getAllEventSlugs();
  const fromFile = readDefaultsFile();
  const fromRedis = (await readRedisOverlay()) ?? {};
  const out: EventPhotoLinksMap = {};
  for (const slug of slugs) {
    out[slug] = normalizeEntry({
      ...emptyEntry(),
      ...fromFile[slug],
      ...fromRedis[slug],
    });
  }
  return out;
}

const DRIVE_PREFIXES = ["https://drive.google.com/", "https://docs.google.com/"];

export function isValidHttpsUrl(s: string): boolean {
  if (!s) return true;
  try {
    const u = new URL(s);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

export function validatePhotoLinkEntry(e: EventPhotoLinkEntry): string | null {
  if (!isValidHttpsUrl(e.googleDriveUrl) || !isValidHttpsUrl(e.cloudinaryUrl)) {
    return "URLs must be empty or valid https links.";
  }
  if (e.googleDriveUrl) {
    const ok = DRIVE_PREFIXES.some((p) => e.googleDriveUrl.startsWith(p));
    if (!ok) {
      return "Google Drive link should start with https://drive.google.com/ or https://docs.google.com/";
    }
  }
  if (e.cloudinaryUrl) {
    try {
      const u = new URL(e.cloudinaryUrl);
      if (u.protocol !== "https:") {
        return "Cloudinary link must use https.";
      }
      if (
        !u.hostname.endsWith("cloudinary.com") &&
        u.hostname !== "cloudinary.com"
      ) {
        return "Cloudinary link must be on cloudinary.com (for example https://res.cloudinary.com/…).";
      }
    } catch {
      return "Cloudinary link must be a valid URL.";
    }
  }
  return null;
}

/** Public payload when the admin has turned the block on for this slug. */
export function getPublicPhotoLinksForSlug(
  map: EventPhotoLinksMap,
  slug: string,
): {
  googleDriveUrl: string | null;
  cloudinaryUrl: string | null;
} | null {
  const e = map[slug];
  if (!e?.enabled) return null;
  const g = e.googleDriveUrl.trim();
  const c = e.cloudinaryUrl.trim();
  return {
    googleDriveUrl: g ? g : null,
    cloudinaryUrl: c ? c : null,
  };
}

export async function savePhotoLinksMap(
  map: EventPhotoLinksMap,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const slugs = new Set(getAllEventSlugs());
  const cleaned: EventPhotoLinksMap = {};
  for (const slug of slugs) {
    const e = normalizeEntry(map[slug]);
    const err = validatePhotoLinkEntry(e);
    if (err) return { ok: false, error: `${slug}: ${err}` };
    cleaned[slug] = e;
  }

  const redis = tryRedis();
  if (redis) {
    await redis.set(REDIS_KEY, cleaned);
    return { ok: true };
  }

  if (import.meta.env.DEV) {
    const path = join(process.cwd(), "src/data/event-photo-links.json");
    writeFileSync(path, JSON.stringify(cleaned, null, 2) + "\n", "utf8");
    return { ok: true };
  }

  return {
    ok: false,
    error:
      "Saving requires Upstash Redis on the server (UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from the Vercel Redis integration), or run locally with `npm run dev` to write src/data/event-photo-links.json.",
  };
}
