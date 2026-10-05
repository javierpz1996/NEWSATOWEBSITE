export type HomeLocale = "es" | "en" | "pt";

export const HOME_LOCALE_STORAGE_KEY = "sato-home-locale";
export const DEFAULT_HOME_LOCALE: HomeLocale = "es";
export const HOME_LOCALE_CHANGE_EVENT = "sato-home-locale-change";

export const HOME_LOCALE_ORDER: HomeLocale[] = ["es", "en", "pt"];

const HOME_LOCALE_META: Record<HomeLocale, { label: string; name: string }> = {
  es: { label: "ES", name: "Español" },
  en: { label: "EN", name: "English" },
  pt: { label: "PT", name: "Português" },
};

function isHomeLocale(value: string): value is HomeLocale {
  return HOME_LOCALE_ORDER.includes(value as HomeLocale);
}

export function getServerHomeLocaleSnapshot(): HomeLocale {
  return DEFAULT_HOME_LOCALE;
}

export function readHomeLocale(): HomeLocale {
  if (typeof window === "undefined") return DEFAULT_HOME_LOCALE;

  try {
    const stored = window.localStorage.getItem(HOME_LOCALE_STORAGE_KEY);
    if (stored && isHomeLocale(stored)) return stored;
  } catch {
    // ignore blocked storage
  }

  return DEFAULT_HOME_LOCALE;
}

export function writeHomeLocale(locale: HomeLocale): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(HOME_LOCALE_STORAGE_KEY, locale);
  } catch {
    // ignore blocked storage
  }

  document.documentElement.lang = locale;
  window.dispatchEvent(new Event(HOME_LOCALE_CHANGE_EVENT));
}

export function subscribeHomeLocale(onStoreChange: () => void): () => void {
  const handler = () => onStoreChange();
  window.addEventListener(HOME_LOCALE_CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(HOME_LOCALE_CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function getHomeLocaleLabel(locale: HomeLocale): string {
  return HOME_LOCALE_META[locale].label;
}

export function getHomeLocaleName(locale: HomeLocale): string {
  return HOME_LOCALE_META[locale].name;
}

export function getNextHomeLocale(locale: HomeLocale): HomeLocale {
  const index = HOME_LOCALE_ORDER.indexOf(locale);
  const nextIndex = index < 0 ? 0 : (index + 1) % HOME_LOCALE_ORDER.length;
  return HOME_LOCALE_ORDER[nextIndex];
}
