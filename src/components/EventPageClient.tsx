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
  /**
   * Outer block is required: `astro-island` uses `display: contents`, so the
   * island’s outermost node must be a real box. A Context.Provider alone can
   * confuse layout/hydration and leave only the fixed watermark visible.
   */
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background">
      <ImagePreviewProvider>
        <Nav pathname={pathname} />
        <main className="min-w-0 flex-1">
          {past ? (
            <PastEventContent event={past} />
          ) : upcoming ? (
            <UpcomingEventContent event={upcoming} />
          ) : null}
        </main>
        <Footer />
      </ImagePreviewProvider>
    </div>
  );
}
