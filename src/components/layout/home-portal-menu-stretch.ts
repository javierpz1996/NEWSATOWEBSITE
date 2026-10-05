/** Default + drag minimum width of the portal menu bar block (px). */
export const PORTAL_MENU_RULE_MIN_WIDTH_PX = 120;
/** Hard maximum for drag-to-stretch (also clamped by free space before the logo). */
export const PORTAL_MENU_RULE_MAX_STRETCH_PX = 200;
/** Pause after hitting max stretch before opening the portal menu modal. */
export const PORTAL_MENU_AUTO_OPEN_DELAY_MS = 520;
export const PORTAL_MENU_LOGO_GAP_PX = 16;
export const PORTAL_MENU_LOGO_SELECTOR = ".home-page .home-header .home-logo";

export function clampPortalMenuWidth(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function measurePortalMenuMaxStretchWidth(barElement: HTMLElement): number {
  const logo = document.querySelector<HTMLElement>(PORTAL_MENU_LOGO_SELECTOR);
  const barRect = barElement.getBoundingClientRect();

  const logoLimitPx = logo
    ? Math.round(barRect.right - logo.getBoundingClientRect().right - PORTAL_MENU_LOGO_GAP_PX)
    : PORTAL_MENU_RULE_MAX_STRETCH_PX;

  const cappedMax = Math.min(PORTAL_MENU_RULE_MAX_STRETCH_PX, logoLimitPx);

  return Math.max(PORTAL_MENU_RULE_MIN_WIDTH_PX, cappedMax);
}
