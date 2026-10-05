"use client";

import { HOME_INTRO_COMPLETE_EVENT } from "@/lib/home-intro-events";
import { useEffect, useRef, useState, type RefObject } from "react";

export type HomeHeroReplayState = {
  replayReady: boolean;
  replayActive: boolean;
};

function isIntroPlaying(): boolean {
  return document.documentElement.classList.contains("home-intro-play");
}

function isHeroSectionInView(node: HTMLElement): boolean {
  const rect = node.getBoundingClientRect();
  if (rect.height <= 0) return false;
  const viewportHeight = window.innerHeight;
  return rect.top < viewportHeight * 0.92 && rect.bottom > viewportHeight * 0.15;
}

export function useHomeHeroReplay(
  targetRef: RefObject<HTMLElement | null>,
): HomeHeroReplayState {
  const replayReadyRef = useRef(false);
  const initialReplayDoneRef = useRef(false);
  const [replayReady, setReplayReady] = useState(false);
  const [replayActive, setReplayActive] = useState(false);

  useEffect(() => {
    const node = targetRef.current;
    if (!node) return;

    const playReplayFromHidden = () => {
      replayReadyRef.current = true;
      setReplayReady(true);
      setReplayActive(false);
      requestAnimationFrame(() => {
        setReplayActive(true);
      });
    };

    const tryPlayInitialReplay = (afterIntro: boolean) => {
      if (initialReplayDoneRef.current) return;
      if (!afterIntro && isIntroPlaying()) return;
      if (!isHeroSectionInView(node)) return;
      initialReplayDoneRef.current = true;
      playReplayFromHidden();
    };

    const scheduleAfterIntro = () => {
      requestAnimationFrame(() => {
        tryPlayInitialReplay(true);
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (isIntroPlaying()) return;

        if (!entry.isIntersecting) {
          replayReadyRef.current = true;
          setReplayReady(true);
          setReplayActive(false);
          return;
        }

        if (!initialReplayDoneRef.current) {
          tryPlayInitialReplay(false);
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

    let introObserver: MutationObserver | undefined;
    if (isIntroPlaying()) {
      introObserver = new MutationObserver(() => {
        if (!isIntroPlaying()) {
          scheduleAfterIntro();
        }
      });
      introObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    } else {
      requestAnimationFrame(() => {
        tryPlayInitialReplay(false);
      });
    }

    window.addEventListener(HOME_INTRO_COMPLETE_EVENT, scheduleAfterIntro);

    return () => {
      observer.disconnect();
      introObserver?.disconnect();
      window.removeEventListener(HOME_INTRO_COMPLETE_EVENT, scheduleAfterIntro);
    };
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
