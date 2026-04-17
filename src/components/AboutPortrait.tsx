"use client";

import { FramedImage } from "@/components/FramedImage";
import { ImagePreviewProvider } from "@/components/ImagePreviewProvider";

export function AboutPortrait({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <ImagePreviewProvider>
      <div className="hover-zoom relative aspect-[4/5] max-w-sm overflow-hidden rounded-card border border-black/[0.06] bg-fill shadow-card">
        <FramedImage
          src={src}
          alt={alt}
          sizes="(max-width: 1024px) 100vw, 400px"
        />
      </div>
    </ImagePreviewProvider>
  );
}
