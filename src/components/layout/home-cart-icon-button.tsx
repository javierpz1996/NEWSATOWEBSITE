"use client";

import { ShoppingCart } from "lucide-react";

type HomeCartIconButtonProps = {
  itemCount: number;
  onClick: () => void;
  className?: string;
  id?: string;
  variant?: "default" | "sticky" | "nav";
};

export function HomeCartIconButton({
  itemCount,
  onClick,
  className,
  id,
  variant = "default",
}: HomeCartIconButtonProps) {
  const isChip = variant === "sticky" || variant === "nav";
  const classes = [
    "home-cart-icon-button",
    isChip ? "home-cart-icon-button--chip" : "",
    variant === "sticky" ? "home-cart-icon-button--sticky" : "",
    variant === "nav" ? "home-cart-icon-button--nav" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      id={id}
      className={classes}
      aria-label={
        itemCount > 0
          ? `Carrito, ${itemCount} pedido${itemCount === 1 ? "" : "s"}`
          : "Carrito"
      }
      onClick={onClick}
    >
      <span className="home-cart-icon-button__icon" aria-hidden="true">
        <ShoppingCart strokeWidth={isChip ? 2 : 2.25} />
      </span>
      {itemCount > 0 ? (
        <span className="home-cart-icon-button__badge" aria-hidden="true">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      ) : null}
    </button>
  );
}
