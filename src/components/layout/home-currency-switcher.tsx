"use client";

import { ChevronDown, CircleDollarSign } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useHomeMessages } from "@/hooks/use-home-messages";
import {
  getHomeCurrencyLabel,
  getServerHomeCurrencySnapshot,
  HOME_CURRENCY_ORDER,
  readHomeCurrency,
  subscribeHomeCurrency,
  writeHomeCurrency,
  type HomeCurrency,
} from "@/lib/home-currency";

type HomeCurrencySwitcherProps = {
  className?: string;
};

export function HomeCurrencySwitcher({ className }: HomeCurrencySwitcherProps) {
  const { currencySwitcher } = useHomeMessages();
  const menuId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const currency = useSyncExternalStore(
    subscribeHomeCurrency,
    readHomeCurrency,
    getServerHomeCurrencySnapshot,
  );

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const selectCurrency = useCallback((next: HomeCurrency) => {
    writeHomeCurrency(next);
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      const root = wrapRef.current;
      if (!root || root.contains(event.target as Node)) return;
      closeMenu();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeMenu, menuOpen]);

  const wrapClasses = ["home-portal-menu-locale-switch-wrap", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={wrapRef} className={wrapClasses}>
      <button
        type="button"
        className="home-portal-menu-locale-switch"
        aria-label={currencySwitcher.ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={menuOpen}
        aria-controls={menuId}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <CircleDollarSign
          className="home-portal-menu-locale-switch__globe"
          aria-hidden="true"
          strokeWidth={2}
        />
        <span className="home-portal-menu-locale-switch__code">
          {getHomeCurrencyLabel(currency)}
        </span>
        <ChevronDown
          className={`home-portal-menu-locale-switch__chevron${
            menuOpen ? " home-portal-menu-locale-switch__chevron--open" : ""
          }`}
          aria-hidden="true"
          strokeWidth={2.25}
        />
      </button>

      {menuOpen ? (
        <ul
          id={menuId}
          className="home-portal-menu-locale-switch__menu"
          role="listbox"
          aria-label={currencySwitcher.menuAriaLabel}
        >
          {HOME_CURRENCY_ORDER.map((option) => {
            const selected = option === currency;
            return (
              <li key={option} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  aria-label={currencySwitcher.options[option]}
                  className={`home-portal-menu-locale-switch__option home-portal-menu-locale-switch__option--currency${
                    selected ? " home-portal-menu-locale-switch__option--selected" : ""
                  }`}
                  onClick={() => selectCurrency(option)}
                >
                  <span className="home-portal-menu-locale-switch__option-label home-portal-menu-locale-switch__option-label--currency">
                    {currencySwitcher.options[option]}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
