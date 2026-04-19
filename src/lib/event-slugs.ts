import { eventsBySlug } from "@/lib/events";
import { pastEventsBySlug } from "@/lib/past-events";
import { workshopsBySlug } from "@/lib/workshops";

export function getEventTitleForSlug(slug: string): string {
  return (
    eventsBySlug[slug]?.title ??
    pastEventsBySlug[slug]?.title ??
    workshopsBySlug[slug]?.title ??
    slug
  );
}

export function getAllEventSlugs(): string[] {
  return Array.from(
    new Set([
      ...Object.keys(eventsBySlug),
      ...Object.keys(pastEventsBySlug),
      ...Object.keys(workshopsBySlug),
    ]),
  ).sort();
}
