"use client";

import { useMemo } from "react";
import type { PerformanceItem } from "@/lib/performances";
import { PerformanceCard } from "@/components/PerformanceCard";
import { ImagePreviewProvider } from "@/components/ImagePreviewProvider";

/** One gallery for the whole grid so each card image supports next/prev in the overlay. */
export function PerformancesSection({ items }: { items: PerformanceItem[] }) {
  const galleryItems = useMemo(
    () => items.map((p) => ({ src: p.image, alt: p.imageAlt })),
    [items],
  );

  return (
    <ImagePreviewProvider>
      <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4 xl:gap-6">
        {items.map((p, index) => (
          <PerformanceCard
            key={p.title}
            title={p.title}
            location={p.location}
            date={p.date}
            image={p.image}
            imageAlt={p.imageAlt}
            gallery={{ items: galleryItems, index }}
          />
        ))}
      </div>
    </ImagePreviewProvider>
  );
}
