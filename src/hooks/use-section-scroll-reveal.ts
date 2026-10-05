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
  threshold?: number | number[];
  rootMargin?: string;
};

const DESKTOP_ROOT_MARGIN = "-10% 0px 24% 0px";
const MOBILE_ROOT_MARGIN = "-16% 0px 36% 0px";
const MOBILE_MEDIA = "(max-width: 760px)";

function resolveRootMargin(override?: string): string {
  if (override) return override;
  if (typeof window === "undefined") return DESKTOP_ROOT_MARGIN;
  return window.matchMedia(MOBILE_MEDIA).matches
    ? MOBILE_ROOT_MARGIN
    : DESKTOP_ROOT_MARGIN;
}

export function useSectionScrollReveal(
  targetRef: RefObject<HTMLElement | null>,
  options?: SectionScrollRevealOptions,
): SectionScrollRevealState {
  const { threshold = 0.05, rootMargin: rootMarginOverride } = options ?? {};
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const wasActiveRef = useRef(false);
  const [rootMargin, setRootMargin] = useState(() => resolveRootMargin(rootMarginOverride));

  useEffect(() => {
    if (rootMarginOverride) return;
    const media = window.matchMedia(MOBILE_MEDIA);
    const sync = () => setRootMargin(resolveRootMargin());
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [rootMarginOverride]);

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
