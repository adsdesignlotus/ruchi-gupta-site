import type { APIRoute } from "astro";
import {
  getMergedPhotoLinksMap,
  getPublicPhotoLinksForSlug,
} from "@/lib/event-photo-links-store";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const slug = url.searchParams.get("slug")?.trim() ?? "";
  if (!slug) {
    return new Response(JSON.stringify({ ok: false, error: "Missing slug" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const noStore = {
    "Content-Type": "application/json",
    "Cache-Control": "private, no-store, max-age=0",
  } as const;

  const map = await getMergedPhotoLinksMap();
  const links = getPublicPhotoLinksForSlug(map, slug);
  if (!links) {
    return new Response(JSON.stringify({ ok: true, visible: false }), {
      status: 200,
      headers: noStore,
    });
  }

  return new Response(
    JSON.stringify({
      ok: true,
      visible: true,
      googleDriveUrl: links.googleDriveUrl,
      cloudinaryUrl: links.cloudinaryUrl,
    }),
    {
      status: 200,
      headers: noStore,
    },
  );
};
