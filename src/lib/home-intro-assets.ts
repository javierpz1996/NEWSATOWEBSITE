import { SATO_LOGO_SRC } from "@/lib/brand-assets";

/** Discrete squares in the intro loading meter (see overlay UI). */
export const HOME_INTRO_LOADING_SEGMENT_COUNT = 7;

/** Copy under paw meter — move to `messages/*` when home i18n is wired. */
export const HOME_INTRO_LOADING_HINT = "Ya casi cargamos todo" as const;

/** Looping art on the intro loading overlay (not part of hero preload). */
export const HOME_INTRO_LOADING_GIF = "/works/animation/animation6-intro.gif" as const;

/** Hero editorial tiles (same sources as `page.tsx` — no animation GIFs). */
export const HOME_INTRO_HERO_TILE_SRCS = [
  "/works/placeholder/dibujo-1.png",
  "/works/placeholder/dibujo-1.png",
  "/works/placeholder/dibujo-1.png",
] as const;

export const HOME_INTRO_HERO_COVER_SRC = "/works/placeholder/herocover.jpg" as const;

/** Luminance strip (source art). */
export const HOME_INTRO_OPEN_MASK_SRC = "/intro/splatter-open-strip.png" as const;
/** Alpha strip for CSS `-webkit-mask-image` (Safari ignores luminance on grayscale PNG). */
export const HOME_INTRO_OPEN_MASK_ALPHA_SRC =
  "/intro/splatter-open-strip-alpha.png" as const;

/** Critical hero assets for intro preload — excludes heavy animation GIFs. */
export const HOME_INTRO_CRITICAL_ASSETS = [
  SATO_LOGO_SRC,
  HOME_INTRO_HERO_COVER_SRC,
  ...HOME_INTRO_HERO_TILE_SRCS,
  HOME_INTRO_OPEN_MASK_ALPHA_SRC,
] as const;

/** Frozen timeline contract (ms). */
export const HOME_INTRO_MIN_LOADING_MS = 3000;
export const HOME_INTRO_LOADING_HOLD_MS = 0;
export const HOME_INTRO_CMARK_OUT_DELAY_MS = 0;
/** 0 = no post-100 wait; one frame in `loading-out` then wipe. */
export const HOME_INTRO_CMARK_OUT_DURATION_MS = 0;
/** Delay before mask steps start once wipe phase begins. */
export const HOME_INTRO_WIPE_START_DELAY_MS = 0;
export const HOME_INTRO_WIPE_DURATION_MS = 1000;
export const HOME_INTRO_MASK_FRAME_COUNT = 22;
export const HOME_INTRO_MASK_STEPS = HOME_INTRO_MASK_FRAME_COUNT - 1;
export const HOME_INTRO_HERO_REVEAL_MS = 900;
export const HOME_INTRO_POST_WIPE_MS = 0;
/** Optional second splatter pass (JJK-style `#blueBg`); off = single mask reveal. */
export const HOME_INTRO_SECOND_LAYER_ENABLED = false;
const HOME_INTRO_WIPE_PASS_MS =
  HOME_INTRO_WIPE_START_DELAY_MS + HOME_INTRO_WIPE_DURATION_MS;

export const HOME_INTRO_DONE_MS =
  HOME_INTRO_MIN_LOADING_MS +
  HOME_INTRO_LOADING_HOLD_MS +
  HOME_INTRO_CMARK_OUT_DELAY_MS +
  HOME_INTRO_CMARK_OUT_DURATION_MS +
  HOME_INTRO_WIPE_PASS_MS *
    (HOME_INTRO_SECOND_LAYER_ENABLED ? 2 : 1) +
  HOME_INTRO_POST_WIPE_MS;
export const HOME_INTRO_WATCHDOG_MS = 9000;
export const HOME_INTRO_SESSION_KEY = "home-intro-seen";

/** Pause between loop cycles (`?intro=loop` or dev auto-loop). */
export const HOME_INTRO_LOOP_GAP_MS = 900;

/** Dev auto-loop off by default; use `?intro=loop` to preview cycles. */
export const HOME_INTRO_DEV_AUTO_LOOP = false;

/** Shorter gate when previewing the intro (`?intro=loop` / dev auto-loop). */
export const HOME_INTRO_MIN_LOADING_PREVIEW_MS = 1200;

export function computeHomeIntroLoadingSegmentsFilled(
  counter: number,
  segmentCount = HOME_INTRO_LOADING_SEGMENT_COUNT,
): number {
  if (counter >= 100) return segmentCount;
  return Math.min(segmentCount, Math.floor((counter / 100) * segmentCount));
}

export function resolveHomeIntroMinLoadingMs(): number {
  if (typeof window === "undefined") return HOME_INTRO_MIN_LOADING_MS;
  const params = new URLSearchParams(window.location.search);
  if (params.get("intro") === "off") return HOME_INTRO_MIN_LOADING_MS;
  if (params.get("intro") === "loop") return HOME_INTRO_MIN_LOADING_PREVIEW_MS;
  if (HOME_INTRO_DEV_AUTO_LOOP && params.get("intro") !== "off") {
    return HOME_INTRO_MIN_LOADING_PREVIEW_MS;
  }
  return HOME_INTRO_MIN_LOADING_MS;
}

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const image = new window.Image();
    image.decoding = "async";
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });
}

export async function preloadHomeIntroAssets(
  onAssetLoaded?: (loaded: number, total: number) => void,
): Promise<void> {
  const unique = [...new Set(HOME_INTRO_CRITICAL_ASSETS)];
  let loaded = 0;
  const total = unique.length;

  await Promise.all(
    unique.map(async (src) => {
      await preloadImage(src);
      loaded += 1;
      onAssetLoaded?.(loaded, total);
    }),
  );
}

const HOME_INTRO_MASK_SIZE_X = `${HOME_INTRO_MASK_FRAME_COUNT * 100}%`;

/** Frame-by-frame splatter reveal (JS steps — Safari-safe vs WAAPI/CSS mask keyframes). */
type SplatterOpenOptions = {
  signal?: AbortSignal;
  startDelayMs?: number;
  /** Play stepped mask even when `prefers-reduced-motion` (intro preview). */
  forceMotion?: boolean;
};

function applyHomeIntroMaskFrame(ink: HTMLElement, step: number) {
  const xPercent = (step / HOME_INTRO_MASK_STEPS) * 100;
  const position = `${xPercent}% 0`;
  ink.style.setProperty("-webkit-mask-position", position);
  ink.style.setProperty("mask-position", position);
}

function waitAnimationFrame(signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    requestAnimationFrame(() => {
      if (signal?.aborted) {
        reject(new DOMException("Aborted", "AbortError"));
        return;
      }
      resolve();
    });
  });
}

export function clearHomeIntroInkMask(ink: HTMLElement) {
  ink.classList.remove("home-intro-overlay__ink--open", "home-intro-overlay__ink--spent");
  const keys = [
    "-webkit-mask-image",
    "mask-image",
    "-webkit-mask-size",
    "mask-size",
    "-webkit-mask-repeat",
    "mask-repeat",
    "-webkit-mask-mode",
    "mask-mode",
    "-webkit-mask-position",
    "mask-position",
    "-webkit-mask-origin",
    "mask-origin",
    "-webkit-mask-clip",
    "mask-clip",
  ] as const;
  for (const key of keys) {
    ink.style.removeProperty(key);
  }
  ink.style.removeProperty("visibility");
}

function bindHomeIntroOpenMask(ink: HTMLElement) {
  const maskUrl = HOME_INTRO_OPEN_MASK_ALPHA_SRC;
  ink.style.setProperty("-webkit-mask-image", `url("${maskUrl}")`);
  ink.style.setProperty("mask-image", `url("${maskUrl}")`);
  ink.style.setProperty("-webkit-mask-size", `${HOME_INTRO_MASK_SIZE_X} 100%`);
  ink.style.setProperty("mask-size", `${HOME_INTRO_MASK_SIZE_X} 100%`);
  ink.style.setProperty("-webkit-mask-repeat", "no-repeat");
  ink.style.setProperty("mask-repeat", "no-repeat");
  ink.style.setProperty("-webkit-mask-origin", "border-box");
  ink.style.setProperty("mask-origin", "border-box");
  ink.style.setProperty("-webkit-mask-clip", "border-box");
  ink.style.setProperty("mask-clip", "border-box");
  applyHomeIntroMaskFrame(ink, 0);
}

export function forceHomeIntroOpenMask(ink: HTMLElement) {
  bindHomeIntroOpenMask(ink);
  ink.classList.add("home-intro-overlay__ink--open");
  applyHomeIntroMaskFrame(ink, HOME_INTRO_MASK_STEPS);
}

export function animateHomeIntroSplatterOpen(
  ink: HTMLElement,
  options: SplatterOpenOptions = {},
): Promise<void> {
  const { signal, startDelayMs = HOME_INTRO_WIPE_START_DELAY_MS, forceMotion = false } =
    options;
  const reducedMotion =
    !forceMotion && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const finishOpen = () => {
    ink.classList.add("home-intro-overlay__ink--open");
    applyHomeIntroMaskFrame(ink, HOME_INTRO_MASK_STEPS);
  };

  const run = async () => {
    await preloadImage(HOME_INTRO_OPEN_MASK_ALPHA_SRC);
    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    bindHomeIntroOpenMask(ink);

    if (reducedMotion) {
      finishOpen();
      return;
    }

    if (startDelayMs > 0) {
      await waitMs(startDelayMs, signal);
    }

    const stepMs = HOME_INTRO_WIPE_DURATION_MS / HOME_INTRO_MASK_STEPS;

    for (let step = 0; step <= HOME_INTRO_MASK_STEPS; step += 1) {
      if (signal?.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }
      applyHomeIntroMaskFrame(ink, step);
      // rAF + layout flush so each mask step paints (main thread can be busy decoding the loading GIF).
      void ink.getBoundingClientRect();
      if (step < HOME_INTRO_MASK_STEPS) {
        const frameStart = performance.now();
        await waitAnimationFrame(signal);
        const remaining = stepMs - (performance.now() - frameStart);
        if (remaining > 0) {
          await waitMs(remaining, signal);
        }
      }
    }

    finishOpen();
  };

  return run().catch((error) => {
    if (signal?.aborted || (error instanceof DOMException && error.name === "AbortError")) {
      throw error;
    }
    forceHomeIntroOpenMask(ink);
  });
}

export function waitMs(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timeout = window.setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      window.clearTimeout(timeout);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}
