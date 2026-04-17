import type { APIRoute } from "astro";
import { fetchInstagramFeed } from "@/lib/instagram-graph-server";

export const prerender = false;

/**
 * JSON feed for the Instagram grid. Token stays server-side.
 * Cache briefly to respect Graph rate limits.
 */
export const GET: APIRoute = async () => {
  const result = await fetchInstagramFeed();

  if (!result.ok) {
    return new Response(
      JSON.stringify({
        ok: false as const,
        items: [],
        error: result.error,
        configured: result.configured,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=60",
        },
      },
    );
  }

  const cache =
    result.configured && result.items.length > 0
      ? "public, max-age=300, s-maxage=300"
      : "public, max-age=120";

  return new Response(
    JSON.stringify({
      ok: true as const,
      items: result.items,
      configured: result.configured,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": cache,
      },
    },
  );
};
