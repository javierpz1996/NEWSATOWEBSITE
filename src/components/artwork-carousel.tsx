"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const CORE_SLIDES = [
  { src: "/works/placeholder/dibujo-1.png", alt: "Muestra placeholder dibujo 1" },
  { src: "/works/placeholder/dibujo-2.png", alt: "Muestra placeholder dibujo 2" },
  { src: "/works/placeholder/dibujo-1.png", alt: "Muestra placeholder dibujo 1" },
  { src: "/works/placeholder/dibujo-2.png", alt: "Muestra placeholder dibujo 2" },
] as const;

/** Embla turns loop off when the track is too short; extra copies keep infinite scroll enabled. */
const LOOP_COPIES = 3;

export function ArtworkCarousel() {
  const [, setApi] = useState<CarouselApi>();

  const carouselSlides = useMemo(
    () =>
      Array.from({ length: LOOP_COPIES }, (_, copyIndex) =>
        CORE_SLIDES.map((slide, slideIndex) => ({
          ...slide,
          id: `${copyIndex}-${slideIndex}`,
        })),
      ).flat(),
    [],
  );

  return (
    <Carousel
      setApi={setApi}
      opts={{
        align: "start",
        loop: true,
        slidesToScroll: 1,
      }}
      className="home-artwork-carousel home-artwork-carousel-service w-full"
      aria-label="Muestras del servicio"
    >
      <CarouselContent className="home-artwork-carousel-content-service !ml-0 h-full">
        {carouselSlides.map((slide) => (
          <CarouselItem
            key={slide.id}
            className="home-artwork-carousel-item-service !basis-auto !pl-0"
          >
            <div className="home-artwork-carousel-slide home-artwork-carousel-slide-service relative overflow-hidden border border-border bg-background">
              <Image
                className="home-artwork-carousel-image object-cover object-center"
                src={slide.src}
                alt={slide.alt}
                fill
                unoptimized
                sizes="(max-width: 760px) 28vw, 14vw"
              />
            </div>
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
  );
}
