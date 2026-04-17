"use client";

import { cn } from "@/lib/cn";
import {
  useImagePreviewOptional,
  type GalleryItem,
} from "@/components/ImagePreviewProvider";

/**
 * Fills a frame: default `contain` letterboxes; `cover` crops to avoid empty bands.
 * Parent should set the frame size (e.g. aspect-square, aspect-video, or fixed height).
 * When `ImagePreviewProvider` is present, clicking opens a full-screen overlay (same tab).
 */
export function FramedImage({
  src,
  alt,
  className,
  imgClassName,
  sizes,
  priority,
  previewable = true,
  gallery,
  fit = "contain",
}: {
  /** Public path or absolute URL; empty string renders a placeholder instead of crashing */
  src: string;
  alt: string;
  /** Classes on the positioning wrapper (use absolute inset-0 inside a relative parent) */
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Set false to disable lightbox (e.g. decorative-only). Default true. */
  previewable?: boolean;
  /** When set, opens the preview as a group (next/prev within `items`). */
  gallery?: { items: GalleryItem[]; index: number };
  /** `cover` fills the frame (crops); `contain` shows full image (may letterbox). */
  fit?: "contain" | "cover";
}) {
  const preview = useImagePreviewOptional();
  const canPreview = Boolean(preview && previewable);
  const safeSrc = typeof src === "string" ? src.trim() : "";

  if (!safeSrc) {
    return (
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-fill px-3 text-center text-xs text-text-secondary",
          className,
        )}
      >
        Missing image
      </div>
    );
  }

  const openPreview = () => {
    if (!preview) return;
    if (gallery?.items?.length) {
      const cleaned = gallery.items
        .map((x) => ({
          src: typeof x?.src === "string" ? x.src.trim() : "",
          alt: x?.alt || "",
        }))
        .filter((x) => x.src.length > 0);
      if (cleaned.length === 0) return;
      const i = Math.max(0, Math.min(gallery.index, cleaned.length - 1));
      preview.openGallery(cleaned, i);
      return;
    }
    preview.open(safeSrc, alt);
  };

  return (
    <div
      className={cn(
        "absolute inset-0 bg-fill",
        canPreview && "cursor-zoom-in",
        className,
      )}
    >
      {canPreview ? (
        <button
          type="button"
          className="absolute inset-0 z-10 m-0 border-0 bg-transparent p-0"
          aria-label={
            gallery && gallery.items.length > 1
              ? `Open gallery (${gallery.index + 1} of ${gallery.items.length}): ${alt}`
              : `View larger: ${alt}`
          }
          onClick={openPreview}
        />
      ) : null}
      <img
        src={safeSrc}
        alt={alt}
        sizes={sizes ?? "(max-width: 768px) 100vw, 400px"}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full object-center",
          fit === "cover" ? "object-cover" : "object-contain",
          imgClassName,
        )}
      />
    </div>
  );
}
