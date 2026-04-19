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

  const map = await getMergedPhotoLinksMap();
  const links = getPublicPhotoLinksForSlug(map, slug);
  if (!links) {
    return new Response(JSON.stringify({ ok: true, visible: false }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
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
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
};
