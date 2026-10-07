"use client";

import Image from "next/image";
import { useHomeMessages } from "@/hooks/use-home-messages";

type AnimationWork = {
  id: string;
  number: string;
  title: string;
  src: `/works/animation/${string}`;
  alt: string;
};

const ANIMATION_SRC_BY_ID: Record<string, `/works/animation/${string}`> = {
  "animation-1": "/works/animation/animation8.gif",
  "animation-2": "/works/animation/animation2.gif",
  "animation-3": "/works/animation/animation7.gif",
  "animation-4": "/works/animation/animation4.gif",
  "animation-5": "/works/animation/animation9.gif",
};

function workById(works: AnimationWork[], id: string) {
  const work = works.find((item) => item.id === id);
  if (!work) throw new Error(`Missing animation work: ${id}`);
  return work;
}

function AnimationTile({
  work,
  priority = false,
  sizes,
  variant,
  tileAria,
}: {
  work: AnimationWork;
  priority?: boolean;
  sizes: string;
  variant: "featured" | "thumb";
  tileAria: (number: string, title: string) => string;
}) {
  return (
    <figure
      className={`home-animations-tile home-animations-tile-${variant}`}
      aria-label={tileAria(work.number, work.title)}
    >
      <span className="home-animations-tile-number">{work.number}</span>
      <Image
        className="home-animations-media-image"
        src={work.src}
        alt={work.alt}
        fill
        unoptimized
        sizes={sizes}
        priority={priority}
      />
    </figure>
  );
}

export function HomeAnimations() {
  const { animations } = useHomeMessages();
  const animationWorks: AnimationWork[] = animations.works.map((work) => ({
    ...work,
    src: ANIMATION_SRC_BY_ID[work.id]!,
  }));

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
          <p id="home-animations-subtitle" className="home-animations-subtitle">
            {animations.subtitle}
          </p>
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
              sizes="(max-width: 900px) 50vw, 780px"
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
              sizes="(max-width: 560px) 33vw, 520px"
              tileAria={animations.tileAria}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
