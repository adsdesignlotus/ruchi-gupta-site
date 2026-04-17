"use client";

import { useState } from "react";
import { contactValidationHint, isValidContact } from "@/lib/contact-validation";
import { instituteEnquiryMailtoHref, whatsAppEnquiryHref } from "@/lib/site";

export function ContactForm() {
  const [contact, setContact] = useState("");
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function submitCallback() {
    setHint("");
    const trimmed = contact.trim();
    if (!isValidContact(trimmed)) {
      setHint(contactValidationHint(trimmed));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact-callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: trimmed }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setHint(
          data.error ??
            "Could not send right now. Please use WhatsApp or email above.",
        );
        return;
      }

      setContact("");
      setDone(true);
    } catch {
      setHint("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto mt-10 w-full max-w-[500px]">
        <p
          className="rounded-xl border border-black/[0.06] bg-section px-6 py-8 text-center text-base leading-prose text-text-primary shadow-card"
          role="status"
        >
          Thank you. We&apos;ll connect with you shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 w-full max-w-[500px] space-y-6 text-center">
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
        <a
          href={whatsAppEnquiryHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-0 flex-1 shrink-0 items-center justify-center rounded-lg bg-[#25D366] px-3 py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#20BA5A] active:bg-[#1DA851]"
        >
          Chat on WhatsApp
        </a>
        <a
          href={instituteEnquiryMailtoHref()}
          className="inline-flex min-h-0 flex-1 shrink-0 items-center justify-center rounded-lg border border-black/[0.14] bg-transparent px-3 py-2 text-center text-sm font-semibold text-text-primary transition hover:border-black/25 hover:bg-black/[0.02]"
        >
          Send an Email
        </a>
      </div>

      <div
        className="border-t border-black/[0.06] pt-6 text-left"
        aria-labelledby="callback-heading"
      >
        <h2
          id="callback-heading"
          className="sr-only"
        >
          Request a call back
        </h2>
        <p className="mb-4 text-center text-sm leading-prose text-text-secondary">
          Prefer a call? Leave your phone or email and we&apos;ll reach out.
        </p>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            autoComplete="on"
            name="contact"
            value={contact}
            onChange={(e) => {
              setContact(e.target.value);
              setHint("");
            }}
            placeholder="Enter your phone number or email"
            className="w-full rounded-xl border border-black/[0.1] bg-background px-4 py-3 text-sm text-text-primary outline-none transition-shadow placeholder:text-text-secondary/70 focus:border-accent/40 focus:ring-2 focus:ring-accent/20"
          />
          {hint ? (
            <p className="text-sm leading-prose text-maroon" role="alert">
              {hint}
            </p>
          ) : null}
          <button
            type="button"
            disabled={loading}
            onClick={submitCallback}
            className="hover-brightness rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-card transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending…" : "Request a Call"}
          </button>
        </div>
      </div>
    </div>
  );
}
