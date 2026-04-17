"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ImagePreviewProvider,
  useImagePreviewOptional,
} from "@/components/ImagePreviewProvider";
import { site } from "@/lib/site";

type FeedItem = {
  id: string;
  src: string;
  alt: string;
  permalink: string;
};

type ApiOk = { ok: true; items: FeedItem[]; configured: boolean };
type ApiErr = {
  ok: false;
  items?: FeedItem[];
  error?: string;
  configured: boolean;
};

function InstagramGridInner() {
  const preview = useImagePreviewOptional();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "done">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadState("loading");
    fetch("/api/instagram-feed")
      .then((r) => r.json() as Promise<ApiOk | ApiErr>)
      .then((data) => {
        if (cancelled) return;
        if (data.ok) {
          setItems(data.items);
          if (data.items.length > 0) {
            setMessage(null);
          } else if (data.configured) {
            setMessage(
              "No posts loaded yet. Check the Instagram account or API access.",
            );
          } else {
            setMessage(null);
          }
        } else {
          setItems([]);
          setMessage(
            data.error ?? "Instagram feed is not available right now.",
          );
        }
        setLoadState("done");
      })
      .catch(() => {
        if (!cancelled) {
          setItems([]);
          setMessage("Could not load Instagram.");
          setLoadState("done");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const galleryFromItems = useCallback(
    () => items.map((i) => ({ src: i.src, alt: i.alt })),
    [items],
  );

  const openAt = useCallback(
    (index: number) => {
      const g = galleryFromItems();
      if (g.length === 0) return;
      preview?.openGallery(g, index);
    },
    [galleryFromItems, preview],
  );

  if (loadState === "loading" || (loadState === "done" && items.length === 0)) {
    return (
      <div className="rounded-card border border-black/[0.06] bg-surface p-8 text-center shadow-card">
        {loadState === "loading" ? (
          <p className="text-sm text-text-secondary">Loading Instagram…</p>
        ) : (
          <>
            {message ? (
              <p className="text-sm leading-prose text-text-secondary">
                {message}
              </p>
            ) : (
              <p className="text-sm leading-prose text-text-secondary">
                The live grid appears when the Instagram feed is connected on the
                server. Until then, use the button below for the latest posts.
              </p>
            )}
            <a
              href={site.instagramProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover-brightness mt-5 inline-flex items-center justify-center rounded-lg bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#20BA5A]"
            >
              View on Instagram
            </a>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <ul className="grid min-w-0 grid-cols-2 gap-px bg-black/[0.08] sm:grid-cols-4">
        {items.map((item, index) => (
          <li key={item.id} className="relative aspect-square bg-fill">
            <button
              type="button"
              onClick={() => openAt(index)}
              className="group absolute inset-0 block overflow-hidden border-0 bg-fill p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2"
              aria-label={`Open preview: ${item.alt || "Instagram photo"}`}
            >
              <img
                src={item.src}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">
                <span className="scale-95 opacity-0 transition group-hover:scale-100 group-hover:opacity-100">
                  <span className="rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-text-primary shadow-md">
                    Preview
                  </span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-center text-xs leading-prose text-text-secondary">
        Tap a photo to enlarge.{" "}
        <a
          href={site.instagramProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline-offset-2 hover:underline"
        >
          {site.instagramHandle}
        </a>{" "}
        on Instagram
      </p>
    </>
  );
}

/** Own provider so lightbox works outside `ClientShell`’s React tree (same pattern as home gallery). */
export function InstagramFeed() {
  return (
    <ImagePreviewProvider>
      <InstagramGridInner />
    </ImagePreviewProvider>
  );
}
