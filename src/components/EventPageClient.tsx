"use client";

import { Footer } from "@/components/Footer";
import { ImagePreviewProvider } from "@/components/ImagePreviewProvider";
import { Nav } from "@/components/Nav";
import { PastEventContent } from "@/components/PastEventContent";
import { UpcomingEventContent } from "@/components/UpcomingEventContent";
import type { EventDetail } from "@/lib/events";
import type { PastEventDetail } from "@/lib/past-events";

/**
 * Single client island for `/events/[slug]` so we avoid nesting `client:load`
 * inside `ClientShell` (nested islands can fail to hydrate → blank page).
 */
export default function EventPageClient({
  pathname,
  past,
  upcoming,
}: {
  pathname: string;
  past?: PastEventDetail | null;
  upcoming?: EventDetail | null;
}) {
  return (
    <ImagePreviewProvider>
      <div className="relative z-10 flex min-h-screen flex-col">
        <Nav pathname={pathname} />
        <main className="min-w-0 flex-1">
          {past ? (
            <PastEventContent event={past} />
          ) : upcoming ? (
            <UpcomingEventContent event={upcoming} />
          ) : null}
        </main>
        <Footer />
      </div>
    </ImagePreviewProvider>
  );
}
