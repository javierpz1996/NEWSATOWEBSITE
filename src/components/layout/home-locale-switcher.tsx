"use client";

import { ChevronDown, Globe } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  getHomeLocaleLabel,
  getHomeLocaleName,
  getServerHomeLocaleSnapshot,
  HOME_LOCALE_ORDER,
  readHomeLocale,
  subscribeHomeLocale,
  writeHomeLocale,
  type HomeLocale,
} from "@/lib/home-locale";

type HomeLocaleSwitcherProps = {
  className?: string;
};

export function HomeLocaleSwitcher({ className }: HomeLocaleSwitcherProps) {
  const menuId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const locale = useSyncExternalStore(
    subscribeHomeLocale,
    readHomeLocale,
    getServerHomeLocaleSnapshot,
  );

  useLayoutEffect(() => {
    document.documentElement.lang = readHomeLocale();
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const selectLocale = useCallback((next: HomeLocale) => {
    writeHomeLocale(next);
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
        aria-label="Idioma"
        aria-haspopup="listbox"
        aria-expanded={menuOpen}
        aria-controls={menuId}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <Globe className="home-portal-menu-locale-switch__globe" aria-hidden="true" strokeWidth={2} />
        <span className="home-portal-menu-locale-switch__code">{getHomeLocaleLabel(locale)}</span>
        <ChevronDown
          className={`home-portal-menu-locale-switch__chevron${
            menuOpen ? " home-portal-menu-locale-switch__chevron--open" : ""
          }`}
          aria-hidden="true"
          strokeWidth={2.25}
        />
      </button>

      {menuOpen ? (
        <ul id={menuId} className="home-portal-menu-locale-switch__menu" role="listbox" aria-label="Idioma">
          {HOME_LOCALE_ORDER.map((option) => {
            const selected = option === locale;
            return (
              <li key={option} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`home-portal-menu-locale-switch__option${
                    selected ? " home-portal-menu-locale-switch__option--selected" : ""
                  }`}
                  onClick={() => selectLocale(option)}
                >
                  <span className="home-portal-menu-locale-switch__option-code">
                    {getHomeLocaleLabel(option)}
                  </span>
                  <span className="home-portal-menu-locale-switch__option-label">
                    {getHomeLocaleName(option)}
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
