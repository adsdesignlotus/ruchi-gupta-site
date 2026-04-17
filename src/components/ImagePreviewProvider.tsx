"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

export type GalleryItem = { src: string; alt: string };

type PreviewState = {
  items: GalleryItem[];
  index: number;
};

export type ImagePreviewApi = {
  open: (src: string, alt: string) => void;
  openGallery: (items: GalleryItem[], startIndex?: number) => void;
  close: () => void;
};

const ImagePreviewContext = createContext<ImagePreviewApi | null>(null);

export function useImagePreviewOptional() {
  return useContext(ImagePreviewContext);
}

export function ImagePreviewProvider({
  children,
}: {
  children: ReactNode | ((api: ImagePreviewApi) => ReactNode);
}) {
  const [active, setActive] = useState<PreviewState | null>(null);

  const close = useCallback(() => {
    setActive(null);
  }, []);

  const open = useCallback((src: string, alt: string) => {
    const s = typeof src === "string" ? src.trim() : "";
    if (!s) return;
    setActive({ items: [{ src: s, alt: alt || "" }], index: 0 });
  }, []);

  const openGallery = useCallback((items: GalleryItem[], startIndex = 0) => {
    const cleaned = items
      .map((x) => ({
        src: typeof x?.src === "string" ? x.src.trim() : "",
        alt: x?.alt || "",
      }))
      .filter((x) => x.src.length > 0);
    if (cleaned.length === 0) return;
    const index = Math.max(0, Math.min(startIndex, cleaned.length - 1));
    setActive({ items: cleaned, index });
  }, []);

  const goPrev = useCallback(() => {
    setActive((a) => {
      if (!a || a.items.length < 2) return a;
      return {
        ...a,
        index: (a.index - 1 + a.items.length) % a.items.length,
      };
    });
  }, []);

  const goNext = useCallback(() => {
    setActive((a) => {
      if (!a || a.items.length < 2) return a;
      return {
        ...a,
        index: (a.index + 1) % a.items.length,
      };
    });
  }, []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (active.items.length < 2) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    if (typeof window === "undefined") return;
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, goPrev, goNext]);

  useEffect(() => {
    if (!active || typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  const safeIndex =
    active && active.items.length > 0
      ? Math.min(Math.max(0, active.index), active.items.length - 1)
      : 0;
  const current = active?.items[safeIndex];
  const multi = active && active.items.length > 1;

  const overlay =
    active && current ? (
      <div
        className="fixed inset-0 z-[9999] flex min-h-dvh touch-manipulation items-center justify-center overscroll-contain bg-black/85 p-4"
        role="dialog"
        aria-modal="true"
        aria-label={
          current.alt ? `Photo preview: ${current.alt}` : "Photo preview"
        }
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="relative flex w-full max-w-[min(96vw,1240px)] max-h-[min(92dvh,940px)] flex-col items-center px-1 sm:px-0">
          <div className="mb-2 flex w-full items-center justify-between gap-3 px-1 text-white/90">
            <button
              type="button"
              onClick={close}
              className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium transition hover:bg-white/20"
            >
              Close
            </button>
            <span className="text-sm tabular-nums">
              {safeIndex + 1} / {active.items.length}
            </span>
          </div>

          <div className="relative flex min-h-0 min-w-0 flex-col items-center">
            {multi ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="hover-brightness absolute left-0.5 top-1/2 z-10 -translate-y-1/2 rounded-full bg-primary/90 px-2 py-2.5 text-base font-semibold text-white shadow-card sm:left-0 sm:px-3.5 sm:py-3 sm:text-lg"
                aria-label="Previous image"
              >
                ‹
              </button>
            ) : null}
            {multi ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="hover-brightness absolute right-0.5 top-1/2 z-10 -translate-y-1/2 rounded-full bg-primary/90 px-2 py-2.5 text-base font-semibold text-white shadow-card sm:right-0 sm:px-3.5 sm:py-3 sm:text-lg"
                aria-label="Next image"
              >
                ›
              </button>
            ) : null}
            <img
              src={current.src}
              alt={current.alt}
              className={cn(
                "max-h-[min(75dvh,860px)] w-auto max-w-[min(92vw,1100px)] object-contain shadow-2xl",
                multi && "px-8 sm:px-14",
              )}
            />
            {current.alt ? (
              <p className="mt-3 max-w-2xl px-4 text-center text-sm text-white/85">
                {current.alt}
              </p>
            ) : null}
          </div>

          <p className="mt-3 text-center text-xs text-white/60">
            {multi
              ? "‹ › or arrow keys · Escape or backdrop to close"
              : "Escape or backdrop to close"}
          </p>
        </div>
      </div>
    ) : null;

  const api = useMemo(
    () => ({ open, openGallery, close }),
    [open, openGallery, close],
  );

  return (
    <ImagePreviewContext.Provider value={api}>
      {typeof children === "function" ? children(api) : children}
      {overlay && typeof document !== "undefined"
        ? createPortal(overlay, document.body)
        : null}
    </ImagePreviewContext.Provider>
  );
}
