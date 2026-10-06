"use client";

import { useSyncExternalStore } from "react";
import { getHomeMessages, type HomeMessages } from "@/lib/home-messages";
import {
  getServerHomeLocaleSnapshot,
  readHomeLocale,
  subscribeHomeLocale,
  type HomeLocale,
} from "@/lib/home-locale";

export function useHomeLocale(): HomeLocale {
  return useSyncExternalStore(
    subscribeHomeLocale,
    readHomeLocale,
    getServerHomeLocaleSnapshot,
  );
}

export function useHomeMessages(): HomeMessages {
  const locale = useHomeLocale();
  return getHomeMessages(locale);
}
