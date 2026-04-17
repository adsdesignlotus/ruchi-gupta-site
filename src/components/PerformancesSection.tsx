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
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
