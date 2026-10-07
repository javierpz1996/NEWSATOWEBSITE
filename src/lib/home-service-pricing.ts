import type { HomeCurrency } from "@/lib/home-currency";

export type MoneyPair = {
  usd: number;
  ars: number;
};

export const HOME_SERVICE_PRICING = {
  simplista: {
    baseFlat: { usd: 8, ars: 9_000 },
    baseSimple: { usd: 15, ars: 17_000 },
    fullBody: { usd: 5, ars: 3_000 },
    extraPerson: { usd: 7, ars: 6_000 },
    poseSheet: { usd: 40, ars: 30_000 },
  },
  bocetos: {
    baseNoColor: { usd: 30, ars: 22_000 },
    baseWithColor: { usd: 40, ars: 30_000 },
    extraPerson: { usd: 15, ars: 8_000 },
    fullBody: { usd: 10, ars: 4_000 },
    simpleBackground: { usd: 25, ars: 10_000 },
    poseSheetNoColor: { usd: 55, ars: 40_000 },
    poseSheetWithColor: { usd: 65, ars: 50_000 },
  },
  completos: {
    baseOnePerson: { usd: 120, ars: 80_000 },
    extraPerson: { usd: 80, ars: 25_000 },
    fullBody: { usd: 50, ars: 15_000 },
    simpleBackground: { usd: 50, ars: 30_000 },
    detailedBackground: { usd: 100, ars: 50_000 },
    poseSheet: { usd: 270, ars: 190_000 },
  },
} as const satisfies Record<string, Record<string, MoneyPair>>;

export function moneyAmount(pair: MoneyPair, currency: HomeCurrency): number {
  return currency === "usd" ? pair.usd : pair.ars;
}

export function formatHomeMoney(amount: number, currency: HomeCurrency): string {
  if (currency === "usd") {
    return `${amount} USD`;
  }
  const formatted = amount.toLocaleString("es-AR");
  return `${formatted} ARS`;
}

export function formatHomeMoneyDelta(amount: number, currency: HomeCurrency): string {
  return `+${formatHomeMoney(amount, currency)}`;
}

export type PricedLine = {
  label: string;
  priceUsd: number;
  priceArs: number;
};

export function pricedLine(label: string, pair: MoneyPair): PricedLine {
  return { label, priceUsd: pair.usd, priceArs: pair.ars };
}

export function pricedLineQty(label: string, pair: MoneyPair, quantity: number): PricedLine {
  return {
    label,
    priceUsd: pair.usd * quantity,
    priceArs: pair.ars * quantity,
  };
}

export function lineDisplayAmount(line: PricedLine, currency: HomeCurrency): number {
  return currency === "usd" ? line.priceUsd : line.priceArs;
}

export function sumLinesUsd(lines: PricedLine[]): number {
  return lines.reduce((sum, line) => sum + line.priceUsd, 0);
}

export function sumLinesDisplay(lines: PricedLine[], currency: HomeCurrency): number {
  return lines.reduce((sum, line) => sum + lineDisplayAmount(line, currency), 0);
}
