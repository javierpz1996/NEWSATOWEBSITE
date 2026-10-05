"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export type HomeHeroReplayState = {
  replayReady: boolean;
  replayActive: boolean;
};

function isIntroPlaying(): boolean {
  return document.documentElement.classList.contains("home-intro-play");
}

export function useHomeHeroReplay(
  targetRef: RefObject<HTMLElement | null>,
): HomeHeroReplayState {
  const replayReadyRef = useRef(false);
  const [replayReady, setReplayReady] = useState(false);
  const [replayActive, setReplayActive] = useState(false);

  useEffect(() => {
    const node = targetRef.current;
    if (!node) return;

    const mobileMedia = window.matchMedia("(max-width: 760px)");
    if (mobileMedia.matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (isIntroPlaying()) return;

        if (!entry.isIntersecting) {
          replayReadyRef.current = true;
          setReplayReady(true);
          setReplayActive(false);
          return;
        }

        if (replayReadyRef.current) {
          setReplayActive(true);
        }
      },
      {
        threshold: 0.35,
        rootMargin: "0px 0px -4% 0px",
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [targetRef]);

  return { replayReady, replayActive };
}

export function homeHeroReplayRowClassName(
  state: HomeHeroReplayState,
  baseClassName: string,
): string {
  return [
    baseClassName,
    state.replayReady ? "home-hero-replay-ready" : "",
    state.replayActive ? "home-hero-replay-active" : "",
  ]
    .filter(Boolean)
    .join(" ");
}
