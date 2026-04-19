import type { APIRoute } from "astro";
import {
  adminCookieName,
  verifyAdminSessionToken,
} from "@/lib/admin-session";
import {
  getMergedPhotoLinksMap,
  savePhotoLinksMap,
  type EventPhotoLinksMap,
} from "@/lib/event-photo-links-store";

export const prerender = false;

function unauthorized() {
  return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

function isAuthorized(cookies: { get: (n: string) => { value?: string } | undefined }) {
  const token = cookies.get(adminCookieName)?.value;
  return verifyAdminSessionToken(token);
}

export const GET: APIRoute = async ({ cookies }) => {
  if (!isAuthorized(cookies)) return unauthorized();
  const map = await getMergedPhotoLinksMap();
  return new Response(JSON.stringify({ ok: true, map }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthorized(cookies)) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const mapRaw =
    typeof body === "object" &&
    body !== null &&
    "map" in body &&
    typeof (body as { map?: unknown }).map === "object" &&
    (body as { map: unknown }).map !== null
      ? (body as { map: Record<string, unknown> }).map
      : null;

  if (!mapRaw) {
    return new Response(JSON.stringify({ ok: false, error: "Missing map" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const map: EventPhotoLinksMap = {};
  for (const [slug, v] of Object.entries(mapRaw)) {
    map[slug] = {
      enabled: Boolean((v as { enabled?: unknown })?.enabled),
      googleDriveUrl:
        typeof (v as { googleDriveUrl?: unknown })?.googleDriveUrl === "string"
          ? (v as { googleDriveUrl: string }).googleDriveUrl
          : "",
      cloudinaryUrl:
        typeof (v as { cloudinaryUrl?: unknown })?.cloudinaryUrl === "string"
          ? (v as { cloudinaryUrl: string }).cloudinaryUrl
          : "",
    };
  }

  const result = await savePhotoLinksMap(map);
  if (!result.ok) {
    return new Response(JSON.stringify({ ok: false, error: result.error }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const merged = await getMergedPhotoLinksMap();
  return new Response(JSON.stringify({ ok: true, map: merged }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
