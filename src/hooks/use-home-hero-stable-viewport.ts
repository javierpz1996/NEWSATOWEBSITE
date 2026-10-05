"use client";

import { useLayoutEffect } from "react";

const HOME_HERO_MOBILE_MEDIA = "(max-width: 760px)";

function readViewportHeight(): number {
  const visual = window.visualViewport?.height;
  return Math.max(window.innerHeight, visual ?? 0);
}

/**
 * Locks mobile hero min-height to the first layout viewport height so iOS/Android
 * browser chrome does not shrink the hero while scrolling; min-height + max(dvh, …)
 * in CSS still grows when the visible viewport gets taller (URL bar hides).
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
      root.style.setProperty("--home-hero-stable-height", `${Math.round(readViewportHeight())}px`);
    };

    apply();

    let lastWidth = window.innerWidth;
    let lockedMinHeight = readViewportHeight();

    const onResize = () => {
      if (!media.matches) return;

      const nextHeight = readViewportHeight();
      if (Math.abs(window.innerWidth - lastWidth) >= 1) {
        lastWidth = window.innerWidth;
        lockedMinHeight = nextHeight;
        apply();
        return;
      }

      if (nextHeight > lockedMinHeight) {
        lockedMinHeight = nextHeight;
        root.style.setProperty("--home-hero-stable-height", `${Math.round(lockedMinHeight)}px`);
      }
    };

    const onOrientationChange = () => {
      lastWidth = window.innerWidth;
      window.requestAnimationFrame(() => {
        lockedMinHeight = readViewportHeight();
        apply();
      });
    };

    media.addEventListener("change", apply);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrientationChange);
    window.visualViewport?.addEventListener("resize", onResize);

    return () => {
      media.removeEventListener("change", apply);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrientationChange);
      window.visualViewport?.removeEventListener("resize", onResize);
      root.style.removeProperty("--home-hero-stable-height");
    };
  }, []);
}
