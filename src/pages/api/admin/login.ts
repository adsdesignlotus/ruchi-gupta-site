import type { APIRoute } from "astro";
import {
  adminCookieName,
  adminCookieOptions,
  getAdminPassword,
  signAdminSession,
} from "@/lib/admin-session";

export const prerender = false;

function hostAllowed(host: string): boolean {
  const raw = process.env.ADMIN_HOST_ALLOWLIST?.trim();
  if (!raw) return true;
  const parts = raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  return parts.some((p) => h === p || h.endsWith(`.${p}`));
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const host = request.headers.get("host") ?? "";
  if (!hostAllowed(host)) {
    return new Response(
      JSON.stringify({ ok: false, error: "Admin login is not allowed for this host." }),
      { status: 403, headers: { "Content-Type": "application/json" } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const password =
    typeof body === "object" &&
    body !== null &&
    typeof (body as { password?: unknown }).password === "string"
      ? (body as { password: string }).password
      : "";

  if (password !== getAdminPassword()) {
    return new Response(JSON.stringify({ ok: false, error: "Incorrect password." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = signAdminSession();
  cookies.set(adminCookieName, token, adminCookieOptions());

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
