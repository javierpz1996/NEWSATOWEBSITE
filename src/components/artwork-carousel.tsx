"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useHomeMessages } from "@/hooks/use-home-messages";
import type { ServiceCarouselVariant } from "@/lib/home-service-cards";
import { SIMPLISTA_CAROUSEL_WORKS } from "@/lib/simplista-carousel-works";
import { COMPLETOS_CAROUSEL_WORKS } from "@/lib/completos-carousel-works";
import { SKETCH_CAROUSEL_WORKS } from "@/lib/sketch-carousel-works";

type CarouselSlideWork = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** Embla turns loop off when the track is too short; extra copies keep infinite scroll enabled. */
const LOOP_COPIES = 3;

function workIndexFromSrc(works: readonly CarouselSlideWork[], src: string): number {
  const index = works.findIndex((work) => work.src === src);
  return index < 0 ? 0 : index;
}

type ArtworkCarouselLightboxProps = {
  works: readonly CarouselSlideWork[];
  workIndex: number;
  copy: {
    carouselLightboxCloseAria: string;
    carouselLightboxPrevAria: string;
    carouselLightboxNextAria: string;
    carouselLightboxWorkLabel: (index: number, total: number) => string;
  };
  onClose: () => void;
};

function ArtworkCarouselLightbox({ works, workIndex, copy, onClose }: ArtworkCarouselLightboxProps) {
  const [activeIndex, setActiveIndex] = useState(workIndex);
  const total = works.length;
  const work = works[activeIndex] ?? works[0];

  const goPrev = useCallback(() => {
    setActiveIndex((current) => (current - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % total);
  }, [total]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [goNext, goPrev, onClose]);

  if (!work) return null;

  return createPortal(
    <div
      className="home-artwork-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={work.alt}
      onClick={onClose}
    >
      <button
        type="button"
        className="home-artwork-lightbox__close"
        aria-label={copy.carouselLightboxCloseAria}
        onClick={onClose}
      >
        ×
      </button>

      <div
        className="home-artwork-lightbox__shell"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="home-artwork-lightbox__arrow home-artwork-lightbox__arrow--prev"
          aria-label={copy.carouselLightboxPrevAria}
          onClick={goPrev}
        >
          ←
        </button>

        <figure className="home-artwork-lightbox__figure">
          <Image
            className="home-artwork-lightbox__image"
            src={work.src}
            alt={work.alt}
            width={work.width}
            height={work.height}
            unoptimized
            sizes="(max-width: 760px) 92vw, 760px"
            priority
          />
          <figcaption className="home-artwork-lightbox__caption">
            {copy.carouselLightboxWorkLabel(activeIndex + 1, total)}
          </figcaption>
        </figure>

        <button
          type="button"
          className="home-artwork-lightbox__arrow home-artwork-lightbox__arrow--next"
          aria-label={copy.carouselLightboxNextAria}
          onClick={goNext}
        >
          →
        </button>
      </div>
    </div>,
    document.body,
  );
}

type ArtworkCarouselProps = {
  variant: ServiceCarouselVariant;
};

export function ArtworkCarousel({ variant }: ArtworkCarouselProps) {
  const { services } = useHomeMessages();
  const [, setApi] = useState<CarouselApi>();
  const [lightboxWorkIndex, setLightboxWorkIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxWorkIndex(null), []);

  const galleryWorks = useMemo((): CarouselSlideWork[] => {
    const source =
      variant === "bocetos"
        ? SKETCH_CAROUSEL_WORKS
        : variant === "completos"
          ? COMPLETOS_CAROUSEL_WORKS
          : SIMPLISTA_CAROUSEL_WORKS;
    const sampleAlt =
      variant === "bocetos"
        ? services.carouselSketchSampleAlt
        : variant === "completos"
          ? services.carouselCompletosSampleAlt
          : services.carouselSampleAlt;

    return source.map((work, index) => ({
      src: work.src,
      alt: sampleAlt(index + 1),
      width: work.width,
      height: work.height,
    }));
  }, [services, variant]);

  const carouselSlides = useMemo(
    () =>
      Array.from({ length: LOOP_COPIES }, (_, copyIndex) =>
        galleryWorks.map((slide, slideIndex) => ({
          ...slide,
          id: `${copyIndex}-${slideIndex}`,
        })),
      ).flat(),
    [galleryWorks],
  );

  const lightboxCopy = useMemo(
    () => ({
      carouselLightboxCloseAria: services.carouselLightboxCloseAria,
      carouselLightboxPrevAria: services.carouselLightboxPrevAria,
      carouselLightboxNextAria: services.carouselLightboxNextAria,
      carouselLightboxWorkLabel: services.carouselLightboxWorkLabel,
    }),
    [services],
  );

  return (
    <>
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
          slidesToScroll: 1,
        }}
        className="home-artwork-carousel home-artwork-carousel-service w-full"
        aria-label={services.carouselAria}
      >
        <CarouselContent className="home-artwork-carousel-content-service !ml-0 h-full">
          {carouselSlides.map((slide) => (
            <CarouselItem
              key={slide.id}
              className="home-artwork-carousel-item-service !basis-auto !pl-0"
            >
              <button
                type="button"
                className="home-artwork-carousel-slide home-artwork-carousel-slide-service home-artwork-carousel-slide-btn relative overflow-hidden border border-border bg-background"
                aria-label={services.carouselExpandAria(slide.alt)}
                onClick={() => setLightboxWorkIndex(workIndexFromSrc(galleryWorks, slide.src))}
              >
                <Image
                  className="home-artwork-carousel-image"
                  src={slide.src}
                  alt=""
                  width={slide.width}
                  height={slide.height}
                  unoptimized
                  draggable={false}
                />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className="home-artwork-carousel-control home-artwork-carousel-control-service home-artwork-carousel-control-prev"
          disabled={false}
        />
        <CarouselNext
          className="home-artwork-carousel-control home-artwork-carousel-control-service home-artwork-carousel-control-next"
          disabled={false}
        />
      </Carousel>

      {lightboxWorkIndex !== null ? (
        <ArtworkCarouselLightbox
          key={lightboxWorkIndex}
          works={galleryWorks}
          workIndex={lightboxWorkIndex}
          copy={lightboxCopy}
          onClose={closeLightbox}
        />
      ) : null}
    </>
  );
}
