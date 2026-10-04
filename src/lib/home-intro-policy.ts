import {
  HOME_INTRO_DEV_AUTO_LOOP,
  HOME_INTRO_SESSION_KEY,
} from "@/lib/home-intro-assets";

export type HomeIntroPolicy = "play" | "skip";

function introSearchParams(): URLSearchParams | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search);
}

/**
 * Infinite intro preview only with `?intro=loop` (or `HOME_INTRO_DEV_AUTO_LOOP`).
 */
export function resolveHomeIntroLoopPreview(): boolean {
  const params = introSearchParams();
  if (params?.get("intro") === "off") return false;
  if (params?.get("intro") === "loop") return true;
  return HOME_INTRO_DEV_AUTO_LOOP;
}

export function clearHomeIntroSeen(): void {
  try {
    sessionStorage.removeItem(HOME_INTRO_SESSION_KEY);
  } catch {
    /* sessionStorage unavailable */
  }
}

export function shouldForceHomeIntroMotionPreview(): boolean {
  const params = introSearchParams();
  const intro = params?.get("intro");
  return intro === "loop" || intro === "1" || intro === "reset" || resolveHomeIntroLoopPreview();
}

export function resolveHomeIntroPolicy(): HomeIntroPolicy {
  if (typeof window === "undefined") return "skip";

  const loopPreview = resolveHomeIntroLoopPreview();
  const params = introSearchParams();
  const introParam = params?.get("intro");

  if (introParam === "reset" || introParam === "1" || introParam === "loop") {
    clearHomeIntroSeen();
  }

  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !loopPreview &&
    introParam !== "1" &&
    introParam !== "reset" &&
    introParam !== "loop"
  ) {
    return "skip";
  }

  if (loopPreview) {
    return "play";
  }

  if (window.location.hash.length > 1) {
    return "skip";
  }

  if (introParam === "1" || introParam === "reset") {
    return "play";
  }

  try {
    if (sessionStorage.getItem(HOME_INTRO_SESSION_KEY) === "1") {
      return "skip";
    }
  } catch {
    return "skip";
  }

  return "play";
}

export function markHomeIntroSeen(): void {
  if (resolveHomeIntroLoopPreview()) return;

  try {
    sessionStorage.setItem(HOME_INTRO_SESSION_KEY, "1");
  } catch {
    /* sessionStorage unavailable */
  }
}
