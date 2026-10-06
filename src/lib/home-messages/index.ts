import type { HomeLocale } from "@/lib/home-locale";
import { homeMessagesEn } from "@/lib/home-messages/en";
import { homeMessagesEs } from "@/lib/home-messages/es";
import { homeMessagesPt } from "@/lib/home-messages/pt";
import type { HomeMessages } from "@/lib/home-messages/types";

const HOME_MESSAGES_BY_LOCALE: Record<HomeLocale, HomeMessages> = {
  es: homeMessagesEs,
  en: homeMessagesEn,
  pt: homeMessagesPt,
};

export function getHomeMessages(locale: HomeLocale): HomeMessages {
  return HOME_MESSAGES_BY_LOCALE[locale] ?? homeMessagesEs;
}

export type { HomeMessages, HomeFaqMessageItem, HomeFooterNavItem } from "@/lib/home-messages/types";
