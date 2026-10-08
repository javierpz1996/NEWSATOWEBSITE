/** Portal menu rule cat at default stretch — `public/works/animation-nav/teo1.png`. */
export const PORTAL_MENU_RULE_CAT_SRC = "/works/animation-nav/teo1.png" as const;
export const PORTAL_MENU_RULE_CAT_WIDTH = 455;
export const PORTAL_MENU_RULE_CAT_HEIGHT = 763;

/** Shown when the rule is dragged to max width — same on-screen size as teo1. */
export const PORTAL_MENU_RULE_CAT_AT_MAX_SRC = "/works/animation-nav/teo2.png" as const;
export const PORTAL_MENU_RULE_CAT_AT_MAX_WIDTH = 499;
export const PORTAL_MENU_RULE_CAT_AT_MAX_HEIGHT = 683;

/** Both Teo sprites for the portal rule — preload together to avoid first-stretch flicker. */
export const PORTAL_MENU_RULE_CAT_SRCS = [
  PORTAL_MENU_RULE_CAT_SRC,
  PORTAL_MENU_RULE_CAT_AT_MAX_SRC,
] as const;

let portalMenuRuleCatsPreload: Promise<void> | null = null;

async function preloadPortalMenuRuleCat(src: string): Promise<void> {
  if (typeof window === "undefined") return;

  const image = new window.Image();
  image.decoding = "async";

  await new Promise<void>((resolve) => {
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });

  try {
    await image.decode();
  } catch {
    // decode() can reject on unsupported browsers; cache hit is enough
  }
}

/** Idempotent — fetches and decodes teo1 + teo2 as early as possible. */
export function ensurePortalMenuRuleCatsPreloaded(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (!portalMenuRuleCatsPreload) {
    portalMenuRuleCatsPreload = Promise.all(
      PORTAL_MENU_RULE_CAT_SRCS.map((src) => preloadPortalMenuRuleCat(src)),
    ).then(() => undefined);
  }

  return portalMenuRuleCatsPreload;
}
