import type { APIRoute } from "astro";
import { adminCookieName } from "@/lib/admin-session";

export const prerender = false;

export const POST: APIRoute = async ({ cookies }) => {
  cookies.delete(adminCookieName, { path: "/" });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
