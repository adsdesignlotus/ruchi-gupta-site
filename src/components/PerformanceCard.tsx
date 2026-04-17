"use client";

import { FramedImage } from "./FramedImage";
import {
  useImagePreviewOptional,
  type GalleryItem,
} from "@/components/ImagePreviewProvider";

export function PerformanceCard({
  title,
  location,
  date,
  image,
  imageAlt,
  gallery,
}: {
  title: string;
  location: string;
  date?: string;
  image: string;
  imageAlt: string;
  gallery?: { items: GalleryItem[]; index: number };
}) {
  const preview = useImagePreviewOptional();
  const safeSrc = typeof image === "string" ? image.trim() : "";
  const canOpenPreview = Boolean(preview && safeSrc);

  const openPreview = () => {
    if (!preview || !safeSrc) return;
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
    preview.open(safeSrc, imageAlt);
  };

  const ariaLabel =
    gallery && gallery.items.length > 1
      ? `Open gallery (${gallery.index + 1} of ${gallery.items.length}): ${imageAlt}`
      : `View larger: ${imageAlt}`;

  return (
    <article className="card-elevated relative flex min-w-0 flex-col">
      <div className="hover-zoom relative h-40 w-full overflow-hidden bg-fill sm:h-44 md:h-48">
        <FramedImage
          src={image}
          alt={imageAlt}
          fit="cover"
          objectPosition="top"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          gallery={gallery}
          previewable={!canOpenPreview}
        />
      </div>
      <div className="relative z-[1] flex flex-1 flex-col p-4 md:p-5">
        <h3 className="break-words font-serif text-subsection-title font-semibold tracking-heading text-text-primary">
          {title}
        </h3>
        <p className="mt-2 break-words text-sm leading-prose text-text-secondary">
          {location}
        </p>
        {date ? (
          <p className="mt-1 text-xs leading-prose text-text-secondary">{date}</p>
        ) : null}
      </div>
      {canOpenPreview ? (
        <button
          type="button"
          className="absolute inset-0 z-[2] m-0 cursor-zoom-in border-0 bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/40"
          aria-label={ariaLabel}
          onClick={openPreview}
        />
      ) : null}
    </article>
  );
}
