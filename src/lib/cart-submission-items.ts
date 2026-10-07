import type { HomeCartItem } from "@/lib/home-cart";
import type { HomeCurrency } from "@/lib/home-currency";

/** Stored in `cart_submissions.items` (jsonb). */
export type CartSubmissionItemsDocument = {
  displayCurrency: HomeCurrency;
  items: HomeCartItem[];
};

export function buildCartSubmissionItemsDocument(
  currency: HomeCurrency,
  items: HomeCartItem[],
): CartSubmissionItemsDocument {
  return { displayCurrency: currency, items };
}

function isHomeCartItem(value: unknown): value is HomeCartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as HomeCartItem;
  return (
    typeof item.id === "string" &&
    typeof item.serviceTitle === "string" &&
    Array.isArray(item.lines) &&
    typeof item.totalUsd === "number"
  );
}

export function parseCartSubmissionItems(raw: unknown): {
  items: HomeCartItem[];
  displayCurrency: HomeCurrency | null;
} {
  if (Array.isArray(raw)) {
    return { items: raw.filter(isHomeCartItem), displayCurrency: null };
  }

  if (!raw || typeof raw !== "object") {
    return { items: [], displayCurrency: null };
  }

  const doc = raw as Partial<CartSubmissionItemsDocument>;
  if (!Array.isArray(doc.items)) {
    return { items: [], displayCurrency: null };
  }

  const displayCurrency =
    doc.displayCurrency === "ars" || doc.displayCurrency === "usd" ? doc.displayCurrency : null;

  return { items: doc.items.filter(isHomeCartItem), displayCurrency };
}
