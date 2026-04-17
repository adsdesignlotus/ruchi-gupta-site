/** Minimal email shape — enough for callback UX, not full RFC. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  const v = value.trim();
  return v.length > 0 && EMAIL_RE.test(v);
}

/** At least 10 digits (international numbers with country code OK). */
export function isValidPhoneDigits(value: string): boolean {
  const digits = (value.match(/\d/g) ?? []).length;
  return digits >= 10;
}

export function isValidContact(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  if (v.includes("@")) return isValidEmail(v);
  return isValidPhoneDigits(v);
}

export function contactValidationHint(value: string): string {
  const v = value.trim();
  if (!v) return "Enter your phone number or email.";
  if (v.includes("@") && !isValidEmail(v)) return "Enter a valid email address.";
  if (!v.includes("@") && !isValidPhoneDigits(v)) {
    return "Enter a valid phone number (at least 10 digits) or a valid email.";
  }
  return "";
}
