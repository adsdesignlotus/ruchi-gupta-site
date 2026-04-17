"use client";

import { ScheduleWhen } from "@/components/ScheduleWhen";
import { PastEventInvites } from "@/components/PastEventInvites";
import { PastEventSlideshow } from "@/components/PastEventSlideshow";
import { ImagePreviewProvider } from "@/components/ImagePreviewProvider";
import { getCloudinaryCloudName } from "@/lib/cloudinary";
import type { PastEventDetail } from "@/lib/past-events";

export function PastEventContent({ event: e }: { event: PastEventDetail }) {
  const cloudName = getCloudinaryCloudName();

  return (
    <ImagePreviewProvider>
      {(preview) => (
        <div className="page-shell">
          <a
            href="/events"
            className="mb-8 inline-block text-sm text-text-secondary transition-colors hover:text-accent"
          >
            ← Back to Events
          </a>
          <header className="mb-12 text-center md:mb-16 md:text-left">
            <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-widest text-maroon">
              {e.badge}
            </span>
            <div className="mb-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm leading-prose text-text-secondary md:justify-start">
              <ScheduleWhen when={e.when} whenIso={e.whenIso} />
              <span>{e.city}</span>
            </div>
            <h1 className="font-serif text-display font-medium tracking-heading text-text-primary">
              {e.title}
            </h1>
            <p className="mx-auto mt-5 max-w-reading text-left text-base leading-prose text-text-secondary md:mx-0 md:text-lg">
              {e.description}
            </p>
          </header>

          <div className="space-y-section-gap">
            <section aria-labelledby="past-summary">
              <p className="max-w-reading text-left text-base leading-prose text-text-secondary md:text-lg">
                {e.summary}
              </p>
            </section>

            <section aria-labelledby="invites-heading">
              <header className="mb-8 md:mb-10">
                <h2
                  id="invites-heading"
                  className="font-serif text-content-title font-semibold tracking-heading text-text-primary"
                >
                  Invites & materials
                </h2>
                <p className="mt-5 max-w-reading text-left text-base leading-prose text-text-secondary md:mt-6 md:text-lg">
                  Tap an invite to view it full screen. PDFs download without
                  leaving the page when possible.
                </p>
              </header>
              <PastEventInvites
                invites={e.invites}
                cloudName={cloudName}
                preview={preview}
              />
            </section>

            <section aria-labelledby="gallery-heading">
              <header className="mb-8 md:mb-10">
                <h2
                  id="gallery-heading"
                  className="font-serif text-content-title font-semibold tracking-heading text-text-primary"
                >
                  Photo gallery
                </h2>
                <p className="mt-5 max-w-reading text-left text-base leading-prose text-text-secondary md:mt-6 md:text-lg">
                  Moments from the event.
                </p>
              </header>
              <PastEventSlideshow
                slides={e.slideshow}
                cloudName={cloudName}
                preview={preview}
              />
            </section>
          </div>
        </div>
      )}
    </ImagePreviewProvider>
  );
}
