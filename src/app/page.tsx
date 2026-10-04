"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HomeAnimations } from "@/components/layout/home-animations";
import { HomeCommissionsOpen } from "@/components/layout/home-commissions-open";
import { HomePageIntro } from "@/components/layout/home-page-intro";
import { HomeServices } from "@/components/layout/home-services";
import { HomeSnsBar } from "@/components/layout/home-sns-bar";
import { SATO_LOGO_HEIGHT, SATO_LOGO_SRC, SATO_LOGO_WIDTH } from "@/lib/brand-assets";

export default function Home() {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeWork, setActiveWork] = useState(0);
  const [isFullScreenStripActive, setIsFullScreenStripActive] = useState(false);
  const editorialShiftRef = useRef<HTMLDivElement>(null);
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
    const durationMs = reducedMotion ? 2000 : 7200;

    const animation = shift.animate(
      [
        { transform: "translate3d(0, 0, 0)" },
        { transform: "translate3d(-36px, 0, 0)", offset: 0.35 },
        { transform: "translate3d(-22px, 0, 0)", offset: 0.58 },
        { transform: "translate3d(4px, 0, 0)", offset: 0.82 },
        { transform: "translate3d(0, 0, 0)" },
      ],
      {
        duration: durationMs,
        iterations: Infinity,
        easing: "cubic-bezier(0.34, 1.25, 0.64, 1)",
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

  return (
    <>
      <HomePageIntro pageRef={pageRef} headerFocusRef={headerFocusRef} />
      <main ref={pageRef} className="home-page">
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
          <nav aria-label="Navegación principal" className="home-nav">
            <a className="is-selected" href="#animaciones" aria-current="page">
              Trabajos
            </a>
            <a href="#inicio">Acerca</a>
            <a href="#comisiones">Comisiones</a>
            <a href="#contacto">Contacto</a>
          </nav>
        </div>
      </header>

      <section id="inicio" className="home-hero">
        <div className="home-hero-copy">
          <div
            className={`home-hero-top-row${
              isFullScreenStripActive ? " is-fullscreen-strip-active is-images-shifted" : ""
            }`}
          >
            <div className="home-artist-lockup home-intro-reveal-lockup">
              <div className="home-artist-lockup-stack">
                <p className="home-artist-name">SATO</p>
                <h1 className="home-artist-kanji">佐藤</h1>
                <p className="home-artist-role">Anime &amp; Illustration Artist</p>
                <p className="home-artist-location">
                  <span className="home-artist-location-pin" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.75" fill="none" />
                    </svg>
                  </span>
                  <span className="home-artist-location-flag" aria-hidden="true">
                    🇦🇷
                  </span>
                  <span className="home-artist-location-label">Argentina</span>
                </p>
              </div>
            </div>
            <div
              ref={editorialShiftRef}
              className="home-hero-bar-media home-intro-reveal-editorial"
            >
              <div className="home-editorial-strip home-editorial-strip-left" aria-hidden="true">
                <span>SATO WORKS</span>
                <span>SATO WORKS</span>
                <span>SATO WORKS</span>
              </div>
              <div className="home-editorial-tiles">
                {["01", "02", "03"].map((number) => (
                  <div className="home-editorial-tile" key={number}>
                    <Image
                      className="home-editorial-tile-image"
                      src="/works/placeholder/dibujo-1.png"
                      alt={`Obra de muestra ${number}`}
                      fill
                      unoptimized
                      sizes="(max-width: 760px) 28vw, 13vw"
                    />
                  </div>
                ))}
              </div>
            </div>
            <button
              className="home-editorial-strip home-editorial-strip-right home-editorial-strip-hazard home-intro-reveal-hazard"
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

      <HomeSnsBar />

      <HomeCommissionsOpen />

      <HomeServices />

      <HomeAnimations />

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

      <section id="contacto" className="home-contact"><p className="home-eyebrow">04 / CONTACTO</p><div className="home-contact-row"><h2>¿Hablamos<br /><em>de una idea?</em></h2><a className="home-contact-button" href="mailto:hola@example.com">Escribir un mensaje <span>↗</span></a></div><p className="home-placeholder-note">Dirección de correo temporal: reemplazar por el contacto real.</p></section>

      <footer className="home-footer">
        <Link href="/" className="home-logo" aria-label="Inicio">
          <Image
            className="home-logo-mark home-logo-mark--footer"
            src={SATO_LOGO_SRC}
            alt="Sato"
            width={SATO_LOGO_WIDTH}
            height={SATO_LOGO_HEIGHT}
            unoptimized
          />
        </Link>
        <span>UN ESPACIO PARA LA OBRA</span>
        <div>
          <Link href="/desing-system">Sistema visual ↗</Link>
          <a href="#inicio">Volver arriba ↑</a>
        </div>
      </footer>
    </main>
    </>
  );
}
