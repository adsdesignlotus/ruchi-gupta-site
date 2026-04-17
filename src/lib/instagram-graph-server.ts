/**
 * Instagram Graph API (server only).
 *
 * Setup (Meta Developer + Facebook Page linked to the Instagram professional account):
 * 1. Create a Meta app → add **Instagram** product.
 * 2. Link the Instagram account (@ruchi_dancer_gupta) to a **Facebook Page**
 *    (e.g. https://www.facebook.com/ganapatibapamorya/).
 * 3. Generate a **long-lived Page access token** (Graph API Explorer or System User)
 *    with permissions such as: `instagram_basic`, `pages_show_list`,
 *    `pages_read_engagement` (exact names depend on your app type — use Meta’s token debugger).
 * 4. Env (server only, never `PUBLIC_`):
 *    - `INSTAGRAM_ACCESS_TOKEN` — Page access token that can read the Page’s IG account.
 *    - `INSTAGRAM_USER_ID` — Instagram Business Account ID (optional if you set page id).
 *    - `FACEBOOK_PAGE_ID` — Numeric Page id; used with `?fields=instagram_business_account`
 *      when `INSTAGRAM_USER_ID` is omitted.
 *    - `INSTAGRAM_MEDIA_LIMIT` — optional, default 12, max 24.
 *
 * Docs: https://developers.facebook.com/docs/instagram-api/guides/content-publishing
 * (media listing uses the same Graph host with `/{ig-user-id}/media`).
 */

const GRAPH = "https://graph.facebook.com/v21.0";

type RawChild = { media_url?: string; media_type?: string };
type RawMedia = {
  id: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  children?: { data?: RawChild[] };
};

export type InstagramFeedItem = {
  id: string;
  src: string;
  alt: string;
  permalink: string;
  mediaType: string;
};

async function fetchJson<T>(url: string): Promise<{ ok: true; data: T } | { ok: false; text: string; status: number }> {
  const res = await fetch(url);
  const text = await res.text();
  let data: T;
  try {
    data = JSON.parse(text) as T;
  } catch {
    return { ok: false, text, status: res.status };
  }
  if (!res.ok) {
    return { ok: false, text, status: res.status };
  }
  return { ok: true, data };
}

async function resolveInstagramUserId(
  token: string,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const explicit = process.env.INSTAGRAM_USER_ID?.trim();
  if (explicit) {
    return { ok: true, id: explicit };
  }

  const pageId = process.env.FACEBOOK_PAGE_ID?.trim();
  if (!pageId) {
    return {
      ok: false,
      error:
        "Set INSTAGRAM_USER_ID, or FACEBOOK_PAGE_ID (with Page token) to discover the linked Instagram account.",
    };
  }

  const url = `${GRAPH}/${pageId}?fields=instagram_business_account&access_token=${encodeURIComponent(token)}`;
  const result = await fetchJson<{
    instagram_business_account?: { id?: string };
    error?: { message: string };
  }>(url);

  if (!result.ok) {
    return {
      ok: false,
      error: `Could not read Facebook Page (${result.status}). ${result.text.slice(0, 200)}`,
    };
  }

  const id = result.data.instagram_business_account?.id;
  if (!id) {
    return {
      ok: false,
      error:
        "This Facebook Page has no linked Instagram Business/Creator account. Link it in Page settings → Instagram.",
    };
  }

  if (result.data.error?.message) {
    return { ok: false, error: result.data.error.message };
  }

  return { ok: true, id };
}

function pickDisplaySrc(m: RawMedia): string | null {
  const type = m.media_type ?? "";
  if (type === "VIDEO") {
    return m.thumbnail_url || m.media_url || null;
  }
  if (type === "CAROUSEL_ALBUM") {
    const kids = m.children?.data ?? [];
    const firstImage = kids.find((c) => c.media_type === "IMAGE");
    if (firstImage?.media_url) return firstImage.media_url;
    return m.media_url || m.thumbnail_url || null;
  }
  return m.media_url || m.thumbnail_url || null;
}

function normalizeItems(raw: RawMedia[]): InstagramFeedItem[] {
  const out: InstagramFeedItem[] = [];
  for (const m of raw) {
    const src = pickDisplaySrc(m);
    if (!src || !m.permalink) continue;
    const caption = (m.caption ?? "").trim();
    const alt = caption ? caption.slice(0, 220) : "Instagram post";
    out.push({
      id: m.id,
      src,
      alt,
      permalink: m.permalink,
      mediaType: m.media_type ?? "UNKNOWN",
    });
  }
  return out;
}

export type InstagramFetchResult =
  | { ok: true; items: InstagramFeedItem[]; configured: boolean }
  | { ok: false; error: string; configured: boolean };

export async function fetchInstagramFeed(): Promise<InstagramFetchResult> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  /** No token is normal for local dev — UI shows profile link, not an error. */
  if (!token) {
    return { ok: true, items: [], configured: false };
  }

  const resolved = await resolveInstagramUserId(token);
  if (!resolved.ok) {
    return { ok: false, error: resolved.error, configured: true };
  }

  const limitRaw = parseInt(process.env.INSTAGRAM_MEDIA_LIMIT ?? "12", 10);
  const limit = Number.isFinite(limitRaw)
    ? Math.min(24, Math.max(1, limitRaw))
    : 12;

  const fields = [
    "id",
    "caption",
    "media_type",
    "media_url",
    "permalink",
    "thumbnail_url",
    "timestamp",
    "children{media_url,media_type}",
  ].join(",");

  const listUrl = `${GRAPH}/${resolved.id}/media?fields=${fields}&limit=${limit}&access_token=${encodeURIComponent(token)}`;

  const listResult = await fetchJson<{
    data?: RawMedia[];
    error?: { message: string };
  }>(listUrl);

  if (!listResult.ok) {
    return {
      ok: false,
      error: `Instagram media request failed (${listResult.status}). ${listResult.text.slice(0, 240)}`,
      configured: true,
    };
  }

  if (listResult.data.error?.message) {
    return { ok: false, error: listResult.data.error.message, configured: true };
  }

  const items = normalizeItems(listResult.data.data ?? []);
  if (items.length === 0) {
    return {
      ok: false,
      error: "No displayable media returned (check account or token permissions).",
      configured: true,
    };
  }

  return { ok: true, items, configured: true };
}
