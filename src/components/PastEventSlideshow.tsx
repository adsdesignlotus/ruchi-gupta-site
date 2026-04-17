"use client";

import { useMemo } from "react";
import type { PastSlideshowSlide } from "@/lib/past-events";
import { cloudinaryImageUrl } from "@/lib/cloudinary";
import {
  useImagePreviewOptional,
  type ImagePreviewApi,
} from "@/components/ImagePreviewProvider";

function slideSrc(
  slide: PastSlideshowSlide,
  cloudName: string | undefined,
): string | null {
  if ("localSrc" in slide) return slide.localSrc;
  if (!cloudName) return null;
  return cloudinaryImageUrl(cloudName, slide.publicId, 2400);
}

export function PastEventSlideshow({
  slides,
  cloudName,
  preview: previewProp,
}: {
  slides: PastSlideshowSlide[];
  cloudName: string | undefined;
  /** When set (e.g. from a render prop), avoids relying on context across nested islands. */
  preview?: ImagePreviewApi | null;
}) {
  const preview = previewProp ?? useImagePreviewOptional();

  const { galleryItems, cells } = useMemo(() => {
    const cells: {
      slide: PastSlideshowSlide;
      galleryIndex: number;
      key: string;
    }[] = [];
    const galleryItems: { src: string; alt: string }[] = [];
    slides.forEach((s, i) => {
      const src = slideSrc(s, cloudName);
      if (!src) return;
      const key = `${"localSrc" in s ? s.localSrc : s.publicId}-${i}`;
      const galleryIndex = galleryItems.length;
      galleryItems.push({ src, alt: s.alt });
      cells.push({ slide: s, galleryIndex, key });
    });
    return { galleryItems, cells };
  }, [slides, cloudName]);

  const needsCloud = slides.some((s) => "publicId" in s);
  if (needsCloud && !cloudName) {
    return (
      <div className="rounded-card border border-dashed border-black/[0.12] bg-surface p-card text-center text-sm leading-prose text-text-secondary shadow-card">
        Add{" "}
        <code className="rounded bg-background px-1.5 py-0.5 text-text-primary">
          PUBLIC_CLOUDINARY_CLOUD_NAME
        </code>{" "}
        for Cloudinary slides in this gallery.
      </div>
    );
  }

  if (cells.length === 0) return null;

  return (
    <div className="space-y-5">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-4">
        {cells.map(({ slide: s, galleryIndex, key }) => (
          <li key={key}>
            <button
              type="button"
              onClick={() => preview?.openGallery(galleryItems, galleryIndex)}
              className="group relative aspect-[4/3] w-full overflow-hidden rounded-card border border-black/[0.05] bg-fill shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/35"
              aria-label={`Open gallery: ${s.alt}`}
            >
              <span className="absolute inset-0 block overflow-hidden">
                {"localSrc" in s ? (
                  <img
                    src={s.localSrc}
                    alt=""
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 360px"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                  />
                ) : (
                  <img
                    src={cloudinaryImageUrl(cloudName!, s.publicId, 900)}
                    alt=""
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 360px"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                  />
                )}
              </span>
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-2 py-2 text-left text-[11px] leading-prose text-white line-clamp-2 md:text-xs">
                {s.alt}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="text-center text-xs leading-prose text-text-secondary">
        Tap a photo for full screen. Use ‹ › or arrow keys in the preview to move
        between images.
      </p>
    </div>
  );
}
