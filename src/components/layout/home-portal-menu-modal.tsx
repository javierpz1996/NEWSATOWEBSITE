"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  HOME_PORTAL_MENU_NAV_COLUMNS,
  HOME_PORTAL_MENU_SHARE_LINKS,
} from "@/lib/home-portal-menu-nav";
import { SATO_LOGO_HEIGHT, SATO_LOGO_SRC, SATO_LOGO_WIDTH } from "@/lib/brand-assets";

type HomePortalMenuModalProps = {
  onClose: () => void;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function ShareIconX() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M13.527 10.896 20.792 3h-2.065l-6.331 7.278L7.479 3H3.214l7.571 10.932L3.214 21h2.065l6.785-7.804 5.429 7.804h4.265l-7.231-10.004Zm-2.489 2.591-.776-1.12-6.241-8.987h2.652l5.038 7.224.776 1.12 6.203 8.883h-2.652l-5.1-7.32Z"
      />
    </svg>
  );
}

function ShareIconInstagram() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.25" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" />
    </svg>
  );
}

function ShareIconMail() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden focusable="false">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 7h16v10H4V7Zm0 0 8 6 8-6"
      />
    </svg>
  );
}

function shareIconFor(id: string) {
  if (id === "share-x") return <ShareIconX />;
  if (id === "share-ig") return <ShareIconInstagram />;
  return <ShareIconMail />;
}

export function HomePortalMenuModal({ onClose }: HomePortalMenuModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleNavActivate = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus({ preventScroll: true });
    };
  }, []);

  const onDialogKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((node) => !node.hasAttribute("disabled") && node.tabIndex !== -1);

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      ref={dialogRef}
      className="home-portal-menu-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onKeyDown={onDialogKeyDown}
    >
      <div className="home-portal-menu-modal__veil" aria-hidden="true" />
      <div className="home-portal-menu-modal__panel">
        <p id={titleId} className="home-portal-menu-modal__sr-title">
          Portal menu
        </p>

        <button
          ref={closeRef}
          type="button"
          className="home-portal-menu-modal__close"
          onClick={onClose}
        >
          <span className="home-portal-menu-modal__close-mark" aria-hidden="true">×</span>
          <span className="home-portal-menu-modal__close-label">CLOSE</span>
        </button>

        <div className="home-portal-menu-modal__layout">
          <div className="home-portal-menu-modal__brand">
            <Image
              className="home-portal-menu-modal__logo"
              src={SATO_LOGO_SRC}
              alt=""
              width={SATO_LOGO_WIDTH}
              height={SATO_LOGO_HEIGHT}
              unoptimized
              priority
            />
          </div>

          <nav className="home-portal-menu-modal__nav" aria-label="Portal navigation">
            {HOME_PORTAL_MENU_NAV_COLUMNS.map((column, columnIndex) => (
              <ul
                key={columnIndex}
                className="home-portal-menu-modal__column"
                style={
                  {
                    "--portal-menu-col-delay": `${140 + columnIndex * 70}ms`,
                  } as CSSProperties
                }
              >
                {column.map((item, itemIndex) => {
                  const className = `home-portal-menu-modal__link${
                    item.isActive ? " is-active" : ""
                  }`;
                  const content = (
                    <>
                      <span className="home-portal-menu-modal__link-label">{item.label}</span>
                      <span className="home-portal-menu-modal__link-sublabel">{item.sublabel}</span>
                    </>
                  );

                  const itemStyle = {
                    "--portal-menu-item-delay": `${itemIndex * 42}ms`,
                  } as CSSProperties;

                  if (item.href.startsWith("/")) {
                    return (
                      <li key={item.id} style={itemStyle}>
                        <Link className={className} href={item.href} onClick={handleNavActivate}>
                          {content}
                        </Link>
                      </li>
                    );
                  }

                  return (
                    <li key={item.id} style={itemStyle}>
                      <a className={className} href={item.href} onClick={handleNavActivate}>
                        {content}
                      </a>
                    </li>
                  );
                })}
              </ul>
            ))}
          </nav>
        </div>

        <div className="home-portal-menu-modal__share">
          <span className="home-portal-menu-modal__share-heading">SHARE</span>
          <ul className="home-portal-menu-modal__share-list">
            {HOME_PORTAL_MENU_SHARE_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  className="home-portal-menu-modal__share-link"
                  href={link.href}
                  aria-label={link.label}
                  onClick={link.href === "#" ? (event) => event.preventDefault() : undefined}
                >
                  {shareIconFor(link.id)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
