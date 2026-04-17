/**
 * Workshops listed under the Events hub “Workshop” tab.
 * Each entry has its own `/events/[slug]` page (same route as other event types).
 */

import type { PastSlideshowSlide } from "@/lib/past-events";
import { photos } from "@/lib/site-images";

export type WorkshopEventDetail = {
  slug: string;
  title: string;
  description: string;
  metaTitle: string;
  badge: "Workshop";
  when: string;
  whenIso: string;
  city: string;
  summary: string;
  /** Invitations, flyers, and other materials */
  gallery: PastSlideshowSlide[];
  /** Session photos and documentation (optional) */
  photos: PastSlideshowSlide[];
};

export const workshopsBySlug: Record<string, WorkshopEventDetail> = {
  "knn-workshop-2026": {
    slug: "knn-workshop-2026",
    title: "Classical technique workshops — Kirti Natya Niketan",
    description:
      "Focused Bharatanatyam workshops for students and rasikas. Schedules and registration open closer to each session.",
    metaTitle: "Classical dance workshops — Kirti Natya Niketan | Ruchi Gupta",
    badge: "Workshop",
    when: "Dates TBA",
    whenIso: "",
    city: "Delhi",
    summary:
      "Half-day and weekend intensives on technique, repertoire, and theory with the KNN faculty. Watch this space for the next announced dates.",
    gallery: [
      {
        localSrc: photos.p02,
        alt: "Bharatanatyam workshop — classical pose and studio setting",
      },
    ],
    photos: [
      {
        localSrc: photos.p05,
        alt: "Workshop — students in rehearsal with live music",
      },
    ],
  },
};

function coverForWorkshop(w: WorkshopEventDetail): {
  coverSrc?: string;
  coverPublicId?: string;
} {
  const g0 = w.gallery[0];
  if (!g0) return {};
  if ("localSrc" in g0) return { coverSrc: g0.localSrc };
  return { coverPublicId: g0.publicId };
}

export const workshopsList = Object.values(workshopsBySlug)
  .map((w) => ({
    slug: w.slug,
    title: w.title,
    when: w.when,
    whenIso: w.whenIso,
    city: w.city,
    summary: w.summary,
    ...coverForWorkshop(w),
  }))
  .sort((a, b) => {
    if (!a.whenIso && !b.whenIso) return 0;
    if (!a.whenIso) return 1;
    if (!b.whenIso) return -1;
    return a.whenIso.localeCompare(b.whenIso);
  });
