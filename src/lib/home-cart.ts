import type { HomeCurrency } from "@/lib/home-currency";
import { formatHomeMoney, lineDisplayAmount, type PricedLine } from "@/lib/home-service-pricing";

export const HOME_CART_STORAGE_KEY = "sato-home-cart" as const;
export const HOME_CART_BUTTON_ID = "home-cart-button" as const;

/** Scroll offset at or below which the sticky cart hides (back at page top). */
export const HOME_STICKY_CART_TOP_THRESHOLD_PX = 16;

/** Home section: sticky cart appears after scrolling near here. */
export const HOME_STICKY_CART_REVEAL_SECTION_ID = "comisiones";

/**
 * How far above the viewport bottom the reveal section’s top must be before showing sticky
 * (0 = section top at bottom edge; higher = need to scroll more).
 */
export const HOME_STICKY_CART_REVEAL_VIEWPORT_RATIO = 0.62;

const HOME_CART_CHANGE_EVENT = "sato-home-cart-change";

export type HomeCartLine = {
  label: string;
  priceUsd: number;
  priceArs?: number;
};

export type HomeCartItem = {
  id: string;
  serviceTitle: string;
  lines: HomeCartLine[];
  totalUsd: number;
  addedAt: number;
};

export type HomeCartAddPayload = {
  serviceTitle: string;
  lines: HomeCartLine[];
  totalUsd: number;
};

const EMPTY_HOME_CART: HomeCartItem[] = [];

let cartSnapshot: HomeCartItem[] = EMPTY_HOME_CART;
let cartSnapshotRaw: string | null = null;

export function getServerHomeCartSnapshot(): HomeCartItem[] {
  return EMPTY_HOME_CART;
}

function isCartItem(value: unknown): value is HomeCartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as HomeCartItem;
  return (
    typeof item.id === "string" &&
    typeof item.serviceTitle === "string" &&
    Array.isArray(item.lines) &&
    typeof item.totalUsd === "number" &&
    typeof item.addedAt === "number"
  );
}

export function readHomeCart(): HomeCartItem[] {
  if (typeof window === "undefined") {
    return EMPTY_HOME_CART;
  }
  try {
    const raw = window.localStorage.getItem(HOME_CART_STORAGE_KEY);
    if (raw === cartSnapshotRaw) {
      return cartSnapshot;
    }
    cartSnapshotRaw = raw;
    if (!raw) {
      cartSnapshot = EMPTY_HOME_CART;
      return cartSnapshot;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      cartSnapshot = EMPTY_HOME_CART;
      return cartSnapshot;
    }
    const next = parsed.filter(isCartItem);
    cartSnapshot = next.length > 0 ? next : EMPTY_HOME_CART;
    return cartSnapshot;
  } catch {
    cartSnapshotRaw = null;
    cartSnapshot = EMPTY_HOME_CART;
    return cartSnapshot;
  }
}

function writeHomeCart(items: HomeCartItem[]): void {
  const raw = JSON.stringify(items);
  window.localStorage.setItem(HOME_CART_STORAGE_KEY, raw);
  cartSnapshotRaw = raw;
  cartSnapshot = items.length > 0 ? items : EMPTY_HOME_CART;
  window.dispatchEvent(new Event(HOME_CART_CHANGE_EVENT));
}

export function addHomeCartItem(payload: HomeCartAddPayload): HomeCartItem {
  const item: HomeCartItem = {
    id: crypto.randomUUID(),
    serviceTitle: payload.serviceTitle,
    lines: payload.lines,
    totalUsd: payload.totalUsd,
    addedAt: Date.now(),
  };
  writeHomeCart([...readHomeCart(), item]);
  return item;
}

export function removeHomeCartItem(id: string): void {
  writeHomeCart(readHomeCart().filter((item) => item.id !== id));
}

export function clearHomeCart(): void {
  writeHomeCart([]);
}

export function subscribeHomeCart(onStoreChange: () => void): () => void {
  const handler = () => onStoreChange();
  window.addEventListener(HOME_CART_CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(HOME_CART_CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function formatHomeCartUsd(amount: number): string {
  return `${amount} USD`;
}

export function formatHomeCartLine(
  line: HomeCartLine,
  currency: HomeCurrency,
): string {
  const priced: PricedLine = {
    label: line.label,
    priceUsd: line.priceUsd,
    priceArs: line.priceArs ?? line.priceUsd,
  };
  return formatHomeMoney(lineDisplayAmount(priced, currency), currency);
}

export function homeCartItemDisplayTotal(item: HomeCartItem, currency: HomeCurrency): number {
  if (currency === "usd") {
    return item.totalUsd;
  }
  return item.lines.reduce((sum, line) => {
    const priced: PricedLine = {
      label: line.label,
      priceUsd: line.priceUsd,
      priceArs: line.priceArs ?? line.priceUsd,
    };
    return sum + lineDisplayAmount(priced, currency);
  }, 0);
}

export function formatHomeCartItemTotal(item: HomeCartItem, currency: HomeCurrency): string {
  return formatHomeMoney(homeCartItemDisplayTotal(item, currency), currency);
}

export function sumHomeCartDisplayTotal(items: HomeCartItem[], currency: HomeCurrency): number {
  return items.reduce((sum, item) => sum + homeCartItemDisplayTotal(item, currency), 0);
}

export function formatHomeCartGrandTotal(items: HomeCartItem[], currency: HomeCurrency): string {
  return formatHomeMoney(sumHomeCartDisplayTotal(items, currency), currency);
}
