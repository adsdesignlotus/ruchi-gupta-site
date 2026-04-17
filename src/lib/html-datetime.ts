/**
 * Whether `value` is safe for <time dateTime={...}> (parses to a real instant).
 * Rejects empty strings and non-dates to avoid invalid HTML / hydration issues.
 */
export function isValidHtmlDateTime(value: string | undefined | null): boolean {
  if (value == null || typeof value !== "string") return false;
  const v = value.trim();
  if (v === "") return false;
  const ms = Date.parse(v);
  return Number.isFinite(ms);
}
