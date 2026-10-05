"use client";

import { HOME_INTRO_PREPARE_FIRST_HERO_REPLAY_EVENT } from "@/lib/home-intro-events";
import { useEffect, useRef, useState, type RefObject } from "react";
import { flushSync } from "react-dom";

export type HomeHeroReplayState = {
  replayReady: boolean;
  replayActive: boolean;
};

const HOME_HERO_MOBILE_MEDIA = "(max-width: 760px)";
const HOME_SERVICES_SECTION_ID = "servicios";

function isIntroPlaying(): boolean {
  return document.documentElement.classList.contains("home-intro-play");
}

function isMobileHeroViewport(): boolean {
  return window.matchMedia(HOME_HERO_MOBILE_MEDIA).matches;
}

function isHeroSectionInView(node: HTMLElement): boolean {
  const rect = node.getBoundingClientRect();
  if (rect.height <= 0) return false;
  const viewportHeight = window.innerHeight;
  return rect.top < viewportHeight * 0.92 && rect.bottom > viewportHeight * 0.15;
}

/** Mobile: keep hero editorial visible until the Servicios block enters the viewport. */
function hasScrolledToServicesSection(): boolean {
  const services = document.getElementById(HOME_SERVICES_SECTION_ID);
  if (!services) return true;
  const rect = services.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.88;
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
      flushSync(() => {
        setReplayReady(true);
        setReplayActive(false);
      });
      requestAnimationFrame(() => {
        setReplayActive(true);
      });
    };

    const tryPlayInitialReplay = () => {
      if (initialReplayDoneRef.current) return;
      if (isIntroPlaying()) return;
      if (!isHeroSectionInView(node)) return;
      initialReplayDoneRef.current = true;
      playReplayFromHidden();
    };

    const prepareFirstVisitReplay = () => {
      if (initialReplayDoneRef.current) return;
      if (!isHeroSectionInView(node)) return;
      initialReplayDoneRef.current = true;
      playReplayFromHidden();
    };

    const applyHeroLeftViewport = () => {
      if (isMobileHeroViewport() && !hasScrolledToServicesSection()) {
        replayReadyRef.current = true;
        setReplayReady(true);
        setReplayActive(true);
        return;
      }

      replayReadyRef.current = true;
      setReplayReady(true);
      setReplayActive(false);
    };

    const applyHeroInViewport = () => {
      if (!initialReplayDoneRef.current) {
        tryPlayInitialReplay();
        return;
      }
      if (replayReadyRef.current) {
        setReplayActive(true);
      }
    };

    const evaluateMobileScroll = () => {
      if (!isMobileHeroViewport() || isIntroPlaying()) return;
      if (isHeroSectionInView(node)) {
        applyHeroInViewport();
        return;
      }
      applyHeroLeftViewport();
    };

    let mobileRafId = 0;
    const scheduleMobileEvaluate = () => {
      if (!isMobileHeroViewport()) return;
      if (mobileRafId !== 0) return;
      mobileRafId = window.requestAnimationFrame(() => {
        mobileRafId = 0;
        evaluateMobileScroll();
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (isIntroPlaying()) return;

        if (isMobileHeroViewport()) {
          evaluateMobileScroll();
          return;
        }

        if (!entry.isIntersecting) {
          applyHeroLeftViewport();
          return;
        }

        applyHeroInViewport();
      },
      {
        threshold: 0.35,
        rootMargin: "0px 0px -4% 0px",
      },
    );

    observer.observe(node);

    window.addEventListener("scroll", scheduleMobileEvaluate, { passive: true });
    window.visualViewport?.addEventListener("resize", scheduleMobileEvaluate);
    window.visualViewport?.addEventListener("scroll", scheduleMobileEvaluate);

    let introObserver: MutationObserver | undefined;
    if (isIntroPlaying()) {
      introObserver = new MutationObserver(() => {
        if (!isIntroPlaying()) {
          tryPlayInitialReplay();
        }
      });
      introObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    } else {
      requestAnimationFrame(() => {
        tryPlayInitialReplay();
      });
    }

    window.addEventListener(
      HOME_INTRO_PREPARE_FIRST_HERO_REPLAY_EVENT,
      prepareFirstVisitReplay,
    );

    return () => {
      observer.disconnect();
      introObserver?.disconnect();
      window.removeEventListener("scroll", scheduleMobileEvaluate);
      window.visualViewport?.removeEventListener("resize", scheduleMobileEvaluate);
      window.visualViewport?.removeEventListener("scroll", scheduleMobileEvaluate);
      if (mobileRafId !== 0) window.cancelAnimationFrame(mobileRafId);
      window.removeEventListener(
        HOME_INTRO_PREPARE_FIRST_HERO_REPLAY_EVENT,
        prepareFirstVisitReplay,
      );
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
