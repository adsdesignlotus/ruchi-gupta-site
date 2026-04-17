/**
 * Past Nrityarchitum festivals: gallery (invitations), optional performance photos.
 * Images can be served from `public/` (`localSrc`) and/or Cloudinary (`publicId`).
 */

/** Invitation or material (image or hosted raw file on Cloudinary) */
export type PastInviteArtifact =
  | {
      label: string;
      resourceType: "image";
      /** Path under `public/`, e.g. `/past-events/nrityarchitum-2024-invite.png` */
      localSrc: string;
    }
  | {
      label: string;
      resourceType: "image";
      publicId: string;
    }
  | {
      label: string;
      resourceType: "raw";
      publicId: string;
    };

export type PastSlideshowSlide =
  | { alt: string; localSrc: string }
  | { alt: string; publicId: string };

export type PastEventDetail = {
  slug: string;
  title: string;
  description: string;
  metaTitle: string;
  badge: "Past";
  when: string;
  whenIso: string;
  city: string;
  summary: string;
  /**
   * Invitation and related images — `#gallery` on the event page (same lightbox
   * as elsewhere). Append `{ localSrc, alt }` or `{ publicId, alt }` as you add files.
   */
  gallery: PastSlideshowSlide[];
  invites: PastInviteArtifact[];
  /** Performance and behind-the-scenes photos (excludes invitation art) */
  slideshow: PastSlideshowSlide[];
};

export const pastEventsBySlug: Record<string, PastEventDetail> = {
  "nrityarchitum-16-2024": {
    slug: "nrityarchitum-16-2024",
    title: '16th "Nrityarchitum" — Annual Music & Dance Festival',
    description:
      "The 16th Nrityarchitum at Delhi Karnataka Sangha featured Kirti Natya Niketan students in Bharatanatyam with live orchestra, with distinguished guests from culture and the arts.",
    metaTitle:
      '16th Nrityarchitum (2024) — Annual Music & Dance Festival | Ruchi Gupta',
    badge: "Past",
    when: "31 August 2024",
    whenIso: "2024-08-31",
    city: "Delhi Karnataka Sangha, RK Puram, Delhi",
    summary:
      "Evening showcase by disciples of Guru Kalashree Ruchi Gupta — classical repertoire, ensemble work, and live music.",
    gallery: [
      {
        localSrc: "/past-events/nrityarchitum-2024-collage.png",
        alt: "Nrityarchitum 2024 — 16th Annual Music & Dance Festival poster by Kirti Natya Niketan, diamond collage of dancers and event details, 31 August 2024 at Delhi Karnataka Sangha",
      },
      {
        localSrc: "/past-events/nrityarchitum-2024-invite.png",
        alt: "Formal invitation for the 16th Nrityarchitum, annual Bharatanatyam showcase by Kirti Natya Niketan on 31 August 2024 at Delhi Karnataka Sangha",
      },
    ],
    invites: [
      {
        label: "Formal invitation",
        resourceType: "image",
        localSrc: "/past-events/nrityarchitum-2024-invite.png",
      },
      {
        label: "Festival poster — collage",
        resourceType: "image",
        localSrc: "/past-events/nrityarchitum-2024-collage.png",
      },
    ],
    slideshow: [],
  },
  "nrityarchitum-15-2023": {
    slug: "nrityarchitum-15-2023",
    title: "15th Nrityarchitum — Annual Classical Music & Dance Festival",
    description:
      "The 15th Nrityarchitum presented a Bharatanatyam programme with live orchestra by disciples of Kalashree Ruchi Gupta, with Padmabhushan Guru Dr. Saroja Vaidyanathan as Chief Guest.",
    metaTitle:
      "15th Nrityarchitum (2023) — Annual Classical Music & Dance Festival | Ruchi Gupta",
    badge: "Past",
    when: "14 April 2023",
    whenIso: "2023-04-14",
    city: "Delhi Karnataka Sangha, RK Puram, Delhi",
    summary:
      "Classical presentation with live orchestra; chief and honourable guests; open to rasikas at Delhi Karnataka Sangha.",
    gallery: [
      {
        localSrc: "/past-events/nrityarchitum-2023-collage.png",
        alt: "Nrityarchitum 2023 — 15th Annual Music & Dance Festival poster by Kirti Natya Niketan, diamond collage of dancers on a soft lavender background",
      },
      {
        localSrc: "/past-events/nrityarchitum-2023-invite.png",
        alt: "Formal invitation for the 15th Nrityarchitum 2023 classical music and dance festival, forest green and gold, Delhi Karnataka Sangha, 14 April 2023",
      },
    ],
    invites: [
      {
        label: "Formal invitation",
        resourceType: "image",
        localSrc: "/past-events/nrityarchitum-2023-invite.png",
      },
      {
        label: "Festival poster — collage",
        resourceType: "image",
        localSrc: "/past-events/nrityarchitum-2023-collage.png",
      },
    ],
    slideshow: [
      {
        localSrc: "/past-events/nrityarchitum-2023-gallery-01-group-stage.png",
        alt:
          "15th Nrityarchitum 2023 — group photograph after the awards ceremony: young Bharatanatyam dancers in traditional costume with certificates and trophies, mentors and guests standing behind, Delhi Karnataka Sangha",
      },
      {
        localSrc: "/past-events/nrityarchitum-2023-gallery-02-ensemble.png",
        alt:
          "15th Nrityarchitum 2023 — Bharatanatyam ensemble on stage: students in vibrant silks and temple jewellery in choreographed formation, wooden stage with scattered flower petals",
      },
      {
        localSrc: "/past-events/nrityarchitum-2023-gallery-03-altar-rangoli.png",
        alt:
          "15th Nrityarchitum 2023 — ceremonial altar with Ganesha, brass lamps, fruit offerings, rangoli on the stage floor, and the printed festival programme for 14 April 2023 at Delhi Karnataka Sangha",
      },
    ],
  },
};

/** First gallery / invite image for listing cards */
function inviteImageForEvent(e: PastEventDetail): {
  inviteLocalSrc?: string;
  invitePublicId?: string;
} {
  const g0 = e.gallery[0];
  if (g0) {
    if ("localSrc" in g0) return { inviteLocalSrc: g0.localSrc };
    return { invitePublicId: g0.publicId };
  }
  const invite = e.invites.find((inv) => inv.resourceType === "image");
  if (!invite) return {};
  if ("localSrc" in invite) return { inviteLocalSrc: invite.localSrc };
  return { invitePublicId: invite.publicId };
}

export const pastEventsList = Object.values(pastEventsBySlug)
  .map((e) => ({
    slug: e.slug,
    title: e.title,
    when: e.when,
    whenIso: e.whenIso,
    city: e.city,
    summary: e.summary,
    ...inviteImageForEvent(e),
  }))
  .sort((a, b) => {
    const ae = pastEventsBySlug[a.slug]!;
    const be = pastEventsBySlug[b.slug]!;
    return be.whenIso.localeCompare(ae.whenIso);
  });
