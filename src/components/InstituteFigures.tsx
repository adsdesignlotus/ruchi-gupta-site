"use client";

import { FramedImage } from "@/components/FramedImage";
import { ImagePreviewProvider } from "@/components/ImagePreviewProvider";
import { institutePageImages } from "@/lib/site-images";

const galleryItems = institutePageImages.map((img) => ({
  src: img.src,
  alt: img.alt,
}));

export function InstituteFigures() {
  const [entrance, studio, mudra, outdoor] = institutePageImages;

  return (
    <ImagePreviewProvider>
      <div className="mt-12 space-y-section-gap md:mt-16">
        <figure className="mx-auto w-full min-w-0 max-w-4xl">
          <div className="hover-zoom relative aspect-[3/4] w-full overflow-hidden rounded-card border border-black/[0.06] bg-fill shadow-card md:aspect-[4/5]">
            <FramedImage
              src={entrance.src}
              alt={entrance.alt}
              fit="cover"
              sizes="(max-width: 768px) 100vw, 512px"
              gallery={{ items: galleryItems, index: 0 }}
            />
          </div>
          <figcaption className="mt-3 text-center text-sm leading-prose text-text-secondary">
            Kirti Natya Niketan — Institute of Classical Arts, Rohini, Delhi
          </figcaption>
        </figure>

        <div className="grid min-w-0 grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
          <figure className="flex min-w-0 flex-col">
            <div className="hover-zoom relative aspect-[16/10] w-full overflow-hidden rounded-card border border-black/[0.06] bg-fill shadow-card">
              <FramedImage
                src={studio.src}
                alt={studio.alt}
                fit="cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                gallery={{ items: galleryItems, index: 1 }}
              />
            </div>
            <figcaption className="mt-3 text-sm leading-prose text-text-secondary">
              Practice and training in the studio
            </figcaption>
          </figure>
          <figure className="flex min-w-0 flex-col">
            <div className="hover-zoom relative aspect-[3/4] w-full min-w-0 overflow-hidden rounded-card border border-black/[0.06] bg-fill shadow-card">
              <FramedImage
                src={mudra.src}
                alt={mudra.alt}
                fit="cover"
                sizes="(max-width: 768px) 100vw, 400px"
                gallery={{ items: galleryItems, index: 2 }}
              />
            </div>
            <figcaption className="mt-3 text-sm leading-prose text-text-secondary">
              Abhinaya and technique
            </figcaption>
          </figure>
        </div>

        <figure className="min-w-0">
          <div className="hover-zoom relative aspect-[16/9] w-full min-w-0 overflow-hidden rounded-card border border-black/[0.06] bg-fill shadow-card md:aspect-[2/1]">
            <FramedImage
              src={outdoor.src}
              alt={outdoor.alt}
              fit="cover"
              sizes="(max-width: 1200px) 100vw, 1100px"
              gallery={{ items: galleryItems, index: 3 }}
            />
          </div>
          <figcaption className="mt-3 text-center text-sm leading-prose text-text-secondary">
            Community and performance — students and faculty together
          </figcaption>
        </figure>
      </div>
    </ImagePreviewProvider>
  );
}
