"use client";

import { HomeCartIconButton } from "@/components/layout/home-cart-icon-button";
import { useHomeCart } from "@/components/layout/home-cart-context";

export function HomeStickyCart() {
  const { showStickyCart, openCart, itemCount } = useHomeCart();

  if (!showStickyCart || itemCount === 0) {
    return null;
  }

  return (
    <div className="home-sticky-cart">
      <HomeCartIconButton itemCount={itemCount} onClick={openCart} />
    </div>
  );
}
