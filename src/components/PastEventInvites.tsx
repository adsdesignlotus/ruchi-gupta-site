"use client";

import { useMemo } from "react";
import type { PastInviteArtifact } from "@/lib/past-events";
import { cloudinaryImageUrl, cloudinaryRawUrl } from "@/lib/cloudinary";
import {
  useImagePreviewOptional,
  type ImagePreviewApi,
} from "@/components/ImagePreviewProvider";

export function PastEventInvites({
  invites,
  cloudName,
  preview: previewProp,
}: {
  invites: PastInviteArtifact[];
  cloudName: string | undefined;
  preview?: ImagePreviewApi | null;
}) {
  const preview = previewProp ?? useImagePreviewOptional();

  const { galleryItems, galleryIndexByInviteIndex } = useMemo(() => {
    const galleryItems: { src: string; alt: string }[] = [];
    const galleryIndexByInviteIndex = new Map<number, number>();

    invites.forEach((inv, inviteIndex) => {
      if (inv.resourceType !== "image") return;
      const fullSrc =
        "localSrc" in inv
          ? inv.localSrc
          : cloudName
            ? cloudinaryImageUrl(cloudName, inv.publicId, 2400)
            : "";
      if (!fullSrc) return;
      galleryIndexByInviteIndex.set(inviteIndex, galleryItems.length);
      galleryItems.push({ src: fullSrc, alt: inv.label });
    });

    return { galleryItems, galleryIndexByInviteIndex };
  }, [invites, cloudName]);

  if (invites.length === 0) return null;

  const needsCloud = invites.some(
    (inv) =>
      inv.resourceType === "raw" ||
      (inv.resourceType === "image" && "publicId" in inv),
  );

  if (needsCloud && !cloudName) {
    return (
      <p className="text-sm leading-prose text-text-secondary">
        Add{" "}
        <code className="mx-1 rounded bg-section px-1.5 py-0.5 text-text-primary">
          PUBLIC_CLOUDINARY_CLOUD_NAME
        </code>{" "}
        for Cloudinary-hosted items in this list.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2">
      {invites.map((inv, inviteIndex) => {
        if (inv.resourceType === "raw") {
          const href = cloudinaryRawUrl(cloudName!, inv.publicId);
          return (
            <li key={`${inviteIndex}-${inv.label}`}>
              <a
                href={href}
                className="group card-elevated flex flex-col"
                download
              >
                <div className="flex aspect-[3/4] flex-col items-center justify-center gap-2 bg-fill p-card text-center">
                  <span className="type-accent-italic text-lg text-accent">PDF</span>
                  <span className="text-sm leading-prose text-text-secondary">
                    {inv.label} — download
                  </span>
                </div>
              </a>
            </li>
          );
        }

        const src =
          "localSrc" in inv
            ? inv.localSrc
            : cloudinaryImageUrl(cloudName!, inv.publicId, 2400);
        const thumbSrc =
          "localSrc" in inv
            ? inv.localSrc
            : cloudinaryImageUrl(cloudName!, inv.publicId, 1200);

        const galleryIndex = galleryIndexByInviteIndex.get(inviteIndex);

        return (
          <li key={`${inviteIndex}-${inv.label}`}>
            <button
              type="button"
              className="group card-elevated flex w-full flex-col text-left"
              onClick={() =>
                galleryIndex !== undefined && galleryItems.length > 0
                  ? preview?.openGallery(galleryItems, galleryIndex)
                  : preview?.open(src, inv.label)
              }
            >
              <div className="relative h-40 w-full overflow-hidden bg-fill sm:h-44">
                {"localSrc" in inv ? (
                  <img
                    src={inv.localSrc}
                    alt={inv.label}
                    width={800}
                    height={1067}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <img
                    src={thumbSrc}
                    alt={inv.label}
                    width={800}
                    height={1067}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-center"
                  />
                )}
              </div>
              <p className="border-t border-black/[0.05] p-3 text-xs font-semibold leading-snug text-text-primary transition-colors group-hover:text-accent sm:p-4 sm:text-sm">
                {inv.label} — tap to enlarge
              </p>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
