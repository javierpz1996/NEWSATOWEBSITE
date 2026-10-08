"use client";

import { useEffect, useRef, useState } from "react";
import { useHomeMessages } from "@/hooks/use-home-messages";
import {
  HOME_ANIMATION_SRC_BY_ID,
  isHomeAnimationVideoSrc,
} from "@/lib/home-animation-media";

type AnimationWork = {
  id: string;
  number: string;
  title: string;
  src: string;
  alt: string;
};

function workById(works: AnimationWork[], id: string) {
  const work = works.find((item) => item.id === id);
  if (!work) throw new Error(`Missing animation work: ${id}`);
  return work;
}

function AnimationTile({
  work,
  priority = false,
  variant,
  tileAria,
}: {
  work: AnimationWork;
  priority?: boolean;
  variant: "featured" | "thumb";
  tileAria: (number: string, title: string) => string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isHomeAnimationVideoSrc(work.src)) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      if (mediaQuery.matches) {
        video.pause();
        return;
      }
      void video.play();
    };

    syncPlayback();
    mediaQuery.addEventListener("change", syncPlayback);
    return () => mediaQuery.removeEventListener("change", syncPlayback);
  }, [work.src]);

  return (
    <figure
      className={`home-animations-tile home-animations-tile-${variant}`}
      aria-label={tileAria(work.number, work.title)}
    >
      <span className="home-animations-tile-number">{work.number}</span>
      {isHomeAnimationVideoSrc(work.src) ? (
        <video
          ref={videoRef}
          className="home-animations-media-image"
          src={work.src}
          loop
          muted
          playsInline
          preload={priority ? "metadata" : "none"}
          aria-hidden="true"
        />
      ) : null}
    </figure>
  );
}

export function HomeAnimations() {
  const { animations } = useHomeMessages();
  const [subtitleExpanded, setSubtitleExpanded] = useState(false);
  const animationWorks: AnimationWork[] = animations.works.map((work) => {
    const src = HOME_ANIMATION_SRC_BY_ID[work.id as keyof typeof HOME_ANIMATION_SRC_BY_ID];
    if (!src) throw new Error(`Missing animation media: ${work.id}`);
    return { ...work, src };
  });

  const topRowWorks = [workById(animationWorks, "animation-1"), workById(animationWorks, "animation-3")];
  const bottomRowWorks = [
    workById(animationWorks, "animation-2"),
    workById(animationWorks, "animation-4"),
    workById(animationWorks, "animation-5"),
  ];

  return (
    <section
      id="animaciones"
      className="home-animations"
      aria-labelledby="home-animations-title"
      aria-describedby="home-animations-subtitle"
    >
      <header className="home-animations-header">
        <div className="home-animations-header-copy">
          <h2 id="home-animations-title">{animations.title}</h2>
          <div className="home-animations-subtitle-wrap">
            <p
              id="home-animations-subtitle"
              className={`home-animations-subtitle${
                subtitleExpanded ? " home-animations-subtitle--expanded" : ""
              }`}
            >
              {animations.subtitle}
            </p>
            <button
              type="button"
              className="home-animations-subtitle-toggle"
              aria-expanded={subtitleExpanded}
              aria-controls="home-animations-subtitle"
              onClick={() => setSubtitleExpanded((open) => !open)}
            >
              {subtitleExpanded ? animations.subtitleSeeLess : animations.subtitleSeeMore}
            </button>
          </div>
        </div>
        <div className="home-animations-header-meta">
          <p className="home-animations-count">{animations.count}</p>
        </div>
      </header>

      <div className="home-animations-grid">
        <div className="home-animations-row home-animations-row-top">
          {topRowWorks.map((work, index) => (
            <AnimationTile
              key={work.id}
              work={work}
              variant="featured"
              priority={index === 0}
              tileAria={animations.tileAria}
            />
          ))}
        </div>
        <div className="home-animations-row home-animations-row-bottom">
          {bottomRowWorks.map((work) => (
            <AnimationTile
              key={work.id}
              work={work}
              variant="thumb"
              tileAria={animations.tileAria}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
