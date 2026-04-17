"use client";

import { useMemo } from "react";
import {
  ImagePreviewProvider,
  useImagePreviewOptional,
} from "@/components/ImagePreviewProvider";
import { homeGalleryImages } from "@/lib/site-images";

function HomeGalleryMasonryInner() {
  const preview = useImagePreviewOptional();
  const items = useMemo(
    () =>
      homeGalleryImages.map((x) => ({
        src: x.src,
        alt: x.alt,
      })),
    [],
  );

  const openAt = (index: number) => {
    preview?.openGallery(items, index);
  };

  return (
    <div className="grid min-w-0 auto-rows-[minmax(180px,auto)] grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
      <div className="hover-zoom relative row-span-2 col-span-2 h-[min(420px,70vw)] overflow-hidden rounded-card border border-black/[0.05] bg-fill shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover md:col-span-1 md:h-[min(480px,55vh)]">
        <button
          type="button"
          onClick={() => openAt(0)}
          className="group absolute inset-0 block cursor-zoom-in border-0 bg-transparent p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/35"
          aria-label={`Open gallery: ${homeGalleryImages[0].alt}`}
        >
          <img
            src={homeGalleryImages[0].src}
            alt=""
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="eager"
            decoding="async"
            className="pointer-events-none h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        </button>
      </div>
      <div className="hover-zoom relative h-[200px] overflow-hidden rounded-card border border-black/[0.05] bg-fill shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:h-[220px]">
        <button
          type="button"
          onClick={() => openAt(1)}
          className="group absolute inset-0 block cursor-zoom-in border-0 bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/35"
          aria-label={`Open gallery: ${homeGalleryImages[1].alt}`}
        >
          <img
            src={homeGalleryImages[1].src}
            alt=""
            sizes="(max-width: 768px) 50vw, 25vw"
            loading="lazy"
            decoding="async"
            className="pointer-events-none h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        </button>
      </div>
      <div className="hover-zoom relative h-[200px] overflow-hidden rounded-card border border-black/[0.05] bg-fill shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:h-[220px]">
        <button
          type="button"
          onClick={() => openAt(2)}
          className="group absolute inset-0 block cursor-zoom-in border-0 bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/35"
          aria-label={`Open gallery: ${homeGalleryImages[2].alt}`}
        >
          <img
            src={homeGalleryImages[2].src}
            alt=""
            sizes="(max-width: 768px) 50vw, 25vw"
            loading="lazy"
            decoding="async"
            className="pointer-events-none h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        </button>
      </div>
      <div className="hover-zoom relative row-span-2 h-[min(420px,70vw)] overflow-hidden rounded-card border border-black/[0.05] bg-fill shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover md:h-[min(480px,55vh)]">
        <button
          type="button"
          onClick={() => openAt(3)}
          className="group absolute inset-0 block cursor-zoom-in border-0 bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/35"
          aria-label={`Open gallery: ${homeGalleryImages[3].alt}`}
        >
          <img
            src={homeGalleryImages[3].src}
            alt=""
            sizes="(max-width: 768px) 50vw, 33vw"
            loading="lazy"
            decoding="async"
            className="pointer-events-none h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        </button>
      </div>
      <div className="hover-zoom relative h-[200px] overflow-hidden rounded-card border border-black/[0.05] bg-fill shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:h-[220px]">
        <button
          type="button"
          onClick={() => openAt(4)}
          className="group absolute inset-0 block cursor-zoom-in border-0 bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/35"
          aria-label={`Open gallery: ${homeGalleryImages[4].alt}`}
        >
          <img
            src={homeGalleryImages[4].src}
            alt=""
            sizes="(max-width: 768px) 50vw, 25vw"
            loading="lazy"
            decoding="async"
            className="pointer-events-none h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        </button>
      </div>
      <div className="hover-zoom relative col-span-2 h-[220px] overflow-hidden rounded-card border border-black/[0.05] bg-fill shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover md:col-span-1 md:h-[240px]">
        <button
          type="button"
          onClick={() => openAt(5)}
          className="group absolute inset-0 block cursor-zoom-in border-0 bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/35"
          aria-label={`Open gallery: ${homeGalleryImages[5].alt}`}
        >
          <img
            src={homeGalleryImages[5].src}
            alt=""
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="lazy"
            decoding="async"
            className="pointer-events-none h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        </button>
      </div>
    </div>
  );
}

/** Own provider so preview context works (slot content is not inside `ClientShell`’s React tree). */
export function HomeGalleryMasonry() {
  return (
    <ImagePreviewProvider>
      <HomeGalleryMasonryInner />
    </ImagePreviewProvider>
  );
}
