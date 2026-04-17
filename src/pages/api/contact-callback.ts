import type { APIRoute } from "astro";
import { isValidContact } from "@/lib/contact-validation";
import { sendContactCallbackEmail } from "@/lib/resend-notify-server";
import { sendAdminWhatsAppMessage } from "@/lib/whatsapp-notify-server";

export const prerender = false;

function contactCallbackDryRun(): boolean {
  const v = process.env.CONTACT_CALLBACK_DRY_RUN?.trim().toLowerCase();
  if (v === "1" || v === "true" || v === "yes") return true;
  return import.meta.env.DEV;
}

/**
 * Callback request: notifies via Resend email and/or Twilio WhatsApp when
 * configured. Succeeds if at least one channel succeeds.
 *
 * If neither is configured: in `astro dev` (or when CONTACT_CALLBACK_DRY_RUN=1),
 * accepts the request and logs the payload so the contact page can be tested
 * without secrets. In production without dry-run, returns 503 with setup hint.
 */
export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const contact =
    typeof body === "object" &&
    body !== null &&
    typeof (body as { contact?: unknown }).contact === "string"
      ? (body as { contact: string }).contact.trim()
      : "";

  if (!isValidContact(contact)) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Enter a valid phone number (10+ digits) or email address.",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const atIso = new Date().toISOString();

  const [emailResult, waResult] = await Promise.all([
    sendContactCallbackEmail({ contact, atIso }),
    sendAdminWhatsAppMessage(
      `New callback request (website)\nContact: ${contact}\nTime: ${atIso}`,
    ),
  ]);

  const emailOk = emailResult.ok;
  const waOk = waResult.ok;
  const emailSkipped = "skipped" in emailResult && emailResult.skipped;
  const waSkipped = "skipped" in waResult && waResult.skipped;

  if (emailOk || waOk) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (emailSkipped && waSkipped) {
    if (contactCallbackDryRun()) {
      console.info("[contact-callback] dry-run (no Resend/Twilio):", {
        contact,
        atIso,
      });
      return new Response(JSON.stringify({ ok: true, dryRun: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(
      JSON.stringify({
        ok: false,
        error:
          "Callback delivery is not set up yet. Add RESEND_API_KEY (email) and/or Twilio WhatsApp env vars on the server, or set CONTACT_CALLBACK_DRY_RUN=1 for testing.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  const parts = [emailResult.error, waResult.error].filter(Boolean);
  return new Response(
    JSON.stringify({
      ok: false,
      error: `Could not deliver: ${parts.join(" · ")}`,
    }),
    { status: 503, headers: { "Content-Type": "application/json" } },
  );
};
