"use client";

import { useLayoutEffect } from "react";

const HOME_HERO_MOBILE_MEDIA = "(max-width: 760px)";

/**
 * Locks mobile hero height to the first layout innerHeight so iOS/Android
 * browser chrome (URL bar) does not resize the hero while scrolling.
 */
export function useHomeHeroStableViewport() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia(HOME_HERO_MOBILE_MEDIA);

    const apply = () => {
      if (!media.matches) {
        root.style.removeProperty("--home-hero-stable-height");
        return;
      }
      root.style.setProperty("--home-hero-stable-height", `${window.innerHeight}px`);
    };

    apply();

    let lastWidth = window.innerWidth;
    const onResize = () => {
      if (Math.abs(window.innerWidth - lastWidth) < 1) return;
      lastWidth = window.innerWidth;
      apply();
    };

    const onOrientationChange = () => {
      lastWidth = window.innerWidth;
      window.requestAnimationFrame(apply);
    };

    media.addEventListener("change", apply);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrientationChange);

    return () => {
      media.removeEventListener("change", apply);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrientationChange);
      root.style.removeProperty("--home-hero-stable-height");
    };
  }, []);
}
