"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { HomeCartIconButton } from "@/components/layout/home-cart-icon-button";
import { useHomeCart } from "@/components/layout/home-cart-context";

const STICKY_CART_EASE = [0.23, 1, 0.32, 1] as const;

export function HomeStickyCart() {
  const { showStickyCart, openCart, itemCount } = useHomeCart();
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {showStickyCart ? (
        <motion.div
          key="home-sticky-cart"
          className="home-sticky-cart"
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{
            duration: reduceMotion ? 0.12 : 0.26,
            ease: STICKY_CART_EASE,
          }}
        >
          <HomeCartIconButton
            itemCount={itemCount}
            onClick={openCart}
            variant="sticky"
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
