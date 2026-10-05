"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  addHomeCartItem,
  type HomeCartAddPayload,
  getServerHomeCartSnapshot,
  HOME_STICKY_CART_REVEAL_SECTION_ID,
  HOME_STICKY_CART_REVEAL_VIEWPORT_RATIO,
  HOME_STICKY_CART_TOP_THRESHOLD_PX,
  readHomeCart,
  removeHomeCartItem,
  subscribeHomeCart,
} from "@/lib/home-cart";
import { runHomeCartFlyAnimation } from "@/lib/home-cart-fly-animation";

export type HomeCartAddOptions = {
  flyFrom?: HTMLElement | null;
};

type HomeCartContextValue = {
  items: ReturnType<typeof readHomeCart>;
  itemCount: number;
  isOpen: boolean;
  showStickyCart: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (payload: HomeCartAddPayload, options?: HomeCartAddOptions) => void;
  removeItem: (id: string) => void;
};

const HomeCartContext = createContext<HomeCartContextValue | null>(null);

export function HomeCartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [stickyCartRevealed, setStickyCartRevealed] = useState(false);
  const items = useSyncExternalStore(
    subscribeHomeCart,
    readHomeCart,
    getServerHomeCartSnapshot,
  );
  const hasCartItems = items.length > 0;

  useEffect(() => {
    if (!hasCartItems) return;

    const updateStickyReveal = () => {
      const scrollY = window.scrollY;
      if (scrollY <= HOME_STICKY_CART_TOP_THRESHOLD_PX) {
        setStickyCartRevealed(false);
        return;
      }

      const section = document.getElementById(HOME_STICKY_CART_REVEAL_SECTION_ID);
      if (!section) {
        setStickyCartRevealed(scrollY > window.innerHeight * 0.85);
        return;
      }

      const sectionTop = section.getBoundingClientRect().top + scrollY;
      const revealScrollY =
        sectionTop - window.innerHeight * (1 - HOME_STICKY_CART_REVEAL_VIEWPORT_RATIO);
      setStickyCartRevealed(scrollY >= revealScrollY);
    };

    updateStickyReveal();
    window.addEventListener("scroll", updateStickyReveal, { passive: true });
    window.addEventListener("resize", updateStickyReveal);
    return () => {
      window.removeEventListener("scroll", updateStickyReveal);
      window.removeEventListener("resize", updateStickyReveal);
    };
  }, [hasCartItems]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((payload: HomeCartAddPayload, options?: HomeCartAddOptions) => {
    addHomeCartItem(payload);
    if (!options?.flyFrom) return;
    const source = options.flyFrom;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => runHomeCartFlyAnimation(source));
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    removeHomeCartItem(id);
  }, []);

  const showStickyCart = hasCartItems && stickyCartRevealed;

  const value = useMemo(
    () => ({
      items,
      itemCount: items.length,
      isOpen,
      showStickyCart,
      openCart,
      closeCart,
      addItem,
      removeItem,
    }),
    [addItem, closeCart, isOpen, items, openCart, removeItem, showStickyCart],
  );

  return <HomeCartContext.Provider value={value}>{children}</HomeCartContext.Provider>;
}

export function useHomeCart(): HomeCartContextValue {
  const context = useContext(HomeCartContext);
  if (!context) {
    throw new Error("useHomeCart must be used within HomeCartProvider");
  }
  return context;
}
