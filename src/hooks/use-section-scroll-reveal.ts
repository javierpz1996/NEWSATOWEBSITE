"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from "react";

export type SectionScrollRevealState = {
  /** Client mounted — enables reveal styling without hiding SSR content before hydrate. */
  mounted: boolean;
  /** Section is intersecting the viewport. */
  active: boolean;
  /** Section was visible and left — replay hides content until active again. */
  ready: boolean;
};

export type SectionScrollRevealOptions = {
  /** Viewport height multiplier — reveal before section reaches the fold. */
  enterLeadVh?: number;
  /** Extra scroll (in vh) after section bottom leaves the top edge before hiding. */
  exitLagVh?: number;
  /** Minimum extra scroll as a fraction of section height (tall blocks like Comisiones). */
  exitSectionRatio?: number;
};

const MOBILE_MEDIA = "(max-width: 760px)";

const DEFAULT_ENTER_LEAD_VH = { mobile: 0.34, desktop: 0.22 };
const DEFAULT_EXIT_LAG_VH = { mobile: 0.42, desktop: 0.3 };
const DEFAULT_EXIT_SECTION_RATIO = { mobile: 0.55, desktop: 0.4 };

function resolveRevealMetrics(options?: SectionScrollRevealOptions, mobile = false) {
  const defaults = mobile ? DEFAULT_ENTER_LEAD_VH.mobile : DEFAULT_ENTER_LEAD_VH.desktop;
  const exitDefaults = mobile ? DEFAULT_EXIT_LAG_VH.mobile : DEFAULT_EXIT_LAG_VH.desktop;
  const exitSectionDefault = mobile
    ? DEFAULT_EXIT_SECTION_RATIO.mobile
    : DEFAULT_EXIT_SECTION_RATIO.desktop;
  return {
    enterLeadVh: options?.enterLeadVh ?? defaults,
    exitLagVh: options?.exitLagVh ?? exitDefaults,
    exitSectionRatio: options?.exitSectionRatio ?? exitSectionDefault,
  };
}

/**
 * Show while the section is approaching or on screen; keep visible after it scrolls up
 * until the user has moved exitLagVh further down the page.
 */
export function computeSectionScrollRevealActive(
  rect: DOMRect,
  viewportHeight: number,
  metrics: { enterLeadVh: number; exitLagVh: number; exitSectionRatio: number },
): boolean {
  if (viewportHeight <= 0) return false;

  const enterLeadPx = viewportHeight * metrics.enterLeadVh;
  const exitLagPx = Math.max(
    viewportHeight * metrics.exitLagVh,
    rect.height * metrics.exitSectionRatio,
  );

  const belowFold = rect.top >= viewportHeight;
  if (belowFold) return false;

  const approaching = rect.top < viewportHeight + enterLeadPx;
  const notScrolledPast = rect.bottom > -exitLagPx;

  return approaching && notScrolledPast;
}

export function useSectionScrollReveal(
  targetRef: RefObject<HTMLElement | null>,
  options?: SectionScrollRevealOptions,
): SectionScrollRevealState {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const wasActiveRef = useRef(false);
  const { enterLeadVh, exitLagVh, exitSectionRatio } = options ?? {};

  useEffect(() => {
    if (!mounted) return;
    const node = targetRef.current;
    if (!node) return;

    let rafId = 0;
    const revealOptions: SectionScrollRevealOptions = {
      enterLeadVh,
      exitLagVh,
      exitSectionRatio,
    };

    const evaluate = () => {
      const mobile = window.matchMedia(MOBILE_MEDIA).matches;
      const metrics = resolveRevealMetrics(revealOptions, mobile);
      const vh = window.innerHeight;
      const rect = node.getBoundingClientRect();
      const nextActive = computeSectionScrollRevealActive(rect, vh, metrics);

      if (nextActive) {
        wasActiveRef.current = true;
        setActive(true);
        return;
      }

      if (wasActiveRef.current) {
        setReady(true);
      }
      setActive(false);
    };

    const scheduleEvaluate = () => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        evaluate();
      });
    };

    evaluate();
    window.addEventListener("scroll", scheduleEvaluate, { passive: true });
    window.addEventListener("resize", scheduleEvaluate);
    window.visualViewport?.addEventListener("resize", scheduleEvaluate);
    window.visualViewport?.addEventListener("scroll", scheduleEvaluate);

    const resizeObserver = new ResizeObserver(scheduleEvaluate);
    resizeObserver.observe(node);

    return () => {
      if (rafId !== 0) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", scheduleEvaluate);
      window.removeEventListener("resize", scheduleEvaluate);
      window.visualViewport?.removeEventListener("resize", scheduleEvaluate);
      window.visualViewport?.removeEventListener("scroll", scheduleEvaluate);
      resizeObserver.disconnect();
    };
  }, [enterLeadVh, exitLagVh, exitSectionRatio, mounted, targetRef]);

  return { mounted, active, ready };
}

export function sectionScrollRevealClassName(
  base: string,
  state: SectionScrollRevealState,
): string {
  if (!state.mounted) return base;

  return [
    base,
    "home-section-scroll-reveal",
    state.ready ? "home-section-scroll-reveal--ready" : "",
    state.active ? "home-section-scroll-reveal--active" : "",
  ]
    .filter(Boolean)
    .join(" ");
}
