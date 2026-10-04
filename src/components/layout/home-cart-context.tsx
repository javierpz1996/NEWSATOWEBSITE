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
  HOME_STICKY_CART_TOP_THRESHOLD_PX,
  readHomeCart,
  removeHomeCartItem,
  subscribeHomeCart,
} from "@/lib/home-cart";

type HomeCartContextValue = {
  items: ReturnType<typeof readHomeCart>;
  itemCount: number;
  isOpen: boolean;
  showStickyCart: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (payload: HomeCartAddPayload) => void;
  addPurchaseToCart: (payload: HomeCartAddPayload) => void;
  removeItem: (id: string) => void;
};

const HomeCartContext = createContext<HomeCartContextValue | null>(null);

export function HomeCartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [stickyCartArmed, setStickyCartArmed] = useState(false);
  const [stickyCartScrollUnlocked, setStickyCartScrollUnlocked] = useState(false);
  const items = useSyncExternalStore(
    subscribeHomeCart,
    readHomeCart,
    getServerHomeCartSnapshot,
  );

  useEffect(() => {
    if (!stickyCartArmed) return;

    const onScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY <= HOME_STICKY_CART_TOP_THRESHOLD_PX) {
        setStickyCartArmed(false);
        setStickyCartScrollUnlocked(false);
        return;
      }
      setStickyCartScrollUnlocked(true);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [stickyCartArmed]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((payload: HomeCartAddPayload) => {
    addHomeCartItem(payload);
  }, []);

  const addPurchaseToCart = useCallback((payload: HomeCartAddPayload) => {
    addHomeCartItem(payload);
    setStickyCartArmed(true);
    if (window.scrollY > HOME_STICKY_CART_TOP_THRESHOLD_PX) {
      setStickyCartScrollUnlocked(true);
    }
  }, []);

  const removeItem = useCallback((id: string) => {
    removeHomeCartItem(id);
  }, []);

  const showStickyCart = stickyCartArmed && stickyCartScrollUnlocked;

  const value = useMemo(
    () => ({
      items,
      itemCount: items.length,
      isOpen,
      showStickyCart,
      openCart,
      closeCart,
      addItem,
      addPurchaseToCart,
      removeItem,
    }),
    [
      addItem,
      addPurchaseToCart,
      closeCart,
      isOpen,
      items,
      openCart,
      removeItem,
      showStickyCart,
    ],
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
