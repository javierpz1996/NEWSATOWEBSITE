"use client";

import { forwardRef } from "react";
import { useHomeCart } from "@/components/layout/home-cart-context";
import {
  HomePortalMenuTrigger,
  type HomePortalMenuTriggerHandle,
} from "@/components/layout/home-portal-menu-trigger";

type HomeHeaderPortalClusterProps = {
  onMenuClick?: () => void;
  onReachMaxStretch?: () => void;
};

export const HomeHeaderPortalCluster = forwardRef<
  HomePortalMenuTriggerHandle,
  HomeHeaderPortalClusterProps
>(function HomeHeaderPortalCluster({ onMenuClick, onReachMaxStretch }, ref) {
  const { openCart, itemCount } = useHomeCart();

  return (
    <HomePortalMenuTrigger
      ref={ref}
      onMenuClick={onMenuClick}
      onCartClick={openCart}
      cartItemCount={itemCount}
      onReachMaxStretch={onReachMaxStretch}
    />
  );
});
