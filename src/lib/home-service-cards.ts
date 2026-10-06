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

function buildSimplistaCard(
  simplista: HomeMessages["services"]["simplista"],
  card: HomeMessages["services"]["card"],
): Omit<HomeServiceCard, "id" | "contentRating"> {
  return {
    badge: simplista.badge,
    badgeTone: "mint",
    title: simplista.title,
    fromPrice: simplista.fromPrice,
    description: simplista.description,
    carouselVariant: "simplista",
    prices: simplista.baseOptions.map((option) => ({
      label: option.label,
      price: `${option.priceUsd} USD`,
    })),
    variations: [
      { label: simplista.variationFullBody, price: "+5 USD" },
      { label: simplista.variationExtraPerson, price: "+7 USD" },
    ],
    bundle: {
      title: simplista.bundleTitle,
      price: simplista.bundlePrice,
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
): Omit<HomeServiceCard, "id" | "contentRating"> {
  return {
    badge: bocetos.badge,
    badgeTone: "blue",
    title: bocetos.title,
    fromPrice: bocetos.fromPrice,
    description: bocetos.description,
    carouselVariant: "bocetos",
    prices: bocetos.baseOptions.map((option) => ({
      label: option.label,
      price: `${option.priceUsd} USD`,
    })),
    variations: [
      { label: bocetos.variationExtraPerson, price: "+15 USD" },
      { label: bocetos.variationFullBody, price: "+10 USD" },
      { label: bocetos.variationSimpleBackground, price: "+25 USD" },
    ],
    extraSectionTitle: bocetos.poseSheetTitle,
    extraPrices: [
      {
        label: bocetos.poseSheetNoColor,
        price: `+${bocetos.poseSheetNoColorPriceUsd} USD`,
      },
      {
        label: bocetos.poseSheetWithColor,
        price: `+${bocetos.poseSheetWithColorPriceUsd} USD`,
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
): Omit<HomeServiceCard, "id" | "contentRating"> {
  return {
    badge: completos.badge,
    badgeTone: "lilac",
    title: completos.title,
    fromPrice: completos.fromPrice,
    description: completos.description,
    carouselVariant: "completos",
    prices: completos.baseOptions.map((option) => ({
      label: option.label,
      price: `${option.priceUsd} USD`,
    })),
    variations: [
      { label: completos.variationExtraPerson, price: "+80 USD" },
      { label: completos.variationFullBody, price: "+50 USD" },
      { label: completos.variationFlatBackground, price: "+50 USD" },
      { label: completos.variationDetailedBackground, price: "+100 USD" },
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

export function buildHomeServiceCards(services: HomeMessages["services"]): HomeServiceCard[] {
  const simplista = buildSimplistaCard(services.simplista, services.card);
  const bocetos = buildBocetosCard(services.bocetos, services.card);
  const completos = buildCompletosCard(services.completos, services.card);

  return buildRatedServiceCards("sfw", "sfw", simplista, bocetos, completos);
}
