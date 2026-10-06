import type { HomeMessages } from "@/lib/home-messages/types";

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

export type HomeServiceCard = {
  id: string;
  badge: string;
  badgeTone: "mint" | "rose" | "blue" | "lilac";
  title: string;
  fromPrice?: string;
  description: string;
  contentRating: ContentRating;
  prices?: ServicePriceRow[];
  variations?: ServicePriceRow[];
  bundle?: ServiceBundle;
  calculator?: boolean;
  ctaLabel: string;
  ctaHref: string;
  baseOptions: HomeMessages["services"]["simplista"]["baseOptions"];
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
    ctaLabel: card.requestCommission,
    ctaHref: "#contacto",
    baseOptions: simplista.baseOptions,
  };
}

function buildSimplistaColoreadoCards(
  template: Omit<HomeServiceCard, "id" | "contentRating">,
  contentRating: ContentRating,
  idPrefix: string,
): HomeServiceCard[] {
  return Array.from({ length: 2 }, (_, index) => ({
    ...template,
    id: `${idPrefix}-${index + 1}`,
    contentRating,
  }));
}

export function buildHomeServiceCards(services: HomeMessages["services"]): HomeServiceCard[] {
  const template = buildSimplistaCard(services.simplista, services.card);
  return [
    ...buildSimplistaColoreadoCards(template, "sfw", "simplista-colored-sfw"),
    ...buildSimplistaColoreadoCards(template, "nsfw", "simplista-colored-nsfw"),
  ];
}
