import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "rg_admin";

export function getAdminPassword(): string {
  const fromEnv = process.env.ADMIN_PASSWORD?.trim();
  if (fromEnv) return fromEnv;
  return "ruchigupta";
}

function sessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    createHmac("sha256", "rg-admin-session")
      .update(getAdminPassword())
      .digest("hex")
  );
}

export function signAdminSession(): string {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ exp, v: 1 }), "utf8").toString(
    "base64url",
  );
  const sig = createHmac("sha256", sessionSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token || !token.includes(".")) return false;
  const i = token.lastIndexOf(".");
  const payload = token.slice(0, i);
  const sig = token.slice(i + 1);
  if (!payload || !sig) return false;
  const expected = createHmac("sha256", sessionSecret())
    .update(payload)
    .digest("base64url");
  try {
    if (expected.length !== sig.length) return false;
    if (!timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return false;
  } catch {
    return false;
  }
  let parsed: { exp?: number };
  try {
    parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return false;
  }
  if (typeof parsed.exp !== "number" || parsed.exp < Date.now()) return false;
  return true;
}

export const adminCookieName = COOKIE_NAME;

export function adminCookieOptions(): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax";
  path: string;
  maxAge: number;
} {
  return {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}
