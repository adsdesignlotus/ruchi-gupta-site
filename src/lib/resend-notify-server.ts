import { site } from "@/lib/site";

/**
 * Sends a plain-text email via Resend (https://resend.com).
 *
 * Env:
 * - RESEND_API_KEY (required to send)
 * - RESEND_FROM — verified sender, e.g. onboarding@resend.dev for tests
 * - CONTACT_NOTIFY_EMAIL — recipient (defaults to site.email)
 */
export async function sendContactCallbackEmail(params: {
  contact: string;
  atIso: string;
}): Promise<
  { ok: true } | { ok: false; error: string; skipped?: boolean }
> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return {
      ok: false,
      error: "Resend is not configured (missing RESEND_API_KEY).",
      skipped: true,
    };
  }

  const from = process.env.RESEND_FROM?.trim() || "onboarding@resend.dev";
  const to =
    process.env.CONTACT_NOTIFY_EMAIL?.trim() || site.email;

  const safeContact = params.contact.replace(/[\r\n\u0000-\u001F]/g, " ").trim();

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `KNN Website <${from}>`,
      to: [to],
      subject: "New Contact Request",
      text: `User input: ${safeContact}\nTime: ${params.atIso}`,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    if (process.env.NODE_ENV === "development") {
      console.error("[Resend]", res.status, text.slice(0, 500));
    }
    return {
      ok: false,
      error: `Email could not be sent (${res.status}). Check Resend logs.`,
    };
  }

  return { ok: true };
}
