import { site } from "@/lib/site";

/**
 * Sends a WhatsApp message to the business number (site.whatsappPhoneE164)
 * using Twilio. Requires a WhatsApp-enabled Twilio sender.
 *
 * Env: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM
 * (e.g. TWILIO_WHATSAPP_FROM=whatsapp:+14155238886 for sandbox)
 */
export async function sendAdminWhatsAppMessage(
  messageBody: string,
): Promise<{ ok: true } | { ok: false; error: string; skipped?: boolean }> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const from = process.env.TWILIO_WHATSAPP_FROM?.trim();

  if (!accountSid || !authToken || !from) {
    return {
      ok: false,
      error:
        "WhatsApp notify is not configured on the server (missing Twilio env vars).",
      skipped: true,
    };
  }

  const body = messageBody.replace(/[\r\n\u0000-\u001F]/g, " ").trim();
  if (!body) {
    return { ok: false, error: "Invalid message" };
  }

  const to = `whatsapp:+${site.whatsappPhoneE164}`;

  const params = new URLSearchParams({
    From: from,
    To: to,
    Body: body,
  });

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    if (process.env.NODE_ENV === "development") {
      console.error("[Twilio]", res.status, text.slice(0, 500));
    }
    return {
      ok: false,
      error: `Twilio error (${res.status}). Check server logs and Twilio setup.`,
    };
  }

  return { ok: true };
}

/** @deprecated Use sendAdminWhatsAppMessage with a full line if you need more context */
export async function sendContactReceivedWhatsApp(
  visitorPhoneDisplay: string,
): Promise<{ ok: true } | { ok: false; error: string; skipped?: boolean }> {
  return sendAdminWhatsAppMessage(
    `Contact received via website ${visitorPhoneDisplay}`,
  );
}
