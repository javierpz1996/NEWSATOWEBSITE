import type { HomeCurrency } from "@/lib/home-currency";
import {
  formatHomeMoney,
  formatHomeMoneyDelta,
  HOME_SERVICE_PRICING,
  moneyAmount,
} from "@/lib/home-service-pricing";
import type { HomeMessages, HomeServiceBaseOption } from "@/lib/home-messages/types";

export type ServicePriceRow = {
  label: string;
  price: string;
};

export type ServiceBundle = {
  title: string;
  price: string;
  includes: string[];
};

export type ContentRating = "sfw" | "nsfw";

export type ServiceCarouselVariant = "simplista" | "bocetos" | "completos";

export type ServiceOrderKind = "simplista" | "bocetos" | "completos";

export type HomeServiceCard = {
  id: string;
  badge: string;
  badgeTone: "mint" | "rose" | "blue" | "lilac";
  title: string;
  fromPrice?: string;
  description: string;
  contentRating: ContentRating;
  carouselVariant: ServiceCarouselVariant;
  prices?: ServicePriceRow[];
  variations?: ServicePriceRow[];
  bundle?: ServiceBundle;
  calculator?: boolean;
  orderKind?: ServiceOrderKind;
  ctaLabel: string;
  ctaHref: string;
  baseOptions?: HomeServiceBaseOption[];
  extraPrices?: ServicePriceRow[];
  extraSectionTitle?: string;
};

function simplistaBasePair(optionId: string) {
  return optionId === "simple"
    ? HOME_SERVICE_PRICING.simplista.baseSimple
    : HOME_SERVICE_PRICING.simplista.baseFlat;
}

function bocetosBasePair(optionId: string) {
  return optionId === "withColor"
    ? HOME_SERVICE_PRICING.bocetos.baseWithColor
    : HOME_SERVICE_PRICING.bocetos.baseNoColor;
}

function buildSimplistaCard(
  simplista: HomeMessages["services"]["simplista"],
  card: HomeMessages["services"]["card"],
  currency: HomeCurrency,
): Omit<HomeServiceCard, "id" | "contentRating"> {
  const p = HOME_SERVICE_PRICING.simplista;
  return {
    badge: simplista.badge,
    badgeTone: "mint",
    title: simplista.title,
    fromPrice: formatHomeMoney(moneyAmount(p.baseFlat, currency), currency),
    description: simplista.description,
    carouselVariant: "simplista",
    prices: simplista.baseOptions.map((option) => ({
      label: option.label,
      price: formatHomeMoney(moneyAmount(simplistaBasePair(option.id), currency), currency),
    })),
    variations: [
      {
        label: simplista.variationFullBody,
        price: formatHomeMoneyDelta(moneyAmount(p.fullBody, currency), currency),
      },
      {
        label: simplista.variationExtraPerson,
        price: formatHomeMoneyDelta(moneyAmount(p.extraPerson, currency), currency),
      },
    ],
    bundle: {
      title: simplista.bundleTitle,
      price: formatHomeMoney(moneyAmount(p.poseSheet, currency), currency),
      includes: simplista.poseSheetIncludes,
    },
    calculator: true,
    orderKind: "simplista",
    ctaLabel: card.requestCommission,
    ctaHref: "#contacto",
    baseOptions: simplista.baseOptions,
  };
}

function buildBocetosCard(
  bocetos: HomeMessages["services"]["bocetos"],
  card: HomeMessages["services"]["card"],
  currency: HomeCurrency,
): Omit<HomeServiceCard, "id" | "contentRating"> {
  const p = HOME_SERVICE_PRICING.bocetos;
  return {
    badge: bocetos.badge,
    badgeTone: "blue",
    title: bocetos.title,
    fromPrice: formatHomeMoney(moneyAmount(p.baseNoColor, currency), currency),
    description: bocetos.description,
    carouselVariant: "bocetos",
    prices: bocetos.baseOptions.map((option) => ({
      label: option.label,
      price: formatHomeMoney(moneyAmount(bocetosBasePair(option.id), currency), currency),
    })),
    variations: [
      {
        label: bocetos.variationExtraPerson,
        price: formatHomeMoneyDelta(moneyAmount(p.extraPerson, currency), currency),
      },
      {
        label: bocetos.variationFullBody,
        price: formatHomeMoneyDelta(moneyAmount(p.fullBody, currency), currency),
      },
      {
        label: bocetos.variationSimpleBackground,
        price: formatHomeMoneyDelta(moneyAmount(p.simpleBackground, currency), currency),
      },
    ],
    extraSectionTitle: bocetos.poseSheetCheckboxLabel,
    extraPrices: [
      {
        label: bocetos.poseSheetNoColor,
        price: formatHomeMoneyDelta(moneyAmount(p.poseSheetNoColor, currency), currency),
      },
      {
        label: bocetos.poseSheetWithColor,
        price: formatHomeMoneyDelta(moneyAmount(p.poseSheetWithColor, currency), currency),
      },
    ],
    calculator: true,
    orderKind: "bocetos",
    ctaLabel: card.requestCommission,
    ctaHref: "#contacto",
    baseOptions: bocetos.baseOptions,
  };
}

function buildCompletosCard(
  completos: HomeMessages["services"]["completos"],
  card: HomeMessages["services"]["card"],
  currency: HomeCurrency,
): Omit<HomeServiceCard, "id" | "contentRating"> {
  const p = HOME_SERVICE_PRICING.completos;
  return {
    badge: completos.badge,
    badgeTone: "lilac",
    title: completos.title,
    fromPrice: formatHomeMoney(moneyAmount(p.baseOnePerson, currency), currency),
    description: completos.description,
    carouselVariant: "completos",
    prices: completos.baseOptions.map((option) => ({
      label: option.label,
      price: formatHomeMoney(moneyAmount(p.baseOnePerson, currency), currency),
    })),
    variations: [
      {
        label: completos.variationExtraPerson,
        price: formatHomeMoneyDelta(moneyAmount(p.extraPerson, currency), currency),
      },
      {
        label: completos.variationFullBody,
        price: formatHomeMoneyDelta(moneyAmount(p.fullBody, currency), currency),
      },
      {
        label: completos.variationFlatBackground,
        price: formatHomeMoneyDelta(moneyAmount(p.simpleBackground, currency), currency),
      },
      {
        label: completos.variationDetailedBackground,
        price: formatHomeMoneyDelta(moneyAmount(p.detailedBackground, currency), currency),
      },
    ],
    extraSectionTitle: completos.poseSheetCheckboxLabel,
    extraPrices: [
      {
        label: completos.variationPoseSheet,
        price: formatHomeMoney(moneyAmount(p.poseSheet, currency), currency),
      },
    ],
    calculator: true,
    orderKind: "completos",
    ctaLabel: card.requestCommission,
    ctaHref: "#contacto",
    baseOptions: completos.baseOptions,
  };
}

function buildRatedServiceCards(
  contentRating: ContentRating,
  idPrefix: string,
  simplista: Omit<HomeServiceCard, "id" | "contentRating">,
  bocetos: Omit<HomeServiceCard, "id" | "contentRating">,
  completos: Omit<HomeServiceCard, "id" | "contentRating">,
): HomeServiceCard[] {
  return [
    { ...simplista, id: `${idPrefix}-simplista`, contentRating },
    { ...bocetos, id: `${idPrefix}-bocetos`, contentRating },
    { ...completos, id: `${idPrefix}-completos`, contentRating },
  ];
}

export function buildHomeServiceCards(
  services: HomeMessages["services"],
  currency: HomeCurrency,
): HomeServiceCard[] {
  const simplista = buildSimplistaCard(services.simplista, services.card, currency);
  const bocetos = buildBocetosCard(services.bocetos, services.card, currency);
  const completos = buildCompletosCard(services.completos, services.card, currency);

  return buildRatedServiceCards("sfw", "sfw", simplista, bocetos, completos);
}
