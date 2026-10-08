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
import { useHomeMessages } from "@/hooks/use-home-messages";
import { isArtistSocialExternalUrl } from "@/lib/artist-social-links";
import { buildHomePortalMenuNavColumns } from "@/lib/home-portal-menu-nav";
import { SATO_LOGO_HEIGHT, SATO_LOGO_SRC, SATO_LOGO_WIDTH } from "@/lib/brand-assets";

type HomePortalMenuModalProps = {
  onClose: () => void;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function HomePortalMenuModal({ onClose }: HomePortalMenuModalProps) {
  const { portal } = useHomeMessages();
  const navColumns = buildHomePortalMenuNavColumns(portal);
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
    dialogRef.current?.focus({ preventScroll: true });

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
      tabIndex={-1}
      onKeyDown={onDialogKeyDown}
    >
      <div className="home-portal-menu-modal__veil" aria-hidden="true" />
      <div className="home-portal-menu-modal__panel">
        <p id={titleId} className="home-portal-menu-modal__sr-title">
          {portal.modal.title}
        </p>

        <button
          ref={closeRef}
          type="button"
          className="home-portal-menu-modal__close"
          onClick={onClose}
        >
          <span className="home-portal-menu-modal__close-mark" aria-hidden="true">×</span>
          <span className="home-portal-menu-modal__close-label">{portal.modal.close}</span>
        </button>

        <div className="home-portal-menu-modal__layout">
          <div className="home-portal-menu-modal__brand">
            <Image
              className="home-portal-menu-modal__logo"
              src={SATO_LOGO_SRC}
              alt=""
              width={SATO_LOGO_WIDTH}
              height={SATO_LOGO_HEIGHT}
              priority
              sizes="120px"
            />
          </div>

          <nav className="home-portal-menu-modal__nav" aria-label={portal.modal.navAria}>
            {navColumns.map((column, columnIndex) => (
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
                      {item.comingSoon ? (
                        <span className="home-portal-menu-modal__coming-soon">
                          {item.comingSoon}
                        </span>
                      ) : null}
                      <span className="home-portal-menu-modal__link-label">{item.label}</span>
                      <span className="home-portal-menu-modal__link-sublabel">{item.sublabel}</span>
                    </>
                  );

                  const itemStyle = {
                    "--portal-menu-item-delay": `${itemIndex * 42}ms`,
                  } as CSSProperties;

                  if (item.comingSoon) {
                    return (
                      <li key={item.id} style={itemStyle}>
                        <span
                          className={`${className} is-coming-soon`}
                          aria-disabled="true"
                        >
                          {content}
                        </span>
                      </li>
                    );
                  }

                  if (item.href.startsWith("/")) {
                    return (
                      <li key={item.id} style={itemStyle}>
                        <Link className={className} href={item.href} onClick={handleNavActivate}>
                          {content}
                        </Link>
                      </li>
                    );
                  }

                  const external = isArtistSocialExternalUrl(item.href);

                  return (
                    <li key={item.id} style={itemStyle}>
                      <a
                        className={className}
                        href={item.href}
                        onClick={external ? undefined : handleNavActivate}
                        {...(external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {content}
                      </a>
                    </li>
                  );
                })}
              </ul>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
