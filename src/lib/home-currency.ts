import { clearHomeCart } from "@/lib/home-cart";

export type HomeCurrency = "usd" | "ars";

export const HOME_CURRENCY_STORAGE_KEY = "sato-home-currency";
export const DEFAULT_HOME_CURRENCY: HomeCurrency = "usd";
export const HOME_CURRENCY_CHANGE_EVENT = "sato-home-currency-change";

export const HOME_CURRENCY_ORDER: HomeCurrency[] = ["usd", "ars"];

const HOME_CURRENCY_META: Record<HomeCurrency, { label: string; name: string }> = {
  usd: { label: "USD", name: "Dólares (USD)" },
  ars: { label: "ARS", name: "Pesos (ARS)" },
};

function isHomeCurrency(value: string): value is HomeCurrency {
  return HOME_CURRENCY_ORDER.includes(value as HomeCurrency);
}

export function getServerHomeCurrencySnapshot(): HomeCurrency {
  return DEFAULT_HOME_CURRENCY;
}

export function readHomeCurrency(): HomeCurrency {
  if (typeof window === "undefined") return DEFAULT_HOME_CURRENCY;

  try {
    const stored = window.localStorage.getItem(HOME_CURRENCY_STORAGE_KEY);
    if (stored && isHomeCurrency(stored)) return stored;
  } catch {
    // ignore blocked storage
  }

  return DEFAULT_HOME_CURRENCY;
}

export function writeHomeCurrency(currency: HomeCurrency): void {
  if (typeof window === "undefined") return;

  const previous = readHomeCurrency();
  if (previous !== currency) {
    clearHomeCart();
  }

  try {
    window.localStorage.setItem(HOME_CURRENCY_STORAGE_KEY, currency);
  } catch {
    // ignore blocked storage
  }

  window.dispatchEvent(new Event(HOME_CURRENCY_CHANGE_EVENT));
}

export function subscribeHomeCurrency(onStoreChange: () => void): () => void {
  const handler = () => onStoreChange();
  window.addEventListener(HOME_CURRENCY_CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(HOME_CURRENCY_CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function getHomeCurrencyLabel(currency: HomeCurrency): string {
  return HOME_CURRENCY_META[currency].label;
}

export function getHomeCurrencyName(currency: HomeCurrency): string {
  return HOME_CURRENCY_META[currency].name;
}
