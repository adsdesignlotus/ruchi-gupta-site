/** User-provided photos in /public/images/content — use with object-contain (no crop). */
export const photos = {
  p01: "/images/content/photo-01.png",
  p02: "/images/content/photo-02.png",
  p03: "/images/content/photo-03.png",
  p04: "/images/content/photo-04.png",
  p05: "/images/content/photo-05.png",
  p06: "/images/content/photo-06.png",
  p07: "/images/content/photo-07.png",
  p08: "/images/content/photo-08.png",
  p09: "/images/content/photo-09.png",
  p10: "/images/content/photo-10.png",
} as const;

/** Home gallery masonry — six distinct shots */
export const homeGalleryImages: { src: string; alt: string }[] = [
  { src: photos.p08, alt: "Bharatanatyam performance" },
  { src: photos.p05, alt: "Classical dance in rehearsal" },
  { src: photos.p02, alt: "Bharatanatyam pose" },
  { src: photos.p10, alt: "Performance on stage" },
  { src: photos.p01, alt: "Bharatanatyam dancer" },
  { src: photos.p09, alt: "Classical dance ensemble" },
];

export const aboutPortrait = {
  src: photos.p03,
  alt: "Ruchi Gupta with guru — classical dance",
};

/** Institute page — Kirti Natya Niketan (no crop; use with FramedImage) */
export const institutePageImages = [
  {
    src: "/images/institute/institute-01-entrance.png",
    alt: "Kirti Natya Niketan — students and teachers at the institute entrance, Rohini, Delhi",
  },
  {
    src: "/images/institute/institute-02-studio.png",
    alt: "Bharatanatyam class in the practice studio at Kirti Natya Niketan",
  },
  {
    src: "/images/institute/institute-03-mudra.png",
    alt: "Classical dance instruction — mudra and expression",
  },
  {
    src: "/images/institute/institute-04-outdoor.png",
    alt: "Kirti Natya Niketan students and teachers — outdoor group",
  },
] as const;

/** Events Hub — Upcoming tab card + 18th Nrityarchitum detail cover */
export const eventsCardImage = {
  src: "/images/content/nrityarchitum-17-upcoming-cover.png",
  alt: "18th Nrityarchitum — Shubham Karoti Kalyanam — classical dance poster",
};
