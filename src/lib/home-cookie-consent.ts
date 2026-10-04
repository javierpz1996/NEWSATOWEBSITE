export const HOME_COOKIE_CONSENT_STORAGE_KEY = "sato-home-cookie-consent" as const;

/** Delay before the cookie banner is shown after entering the home page. */
export const HOME_COOKIE_CONSENT_SHOW_DELAY_MS = 1000;

export const HOME_PRIVACY_POLICY_HREF = "/privacidad" as const;

const HOME_COOKIE_CONSENT_CHANGE_EVENT = "sato-home-cookie-consent-change";

export type HomeCookieConsentValue = "accepted" | "rejected";

export function readHomeCookieConsent(): HomeCookieConsentValue | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(HOME_COOKIE_CONSENT_STORAGE_KEY);
  if (raw === "accepted" || raw === "rejected") return raw;
  return null;
}

export function writeHomeCookieConsent(value: HomeCookieConsentValue): void {
  window.localStorage.setItem(HOME_COOKIE_CONSENT_STORAGE_KEY, value);
  window.dispatchEvent(new Event(HOME_COOKIE_CONSENT_CHANGE_EVENT));
}

export function subscribeHomeCookieConsent(onStoreChange: () => void): () => void {
  const handler = () => onStoreChange();
  window.addEventListener(HOME_COOKIE_CONSENT_CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(HOME_COOKIE_CONSENT_CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
