"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { formatHomeCartUsd } from "@/lib/home-cart";
import { useHomeCart } from "@/components/layout/home-cart-context";

export function HomeCartDrawer() {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const { items, isOpen, closeCart, removeItem } = useHomeCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeCart, isOpen]);

  const onBackdropClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) closeCart();
    },
    [closeCart],
  );

  if (!isOpen) return null;

  return (
    <div className="home-cart-drawer" onClick={onBackdropClick}>
      <div
        ref={panelRef}
        className="home-cart-drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="home-cart-drawer__header">
          <h2 id={titleId} className="home-cart-drawer__title">Carrito</h2>
          <button
            type="button"
            className="home-cart-drawer__close"
            onClick={closeCart}
            aria-label="Cerrar carrito"
          >
            ×
          </button>
        </header>

        {items.length === 0 ? (
          <p className="home-cart-drawer__empty">Tu carrito está vacío.</p>
        ) : (
          <ul className="home-cart-drawer__list">
            {items.map((item) => (
              <li key={item.id} className="home-cart-drawer__item">
                <div className="home-cart-drawer__item-head">
                  <h3 className="home-cart-drawer__item-title">{item.serviceTitle}</h3>
                  <button
                    type="button"
                    className="home-cart-drawer__remove"
                    onClick={() => removeItem(item.id)}
                  >
                    Quitar
                  </button>
                </div>
                <ul className="home-cart-drawer__lines">
                  {item.lines.map((line) => (
                    <li key={`${item.id}-${line.label}`}>
                      <span>{line.label}</span>
                      <span>{formatHomeCartUsd(line.priceUsd)}</span>
                    </li>
                  ))}
                </ul>
                <p className="home-cart-drawer__item-total">
                  Total: <strong>{formatHomeCartUsd(item.totalUsd)}</strong>
                </p>
              </li>
            ))}
          </ul>
        )}

        <footer className="home-cart-drawer__footer">
          <Link className="home-cart-drawer__contact" href="#contacto" onClick={closeCart}>
            Ir a contacto
          </Link>
        </footer>
      </div>
    </div>
  );
}
