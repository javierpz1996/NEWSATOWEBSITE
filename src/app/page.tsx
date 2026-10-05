"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HomeAnimations } from "@/components/layout/home-animations";
import { HomeArtistLockup } from "@/components/layout/home-artist-lockup";
import { HomeContact } from "@/components/layout/home-contact";
import { HomeCookieConsent } from "@/components/layout/home-cookie-consent";
import { HomeCommissionsOpen } from "@/components/layout/home-commissions-open";
import { HomeFaq } from "@/components/layout/home-faq";
import { HomeSectionsDotBook } from "@/components/layout/home-sections-dot-book";
import { HomeSectionsDotBorders } from "@/components/layout/home-sections-dot-borders";
import { HomePageIntro } from "@/components/layout/home-page-intro";
import { HomePageTop } from "@/components/layout/home-page-top";
import { HomeScrollRightSquare } from "@/components/layout/home-scroll-right-square";
import { HomePortalMenuModal } from "@/components/layout/home-portal-menu-modal";
import { HomeCartDrawer } from "@/components/layout/home-cart-drawer";
import { HomeCartProvider } from "@/components/layout/home-cart-context";
import { HomeStickyCart } from "@/components/layout/home-sticky-cart";
import { HomeHeaderPortalCluster } from "../components/layout/home-header-portal-cluster";
import type { HomePortalMenuTriggerHandle } from "@/components/layout/home-portal-menu-trigger";
import { HomeServices } from "@/components/layout/home-services";
import { HomeSnsBar } from "@/components/layout/home-sns-bar";
import {
  homeHeroReplayRowClassName,
  useHomeHeroReplay,
} from "@/hooks/use-home-hero-replay";
import { useHomeHeroStableViewport } from "@/hooks/use-home-hero-stable-viewport";
import { SATO_LOGO_HEIGHT, SATO_LOGO_SRC, SATO_LOGO_WIDTH } from "@/lib/brand-assets";
import { HOME_FOOTER_NAV } from "@/lib/home-footer-nav";

const HERO_EDITORIAL_TILE = "/works/placeholder/dibujo-1.png" as const;

const HERO_EDITORIAL_TILES = [
  { id: "01", src: HERO_EDITORIAL_TILE },
  { id: "02", src: HERO_EDITORIAL_TILE },
  { id: "03", src: HERO_EDITORIAL_TILE },
] as const;

/** Temporary: hide header nav links until routes/sections are ready for launch. */
const HOME_HEADER_NAV_VISIBLE = false;

/** Temporary: hide left dot strip + book stack on Comisiones → Animaciones. */
const HOME_SECTIONS_LEFT_DECOR_VISIBLE = false;

export default function Home() {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isPortalMenuOpen, setIsPortalMenuOpen] = useState(false);
  const [activeWork, setActiveWork] = useState(0);
  const [isFullScreenStripActive, setIsFullScreenStripActive] = useState(false);
  const editorialShiftRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroReplay = useHomeHeroReplay(heroSectionRef);
  useHomeHeroStableViewport();
  const pageRef = useRef<HTMLElement>(null);
  const headerFocusRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const shift = editorialShiftRef.current;
    if (!shift) return;

    if (!isFullScreenStripActive) {
      shift.style.transform = "translate3d(0, 0, 0)";
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const durationMs = reducedMotion ? 1600 : 2800;

    const animation = shift.animate(
      [
        { transform: "translate3d(0, 0, 0)" },
        { transform: "translate3d(-34px, 0, 0)", offset: 0.38 },
        { transform: "translate3d(8px, 0, 0)", offset: 0.62 },
        { transform: "translate3d(-14px, 0, 0)", offset: 0.8 },
        { transform: "translate3d(0, 0, 0)" },
      ],
      {
        duration: durationMs,
        iterations: Infinity,
        easing: "cubic-bezier(0.34, 1.35, 0.55, 1)",
        fill: "auto",
      },
    );

    return () => {
      animation.cancel();
      shift.style.transform = "translate3d(0, 0, 0)";
    };
  }, [isFullScreenStripActive]);

  useEffect(() => {
    if (!isGalleryOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsGalleryOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isGalleryOpen]);

  const portalMenuTriggerRef = useRef<HomePortalMenuTriggerHandle>(null);

  const openPortalMenu = useCallback(() => {
    portalMenuTriggerRef.current?.resetRuleToMinWidth();
    setIsPortalMenuOpen(true);
  }, []);

  const closePortalMenu = useCallback(() => {
    setIsPortalMenuOpen(false);
  }, []);

  return (
    <>
      <HomePageIntro pageRef={pageRef} headerFocusRef={headerFocusRef} />
      <HomeCartProvider>
      <main ref={pageRef} className="home-page">
      <div className="home-hero-backdrop">
      <header
        ref={headerFocusRef}
        className="home-header home-intro-reveal-header"
        tabIndex={-1}
      >
        <div className="home-header-left">
          <Link href="/" className="home-logo" aria-label="Inicio">
            <Image
              className="home-logo-mark"
              src={SATO_LOGO_SRC}
              alt="Sato"
              width={SATO_LOGO_WIDTH}
              height={SATO_LOGO_HEIGHT}
              priority
              unoptimized
            />
          </Link>
          {HOME_HEADER_NAV_VISIBLE ? (
            <nav aria-label="Navegación principal" className="home-nav">
              <a className="is-selected" href="#animaciones" aria-current="page">
                Trabajos
              </a>
              <a href="#inicio">Acerca</a>
              <a href="#comisiones">Comisiones</a>
              <a href="#contacto">Contacto</a>
            </nav>
          ) : null}
          <div className="home-header-portal-cluster">
            <div className="home-header-portal-stack">
              <HomeHeaderPortalCluster
                ref={portalMenuTriggerRef}
                onMenuClick={openPortalMenu}
                onReachMaxStretch={openPortalMenu}
              />
            </div>
          </div>
        </div>
      </header>

      <section id="inicio" ref={heroSectionRef} className="home-hero">
        <div className="home-hero-copy">
          <div
            className={homeHeroReplayRowClassName(
              heroReplay,
              `home-hero-top-row${
                isFullScreenStripActive ? " is-fullscreen-strip-active is-images-shifted" : ""
              }`,
            )}
          >
            <HomeArtistLockup />
            <div
              ref={editorialShiftRef}
              className="home-hero-bar-media home-intro-reveal-editorial"
            >
              <div
                className="home-editorial-strip home-editorial-strip-left home-hero-replay-item home-hero-replay-item--strip-left"
                aria-hidden="true"
              >
                <span>SATO WORKS</span>
                <span>SATO WORKS</span>
                <span>SATO WORKS</span>
              </div>
              <div className="home-editorial-tiles">
                {HERO_EDITORIAL_TILES.map((tile, index) => (
                  <div
                    className={`home-editorial-tile home-hero-replay-item home-hero-replay-item--tile home-hero-replay-item--tile-${index + 1}`}
                    key={tile.id}
                  >
                    <Image
                      className="home-editorial-tile-image"
                      src={tile.src}
                      alt={`Obra de muestra ${tile.id}`}
                      fill
                      unoptimized
                      sizes="(max-width: 760px) 28vw, 13vw"
                    />
                  </div>
                ))}
              </div>
            </div>
            <button
              className="home-editorial-strip home-editorial-strip-right home-editorial-strip-hazard home-intro-reveal-hazard home-hero-replay-item home-hero-replay-item--strip-right"
              type="button"
              aria-label="Ver las obras en pantalla completa"
              onPointerEnter={() => setIsFullScreenStripActive(true)}
              onPointerLeave={() => setIsFullScreenStripActive(false)}
              onFocus={() => setIsFullScreenStripActive(true)}
              onBlur={() => setIsFullScreenStripActive(false)}
              onClick={() => {
                setActiveWork(0);
                setIsGalleryOpen(true);
              }}
            >
              <span className="home-editorial-strip-label">FULL SCREEN</span>
              <span className="home-editorial-chevron" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7 10 L12 15 L17 10"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="home-editorial-strip-label">SHOW BACKGROUND</span>
            </button>
          </div>
        </div>
      </section>
      </div>

      <div className="home-sections-sidebar-wrap">
        {HOME_SECTIONS_LEFT_DECOR_VISIBLE ? (
          <div className="home-sections-left-decor">
            <HomeSectionsDotBorders />
            <HomeSectionsDotBook />
          </div>
        ) : null}

        <div className="home-sections-sidebar-wrap__main">
          <HomeCommissionsOpen />
          <HomeSnsBar />
          <HomeServices />
          <HomeAnimations />
        </div>
      </div>

      <HomeFaq />

      <HomeContact />

      {isPortalMenuOpen ? <HomePortalMenuModal onClose={closePortalMenu} /> : null}

      {isGalleryOpen ? (
        <div
          className="home-gallery-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Obras seleccionadas"
          onClick={() => setIsGalleryOpen(false)}
        >
          <div className="home-gallery-dialog" onClick={(event) => event.stopPropagation()}>
            <button
              className="home-gallery-close"
              type="button"
              aria-label="Cerrar galería"
              onClick={() => setIsGalleryOpen(false)}
            >
              ×
            </button>
            <button
              className="home-gallery-arrow home-gallery-arrow-left"
              type="button"
              aria-label="Obra anterior"
              onClick={() => setActiveWork((activeWork + 2) % 3)}
            >
              ←
            </button>
            <figure className="home-gallery-single">
              <Image
                src="/works/placeholder/dibujo-1.png"
                alt={`Obra ampliada ${activeWork + 1}`}
                fill
                sizes="100vw"
              />
              <figcaption>
                OBRA {String(activeWork + 1).padStart(2, "0")} / 03
              </figcaption>
            </figure>
            <button
              className="home-gallery-arrow home-gallery-arrow-right"
              type="button"
              aria-label="Obra siguiente"
              onClick={() => setActiveWork((activeWork + 1) % 3)}
            >
              →
            </button>
          </div>
        </div>
      ) : null}

      <footer className="home-footer">
        <Link href="/" className="home-logo home-footer-brand" aria-label="Inicio">
          <Image
            className="home-logo-mark home-logo-mark--footer"
            src={SATO_LOGO_SRC}
            alt="Sato"
            width={SATO_LOGO_WIDTH}
            height={SATO_LOGO_HEIGHT}
            unoptimized
          />
        </Link>
        <nav className="home-footer-nav" aria-label="Secciones de la página">
          {HOME_FOOTER_NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </footer>
    </main>
      <HomePageTop headerFocusRef={headerFocusRef} />
      <HomeScrollRightSquare />
      <HomeCookieConsent />
      <HomeStickyCart />
      <HomeCartDrawer />
      </HomeCartProvider>
    </>
  );
}
