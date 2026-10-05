"use client";

import { HOME_INTRO_PREPARE_FIRST_HERO_REPLAY_EVENT } from "@/lib/home-intro-events";
import { useEffect, useRef, useState, type RefObject } from "react";
import { flushSync } from "react-dom";

export type HomeHeroReplayState = {
  replayReady: boolean;
  replayActive: boolean;
};

const HOME_COMMISSIONS_SECTION_ID = "comisiones";

function isIntroPlaying(): boolean {
  return document.documentElement.classList.contains("home-intro-play");
}

function isHeroSectionInView(node: HTMLElement): boolean {
  const rect = node.getBoundingClientRect();
  if (rect.height <= 0) return false;
  const viewportHeight = window.innerHeight;
  return rect.top < viewportHeight * 0.92 && rect.bottom > viewportHeight * 0.15;
}

/**
 * True once the user has scrolled past the bottom of Comisiones abiertas
 * (only then arm the hero for replay-hide).
 */
function hasScrolledPastCommissionsEnd(): boolean {
  const commissions = document.getElementById(HOME_COMMISSIONS_SECTION_ID);
  if (!commissions) return true;
  const rect = commissions.getBoundingClientRect();
  return rect.bottom < window.innerHeight * 0.18;
}

function shouldDeferHeroReplayArm(): boolean {
  return !hasScrolledPastCommissionsEnd();
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

    /** Hide + arm replay (ready ∧ ¬active). Only after Comisiones ends. */
    const applyHeroLeftViewport = () => {
      if (shouldDeferHeroReplayArm()) {
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

    const evaluateScroll = () => {
      if (isIntroPlaying()) return;
      if (isHeroSectionInView(node)) {
        applyHeroInViewport();
        return;
      }
      applyHeroLeftViewport();
    };

    let rafId = 0;
    const scheduleEvaluate = () => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        evaluateScroll();
      });
    };

    const observer = new IntersectionObserver(
      () => {
        scheduleEvaluate();
      },
      {
        threshold: 0.35,
        rootMargin: "0px 0px -4% 0px",
      },
    );

    observer.observe(node);

    window.addEventListener("scroll", scheduleEvaluate, { passive: true });
    window.addEventListener("resize", scheduleEvaluate);
    window.visualViewport?.addEventListener("resize", scheduleEvaluate);
    window.visualViewport?.addEventListener("scroll", scheduleEvaluate);

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

    evaluateScroll();

    return () => {
      observer.disconnect();
      introObserver?.disconnect();
      window.removeEventListener("scroll", scheduleEvaluate);
      window.removeEventListener("resize", scheduleEvaluate);
      window.visualViewport?.removeEventListener("resize", scheduleEvaluate);
      window.visualViewport?.removeEventListener("scroll", scheduleEvaluate);
      if (rafId !== 0) window.cancelAnimationFrame(rafId);
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
