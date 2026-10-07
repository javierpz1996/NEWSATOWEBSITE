"use client";

import { useSyncExternalStore } from "react";
import {
  getServerHomeCurrencySnapshot,
  readHomeCurrency,
  subscribeHomeCurrency,
} from "@/lib/home-currency";

export function useHomeCurrency() {
  return useSyncExternalStore(
    subscribeHomeCurrency,
    readHomeCurrency,
    getServerHomeCurrencySnapshot,
  );
}
