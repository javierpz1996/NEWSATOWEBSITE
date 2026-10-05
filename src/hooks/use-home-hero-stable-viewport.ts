"use client";

import { useLayoutEffect } from "react";

const HOME_HERO_MOBILE_MEDIA = "(max-width: 760px)";

function readInitialViewportHeight(): number {
  const visual = window.visualViewport?.height;
  return Math.max(window.innerHeight, visual ?? 0);
}

/**
 * Locks mobile hero to the first viewport height. Height-only changes from the
 * browser URL bar (scroll) are ignored so the hero does not resize mid-session.
 */
export function useHomeHeroStableViewport() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia(HOME_HERO_MOBILE_MEDIA);

    const apply = (force = false) => {
      if (!media.matches) {
        root.style.removeProperty("--home-hero-stable-height");
        return;
      }
      if (!force && root.style.getPropertyValue("--home-hero-stable-height")) {
        return;
      }
      root.style.setProperty(
        "--home-hero-stable-height",
        `${Math.round(readInitialViewportHeight())}px`,
      );
    };

    apply();

    let lastWidth = window.innerWidth;
    const onResize = () => {
      if (Math.abs(window.innerWidth - lastWidth) < 1) return;
      lastWidth = window.innerWidth;
      apply(true);
    };

    const onOrientationChange = () => {
      lastWidth = window.innerWidth;
      window.requestAnimationFrame(() => apply(true));
    };

    const onMediaChange = () => apply(true);
    media.addEventListener("change", onMediaChange);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrientationChange);

    return () => {
      media.removeEventListener("change", onMediaChange);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrientationChange);
      root.style.removeProperty("--home-hero-stable-height");
    };
  }, []);
}
