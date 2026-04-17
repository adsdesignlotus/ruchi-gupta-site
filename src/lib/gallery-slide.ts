import { cloudinaryImageUrl } from "@/lib/cloudinary";
import type { PastSlideshowSlide } from "@/lib/past-events";

export function resolveGallerySlideSrc(
  slide: PastSlideshowSlide,
  cloudName: string | undefined,
): string | null {
  if ("localSrc" in slide && typeof slide.localSrc === "string") {
    return slide.localSrc;
  }
  if ("publicId" in slide && typeof slide.publicId === "string") {
    if (!cloudName) return null;
    return cloudinaryImageUrl(cloudName, slide.publicId, 2400);
  }
  return null;
}

/** Thumbnail URL for grid tiles (narrower Cloudinary transform). */
export function resolveGalleryThumbSrc(
  slide: PastSlideshowSlide,
  cloudName: string | undefined,
): string | null {
  if ("localSrc" in slide && typeof slide.localSrc === "string") {
    return slide.localSrc;
  }
  if ("publicId" in slide && typeof slide.publicId === "string") {
    if (!cloudName) return null;
    return cloudinaryImageUrl(cloudName, slide.publicId, 900);
  }
  return null;
}
