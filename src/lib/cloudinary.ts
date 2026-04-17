/**
 * Cloudinary is optional at build time; past-event media needs
 * PUBLIC_CLOUDINARY_CLOUD_NAME (e.g. your cloud name, or `demo` for sample assets).
 * NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is still read for backwards compatibility.
 */
export function getCloudinaryCloudName(): string | undefined {
  const fromMeta =
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    typeof import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME === "string"
      ? import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME.trim()
      : "";
  if (fromMeta) return fromMeta;
  return (
    process.env.PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() ||
    undefined
  );
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(getCloudinaryCloudName());
}

/** Direct delivery URL for raw files (PDFs, etc.) */
export function cloudinaryRawUrl(cloudName: string, publicId: string): string {
  const id = encodeURIComponent(publicId).replace(/%2F/g, "/");
  return `https://res.cloudinary.com/${cloudName}/raw/upload/${id}`;
}

/** Image URL with automatic format/quality (no next-cloudinary required) */
export function cloudinaryImageUrl(
  cloudName: string,
  publicId: string,
  width?: number,
): string {
  const transform = width ? `c_limit,w_${width},q_auto,f_auto` : "q_auto,f_auto";
  const id = encodeURIComponent(publicId).replace(/%2F/g, "/");
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${id}`;
}
