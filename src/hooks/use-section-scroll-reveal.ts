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

export function useSectionScrollReveal(
  targetRef: RefObject<HTMLElement | null>,
  options?: { threshold?: number; rootMargin?: string },
): SectionScrollRevealState {
  const { threshold = 0.2, rootMargin = "0px 0px -6% 0px" } = options ?? {};
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const wasActiveRef = useRef(false);

  useEffect(() => {
    if (!mounted) return;
    const node = targetRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          wasActiveRef.current = true;
          setActive(true);
          return;
        }

        if (wasActiveRef.current) {
          setReady(true);
        }
        setActive(false);
      },
      { threshold, rootMargin },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [mounted, rootMargin, targetRef, threshold]);

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
