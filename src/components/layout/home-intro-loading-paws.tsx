"use client";

import { HomeIntroLoadingPawIcon } from "@/components/layout/home-intro-loading-paw-icon";
import {
  computeHomeIntroLoadingSegmentsFilled,
  HOME_INTRO_LOADING_SEGMENT_COUNT,
} from "@/lib/home-intro-assets";

type HomeIntroLoadingPawsProps = {
  counter: number;
};

export function HomeIntroLoadingPaws({ counter }: HomeIntroLoadingPawsProps) {
  const filledCount = computeHomeIntroLoadingSegmentsFilled(counter);

  return (
    <div
      className="home-intro-overlay__loading-segments"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={counter}
      aria-label="Cargando"
    >
      {Array.from({ length: HOME_INTRO_LOADING_SEGMENT_COUNT }, (_, index) => (
        <span
          key={index}
          className={
            index < filledCount
              ? "home-intro-overlay__loading-segment home-intro-overlay__loading-segment--on"
              : "home-intro-overlay__loading-segment"
          }
        >
          <HomeIntroLoadingPawIcon className="home-intro-overlay__loading-paw-icon" />
        </span>
      ))}
    </div>
  );
}
