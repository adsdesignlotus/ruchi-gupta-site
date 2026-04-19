"use client";

import { useEffect, useState } from "react";

type ApiOk =
  | { ok: true; visible: false }
  | {
      ok: true;
      visible: true;
      googleDriveUrl: string | null;
      cloudinaryUrl: string | null;
    };

export function EventExternalPhotoLinks({ slug }: { slug: string }) {
  const [data, setData] = useState<ApiOk | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(
          `/api/public/event-photos?slug=${encodeURIComponent(slug)}`,
        );
        const j = (await r.json()) as ApiOk & { ok?: boolean };
        if (!cancelled && j && j.ok === true) setData(j);
      } catch {
        if (!cancelled) setData(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!data || !data.visible) return null;
  const drive = data.googleDriveUrl;
  const cloud = data.cloudinaryUrl;
  if (!drive && !cloud) return null;

  return (
    <section
      className="mt-10 border-t border-black/[0.06] pt-10 md:mt-12 md:pt-12"
      aria-labelledby={`external-photos-${slug}`}
    >
      <h2
        id={`external-photos-${slug}`}
        className="font-serif text-content-title font-semibold tracking-heading text-text-primary"
      >
        More photos
      </h2>
      <p className="mt-3 max-w-reading text-left text-sm leading-relaxed text-text-secondary md:text-base">
        Full albums and high-resolution stills (when shared for this event).
      </p>
      <ul className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {drive ? (
          <li>
            <a
              href={drive}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center rounded border border-black/[0.08] bg-background px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-accent hover:text-accent"
            >
              View on Google Drive
            </a>
          </li>
        ) : null}
        {cloud ? (
          <li>
            <a
              href={cloud}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center rounded border border-black/[0.08] bg-background px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-accent hover:text-accent"
            >
              Cloudinary gallery
            </a>
          </li>
        ) : null}
      </ul>
    </section>
  );
}
