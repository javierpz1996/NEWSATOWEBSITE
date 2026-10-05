"use client";

import {
  HOME_INTRO_LOADING_GIF,
  HOME_INTRO_LOADING_HINT,
  HOME_INTRO_LOOP_GAP_MS,
  HOME_INTRO_CMARK_OUT_DELAY_MS,
  HOME_INTRO_CMARK_OUT_DURATION_MS,
  HOME_INTRO_LOADING_HOLD_MS,
  HOME_INTRO_POST_WIPE_MS,
  HOME_INTRO_SECOND_LAYER_ENABLED,
  HOME_INTRO_WATCHDOG_MS,
  animateHomeIntroSplatterOpen,
  clearHomeIntroInkMask,
  forceHomeIntroOpenMask,
  preloadHomeIntroAssets,
  resolveHomeIntroMinLoadingMs,
  waitMs,
} from "@/lib/home-intro-assets";
import { HomeIntroLoadingPaws } from "@/components/layout/home-intro-loading-paws";
import { HOME_INTRO_PREPARE_FIRST_HERO_REPLAY_EVENT } from "@/lib/home-intro-events";
import {
  markHomeIntroSeen,
  resolveHomeIntroLoopPreview,
  resolveHomeIntroPolicy,
} from "@/lib/home-intro-policy";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

/** loading → loading-out (fade UI) → wipe (splatter) → reveal → done */
type IntroPhase = "loading" | "loading-out" | "wipe" | "reveal";

type HomePageIntroProps = {
  pageRef: RefObject<HTMLElement | null>;
  headerFocusRef: RefObject<HTMLElement | null>;
};

function subscribeIntroPolicy(onStoreChange: () => void) {
  queueMicrotask(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("pageshow", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("pageshow", onStoreChange);
  };
}

function getIntroPolicySnapshot() {
  return resolveHomeIntroPolicy() === "play";
}

function computeLoadingCounter(
  elapsedMs: number,
  assetsLoaded: number,
  assetsTotal: number,
  gateComplete: boolean,
  minLoadingMs: number,
): number {
  if (gateComplete) return 100;

  const timeRatio = Math.min(1, elapsedMs / minLoadingMs);
  const assetRatio = assetsTotal > 0 ? assetsLoaded / assetsTotal : 0;
  const honestRatio = Math.min(timeRatio, assetRatio);
  return Math.min(99, Math.floor(honestRatio * 100));
}

type IntroCycleProps = {
  pageRef: RefObject<HTMLElement | null>;
  loopPreview: boolean;
  onCycleComplete: (markSeen: boolean) => void;
};

function HomePageIntroCycle({ pageRef, loopPreview, onCycleComplete }: IntroCycleProps) {
  const [phase, setPhase] = useState<IntroPhase>("loading");
  const [counter, setCounter] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const inkPrimaryRef = useRef<HTMLDivElement | null>(null);
  const inkBackdropRef = useRef<HTMLDivElement | null>(null);
  const progressTimerRef = useRef<number | null>(null);
  const finishedRef = useRef(false);
  const runGenerationRef = useRef(0);
  const assetsLoadedRef = useRef(0);
  const assetsTotalRef = useRef(1);
  const gateCompleteRef = useRef(false);
  const wipeRunRef = useRef(0);

  const clearProgressTimer = useCallback(() => {
    if (progressTimerRef.current !== null) {
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  }, []);

  const finishCycle = useCallback(
    (markSeen: boolean) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      abortRef.current?.abort();
      abortRef.current = null;
      clearProgressTimer();
      onCycleComplete(markSeen);
    },
    [clearProgressTimer, onCycleComplete],
  );

  useLayoutEffect(() => {
    const runGeneration = runGenerationRef.current + 1;
    runGenerationRef.current = runGeneration;
    finishedRef.current = false;
    gateCompleteRef.current = false;
    assetsLoadedRef.current = 0;

    const isActiveRun = () => runGenerationRef.current === runGeneration;

    document.documentElement.classList.add("home-intro-play");
    document.documentElement.classList.remove(
      "home-intro-reveal-active",
      "home-intro-splatter-motion",
    );
    document.body.style.overflow = "hidden";
    const page = pageRef.current;
    if (page) {
      page.setAttribute("inert", "");
      page.setAttribute("aria-hidden", "true");
    }

    const controller = new AbortController();
    abortRef.current = controller;

    const run = async () => {
      const startedAt = performance.now();
      const minLoadingMs = resolveHomeIntroMinLoadingMs();
      if (inkPrimaryRef.current) {
        clearHomeIntroInkMask(inkPrimaryRef.current);
      }
      if (inkBackdropRef.current) {
        clearHomeIntroInkMask(inkBackdropRef.current);
        inkBackdropRef.current.classList.remove("home-intro-overlay__ink--active");
      }

      const assetsPromise = preloadHomeIntroAssets((loaded, total) => {
        assetsLoadedRef.current = loaded;
        assetsTotalRef.current = total;
      });

      progressTimerRef.current = window.setInterval(() => {
        const elapsed = performance.now() - startedAt;
        setCounter(
          computeLoadingCounter(
            elapsed,
            assetsLoadedRef.current,
            assetsTotalRef.current,
            gateCompleteRef.current,
            minLoadingMs,
          ),
        );
      }, 50);

      try {
        await Promise.all([assetsPromise, waitMs(minLoadingMs, controller.signal)]);
      } catch {
        return;
      }
      if (!isActiveRun()) return;

      gateCompleteRef.current = true;
      clearProgressTimer();
      setCounter(100);

      try {
        await waitMs(HOME_INTRO_LOADING_HOLD_MS, controller.signal);
      } catch {
        return;
      }
      if (!isActiveRun()) return;

      setPhase("loading-out");

      const cmarkOutMs =
        HOME_INTRO_CMARK_OUT_DELAY_MS + HOME_INTRO_CMARK_OUT_DURATION_MS;
      if (cmarkOutMs > 0) {
        try {
          await waitMs(cmarkOutMs, controller.signal);
        } catch {
          return;
        }
        if (!isActiveRun()) return;
      } else {
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve());
        });
        if (!isActiveRun()) return;
      }

      document.documentElement.classList.add("home-intro-reveal-active");
      document.body.style.overflow = "";
      const page = pageRef.current;
      if (page) {
        page.removeAttribute("inert");
        page.removeAttribute("aria-hidden");
      }
      setPhase("wipe");
    };

    void run();

    const watchdog = window.setTimeout(
      () => finishCycle(!loopPreview),
      HOME_INTRO_WATCHDOG_MS,
    );

    return () => {
      window.clearTimeout(watchdog);
      controller.abort();
      clearProgressTimer();
      runGenerationRef.current += 1;
    };
  }, [clearProgressTimer, finishCycle, loopPreview, pageRef]);

  useLayoutEffect(() => {
    if (phase !== "wipe") return;

    const wipeRun = wipeRunRef.current + 1;
    wipeRunRef.current = wipeRun;
    const runGeneration = runGenerationRef.current;
    const isActiveRun = () =>
      wipeRunRef.current === wipeRun && runGenerationRef.current === runGeneration;

    const controller = abortRef.current;
    if (!controller) return;

    document.documentElement.classList.add("home-intro-splatter-motion");

    const runWipe = async () => {
      const splatterOptions = { signal: controller.signal, forceMotion: true };
      const inkPrimary = inkPrimaryRef.current;
      if (!inkPrimary) {
        finishCycle(!loopPreview);
        return;
      }

      try {
        await animateHomeIntroSplatterOpen(inkPrimary, splatterOptions);
      } catch {
        if (controller.signal.aborted || !isActiveRun()) return;
        forceHomeIntroOpenMask(inkPrimary);
      }
      if (!isActiveRun()) return;

      inkPrimary.classList.add("home-intro-overlay__ink--spent");

      if (HOME_INTRO_SECOND_LAYER_ENABLED) {
        const inkBackdrop = inkBackdropRef.current;
        if (!inkBackdrop) {
          finishCycle(!loopPreview);
          return;
        }
        inkBackdrop.classList.add("home-intro-overlay__ink--active");
        try {
          await animateHomeIntroSplatterOpen(inkBackdrop, splatterOptions);
        } catch {
          if (controller.signal.aborted || !isActiveRun()) return;
          forceHomeIntroOpenMask(inkBackdrop);
        }
        if (!isActiveRun()) return;
      }

      setPhase("reveal");

      try {
        await waitMs(HOME_INTRO_POST_WIPE_MS, controller.signal);
      } catch {
        return;
      }
      if (!isActiveRun()) return;

      window.dispatchEvent(new Event(HOME_INTRO_PREPARE_FIRST_HERO_REPLAY_EVENT));
      finishCycle(!loopPreview);
    };

    void runWipe();

    return () => {
      wipeRunRef.current += 1;
    };
  }, [finishCycle, loopPreview, phase]);

  useEffect(() => {
    if (phase !== "loading" && phase !== "loading-out" && phase !== "wipe" && phase !== "reveal") {
      return;
    }

    const onSkip = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      finishCycle(true);
    };

    window.addEventListener("keydown", onSkip);

    return () => {
      window.removeEventListener("keydown", onSkip);
    };
  }, [finishCycle, phase]);

  return (
    <div
      className={`home-intro-overlay home-intro-overlay--${phase}`}
      role="presentation"
      aria-hidden="true"
      data-home-intro-phase={phase}
    >
      <div
        ref={inkBackdropRef}
        className="home-intro-overlay__ink home-intro-overlay__ink--backdrop"
        aria-hidden="true"
      />
      <div
        ref={inkPrimaryRef}
        className="home-intro-overlay__ink home-intro-overlay__ink--primary"
        aria-hidden="true"
      />
      <div className="home-intro-overlay__stage">
        {phase === "loading" || phase === "loading-out" ? (
          <div className="home-intro-overlay__loading-stack">
            <div className="home-intro-overlay__loading-gif-wrap">
              {/* Native img keeps compositing simple; next/image layers can starve mask paints on Safari. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="home-intro-overlay__loading-gif"
                src={HOME_INTRO_LOADING_GIF}
                alt=""
                width={480}
                height={640}
                decoding="async"
                fetchPriority="high"
              />
            </div>
            <div className="home-intro-overlay__loading">
              <p className="home-intro-overlay__loading-label">CARGANDO...</p>
              <HomeIntroLoadingPaws counter={counter} />
              <p className="home-intro-overlay__loading-hint">{HOME_INTRO_LOADING_HINT}</p>
              <p className="sr-only" aria-live="polite">
                {phase === "loading" ? `Cargando, ${counter} por ciento` : ""}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function HomePageIntro({ pageRef, headerFocusRef }: HomePageIntroProps) {
  const shouldPlay = useSyncExternalStore(
    subscribeIntroPolicy,
    getIntroPolicySnapshot,
    () => false,
  );
  const [cycleKey, setCycleKey] = useState(0);
  const [cycleMounted, setCycleMounted] = useState(true);
  const [finished, setFinished] = useState(false);
  const loopTimeoutRef = useRef<number | null>(null);
  const portalReady = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const loopPreview = useSyncExternalStore(
    subscribeIntroPolicy,
    () => resolveHomeIntroLoopPreview(),
    () => false,
  );

  const unlockPage = useCallback(() => {
    document.documentElement.classList.remove(
      "home-intro-play",
      "home-intro-reveal-active",
      "home-intro-splatter-motion",
    );
    document.body.style.overflow = "";
    const page = pageRef.current;
    if (page) {
      page.removeAttribute("inert");
      page.removeAttribute("aria-hidden");
    }
  }, [pageRef]);

  const onCycleComplete = useCallback(
    (markSeen: boolean) => {
      const isLoop = resolveHomeIntroLoopPreview();

      if (isLoop) {
        setCycleMounted(false);
        unlockPage();
        if (loopTimeoutRef.current !== null) {
          window.clearTimeout(loopTimeoutRef.current);
        }
        loopTimeoutRef.current = window.setTimeout(() => {
          setCycleKey((key) => key + 1);
          setCycleMounted(true);
        }, HOME_INTRO_LOOP_GAP_MS);
        return;
      }

      if (markSeen) markHomeIntroSeen();
      window.dispatchEvent(new Event(HOME_INTRO_PREPARE_FIRST_HERO_REPLAY_EVENT));
      unlockPage();
      setFinished(true);
      window.setTimeout(() => {
        headerFocusRef.current?.focus({ preventScroll: true });
      }, 0);
    },
    [headerFocusRef, unlockPage],
  );

  useEffect(() => {
    return () => {
      if (loopTimeoutRef.current !== null) {
        window.clearTimeout(loopTimeoutRef.current);
      }
    };
  }, []);

  if (!shouldPlay || finished || !portalReady || !cycleMounted) {
    return null;
  }

  return createPortal(
    <HomePageIntroCycle
      key={cycleKey}
      pageRef={pageRef}
      loopPreview={loopPreview}
      onCycleComplete={onCycleComplete}
    />,
    document.body,
  );
}
