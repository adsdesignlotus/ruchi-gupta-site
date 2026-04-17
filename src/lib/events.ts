import type { PastSlideshowSlide } from "@/lib/past-events";

export type EventDetail = {
  slug: string;
  title: string;
  /** Optional line under the main title (e.g. theme name) */
  subtitle?: string;
  /** Detail page + Events hub cover when set (public URL under `/public`) */
  heroImage?: { src: string; alt: string };
  /** Same shape as past events — local paths and/or Cloudinary `publicId` */
  slideshow?: PastSlideshowSlide[];
  description: string;
  metaTitle: string;
  badge: string;
  when: string;
  whenIso: string;
  city: string;
  aboutTitle: string;
  aboutBody: string;
  programmeIntro: string;
  /** Section title above the programme list (defaults to “Programme” in the UI) */
  programmeHeading?: string;
  programmeItems: { title: string; body: string }[];
  creditsIntro: string;
  /** Section title above the credits list (defaults to “Credits” in the UI) */
  creditsHeading?: string;
  credits: { label: string; value: string }[];
};

export const eventsBySlug: Record<string, EventDetail> = {
  "nrityarchitum-18-2026": {
    slug: "nrityarchitum-18-2026",
    title: "18th Nrityarchitum",
    subtitle: "Shubham Karoti Kalyanam",
    heroImage: {
      src: "/events/nrityarchitum-18-2026/cover.png",
      alt: "18th Nrityarchitum — Shubham Karoti Kalyanam — Kirti Natya Niketan; classical Bharatanatyam performance poster",
    },
    slideshow: [
      {
        localSrc: "/events/nrityarchitum-18-2026/cover.png",
        alt: "18th Nrityarchitum — Shubham Karoti Kalyanam — event poster",
      },
      {
        localSrc: "/events/nrityarchitum-18-2026/poster.png",
        alt: "NRITYACHITUM 2026 — ensemble collage and performance moments",
      },
    ],
    description: "A Celebration of Devotion through Dance",
    metaTitle:
      "18th Nrityarchitum — 26th April 2026, Delhi — Shubham Karoti Kalyanam | Ruchi Gupta",
    badge: "Upcoming",
    when: "26th April 2026",
    whenIso: "2026-04-26",
    city: "Delhi",
    aboutTitle: "About the evening",
    aboutBody:
      "Kirti Natya Niketan invites you to an evening where tradition, rhythm, and storytelling come alive through the timeless art of Bharatanatyam. Witness an immersive performance where every gesture speaks, every rhythm resonates, and every moment reflects devotion.",
    programmeIntro:
      "Invocation and inauguration, student offerings, a thematic dance drama, Mangalam, and special segments with our guests and contributors.",
    programmeHeading: "Program schedule",
    programmeItems: [
      {
        title: "6:30 PM — Invocation & inauguration",
        body:
          "The evening begins with the auspicious lighting of the lamp, invoking the blessings of Goddess Shakthi, followed by the felicitation of our esteemed Chief Guest.",
      },
      {
        title: "6:50 PM — Ganesha Pancharatnam",
        body:
          "A vibrant and devotional presentation by our students, offering prayers to Lord Ganesha.",
      },
      {
        title: "Dance drama — “Shakthi – Punj”",
        body:
          "A powerful thematic production portraying the strength, grace, and divine energy of Shakthi, brought alive through expressive storytelling and classical technique.",
      },
      {
        title: "Mangalam",
        body: "A traditional and graceful conclusion to the evening.",
      },
      {
        title: "Special segments",
        body:
          "Address by the Chief Guest. Honour to orchestra members and contributors. Vote of thanks by the Guru.",
      },
    ],
    creditsIntro:
      "Concept, choreography, orchestra, production team, and hosts.",
    creditsHeading: "Program credits",
    credits: [
      { label: "Concept & choreography", value: "Kalashree Ruchi Gupta" },
      {
        label: "Nattuvangam & rhythmic inputs",
        value: "Kalashree Ruchi Gupta",
      },
      { label: "Vocal", value: "Sh. Adarsh Nair" },
      { label: "Mridangam & drum pads", value: "Dr. R. Keshavan" },
      { label: "Violin", value: "Sh. V. S. K. Annadurai" },
      { label: "Compère", value: "Smt. Meena Venki" },
      { label: "Photography & videography", value: "Sh. Naresh Gulati" },
      { label: "Makeup", value: "Sh. Subhash Gupta" },
      { label: "Costumes", value: "Sh. Kishan Lal" },
      { label: "Design", value: "Smt. Suchitra A. D." },
    ],
  },
};

/** Featured card on Events Hub — keep in sync with the slug above */
export const featuredUpcomingEvent = eventsBySlug["nrityarchitum-18-2026"]!;
