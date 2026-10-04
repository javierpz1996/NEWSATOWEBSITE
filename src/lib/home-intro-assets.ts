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
  "/works/placeholder/dibujo-2.png",
  "/works/placeholder/dibujo-1.png",
] as const;

export const HOME_INTRO_OPEN_MASK_SRC = "/intro/splatter-open-strip.png" as const;

/** Critical hero assets for intro preload — excludes heavy animation GIFs. */
export const HOME_INTRO_CRITICAL_ASSETS = [
  SATO_LOGO_SRC,
  ...HOME_INTRO_HERO_TILE_SRCS,
  HOME_INTRO_OPEN_MASK_SRC,
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
export const HOME_INTRO_POST_WIPE_MS = 450;
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

/** Dev server: intro loops forever. Disable with `?intro=off`. */
export const HOME_INTRO_DEV_AUTO_LOOP = process.env.NODE_ENV === "development";

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

/** Frame-by-frame splatter reveal on the ink layer (WAAPI — reliable vs CSS mask keyframes). */
type SplatterOpenOptions = {
  signal?: AbortSignal;
  startDelayMs?: number;
  /** Play stepped mask even when `prefers-reduced-motion` (intro preview). */
  forceMotion?: boolean;
};

export function animateHomeIntroSplatterOpen(
  ink: HTMLElement,
  options: SplatterOpenOptions = {},
): Promise<void> {
  const { signal, startDelayMs = HOME_INTRO_WIPE_START_DELAY_MS, forceMotion = false } =
    options;
  const reducedMotion =
    !forceMotion && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  ink.style.setProperty("-webkit-mask-image", `url("${HOME_INTRO_OPEN_MASK_SRC}")`);
  ink.style.setProperty("mask-image", `url("${HOME_INTRO_OPEN_MASK_SRC}")`);
  ink.style.setProperty("-webkit-mask-size", `${HOME_INTRO_MASK_SIZE_X} 100%`);
  ink.style.setProperty("mask-size", `${HOME_INTRO_MASK_SIZE_X} 100%`);
  ink.style.setProperty("-webkit-mask-repeat", "no-repeat");
  ink.style.setProperty("mask-repeat", "no-repeat");
  ink.style.setProperty("-webkit-mask-position", "0% 0");
  ink.style.setProperty("mask-position", "0% 0");
  ink.style.setProperty("mask-mode", "luminance");

  const finishOpen = () => {
    ink.classList.add("home-intro-overlay__ink--open");
    ink.style.setProperty("-webkit-mask-position", "100% 0");
    ink.style.setProperty("mask-position", "100% 0");
  };

  if (reducedMotion) {
    finishOpen();
    return Promise.resolve();
  }

  const animation = ink.animate(
    [
      { maskPosition: "0% 0", WebkitMaskPosition: "0% 0" },
      { maskPosition: "100% 0", WebkitMaskPosition: "100% 0" },
    ],
    {
      delay: startDelayMs,
      duration: HOME_INTRO_WIPE_DURATION_MS,
      easing: `steps(${HOME_INTRO_MASK_STEPS})`,
      fill: "forwards",
    },
  );

  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      animation.cancel();
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const onAbort = () => {
      animation.cancel();
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
    animation.finished
      .then(() => {
        signal?.removeEventListener("abort", onAbort);
        finishOpen();
        resolve();
      })
      .catch((error) => {
        signal?.removeEventListener("abort", onAbort);
        reject(error);
      });
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
