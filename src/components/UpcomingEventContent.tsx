"use client";

import { FramedImage } from "@/components/FramedImage";
import { ScheduleWhen } from "@/components/ScheduleWhen";
import { ImagePreviewProvider } from "@/components/ImagePreviewProvider";
import { cn } from "@/lib/cn";
import type { EventDetail } from "@/lib/events";
import { eventsCardImage } from "@/lib/site-images";

export function UpcomingEventContent({ event: e }: { event: EventDetail }) {
  const hero = e.heroImage ?? eventsCardImage;
  const heroFrameClass = e.heroImage
    ? "hover-zoom relative mb-12 aspect-[3/4] w-full max-w-md overflow-hidden rounded-card border border-black/[0.06] bg-fill shadow-card sm:max-w-lg md:mb-16 md:max-w-xl"
    : "hover-zoom relative mb-12 aspect-video max-w-3xl overflow-hidden rounded-card border border-black/[0.06] bg-fill shadow-card md:mb-16";

  return (
    <ImagePreviewProvider>
      <div className="page-shell">
        <a
          href="/events"
          className="mb-8 inline-block text-sm text-text-secondary transition-colors hover:text-accent"
        >
          ← Back to Events
        </a>
        <div className={heroFrameClass}>
          <FramedImage
            src={hero.src}
            alt={hero.alt}
            sizes={
              e.heroImage
                ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 640px"
                : "(max-width: 1024px) 100vw, 768px"
            }
          />
        </div>
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
          {e.subtitle ? (
            <p className="type-accent-italic mt-3 text-lg text-accent md:text-xl">
              {e.subtitle}
            </p>
          ) : null}
          <p className="mx-auto mt-5 max-w-reading text-left text-base leading-prose text-text-secondary md:mx-0 md:text-lg">
            {e.description}
          </p>
        </header>

        <div className="space-y-section-gap">
          <section aria-labelledby="event-summary-heading">
            <header className="mb-8 md:mb-10">
              <h2
                id="event-summary-heading"
                className="font-serif text-content-title font-semibold tracking-heading text-text-primary"
              >
                {e.aboutTitle}
              </h2>
              <p className="mt-5 max-w-reading text-left text-base leading-prose text-text-secondary md:mt-6 md:text-lg">
                {e.aboutBody}
              </p>
            </header>
          </section>

          <section aria-labelledby="event-programme-heading">
            <header className="mb-8 md:mb-10">
              <h2
                id="event-programme-heading"
                className="font-serif text-content-title font-semibold tracking-heading text-text-primary"
              >
                {e.programmeHeading ?? "Programme"}
              </h2>
              <p className="mt-5 max-w-reading text-left text-base leading-prose text-text-secondary md:mt-6 md:text-lg">
                {e.programmeIntro}
              </p>
            </header>
            <ol className="max-w-reading space-y-8">
              {e.programmeItems.map((item, i) => (
                <li key={item.title}>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-sm font-semibold tabular-nums text-text-secondary">
                      {i + 1}.
                    </span>
                    <h3
                      className={cn(
                        "text-base font-semibold tracking-heading text-text-primary md:text-lg",
                        item.title.includes("Shakthi")
                          ? "font-accent font-medium italic"
                          : "font-serif",
                      )}
                    >
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-3 max-w-reading pl-6 text-left text-sm leading-prose text-text-secondary md:text-base">
                    {item.body}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="event-credits-heading">
            <header className="mb-8 md:mb-10">
              <h2
                id="event-credits-heading"
                className="font-serif text-content-title font-semibold tracking-heading text-text-primary"
              >
                {e.creditsHeading ?? "Credits"}
              </h2>
              <p className="mt-5 max-w-reading text-left text-base leading-prose text-text-secondary md:mt-6 md:text-lg">
                {e.creditsIntro}
              </p>
            </header>
            <dl className="grid max-w-reading grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
              {e.credits.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col sm:flex-row sm:gap-4"
                >
                  <dt className="shrink-0 text-left text-sm font-semibold leading-prose text-text-secondary sm:w-44">
                    {row.label}
                  </dt>
                  <dd className="text-left text-sm leading-prose text-text-primary md:text-base">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </ImagePreviewProvider>
  );
}
