"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, type RefObject } from "react";

const TEO_PAGE_TOP_SRC = "/works/placeholder/teoup.png" as const;
const TEO_PAGE_TOP_WIDTH = 1029;
const TEO_PAGE_TOP_HEIGHT = 1529;

type HomePageTopProps = {
  headerFocusRef?: RefObject<HTMLElement | null>;
};

export function HomePageTop({ headerFocusRef }: HomePageTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      const root = document.documentElement;
      const maxScroll = root.scrollHeight - root.clientHeight;
      setVisible(maxScroll > 0 && window.scrollY > maxScroll * 0.5);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  const scrollToTop = useCallback(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });

    const header = headerFocusRef?.current;
    if (!header) return;

    const focusDelayMs = reducedMotion ? 0 : 420;
    window.setTimeout(() => {
      header.focus({ preventScroll: true });
    }, focusDelayMs);
  }, [headerFocusRef]);

  return (
    <div
      className={`home-page-top${visible ? " home-page-top--visible" : ""}`}
      aria-hidden={!visible}
    >
      <div className="home-page-top__figure" aria-hidden="true">
        <Image
          className="home-page-top__teo"
          src={TEO_PAGE_TOP_SRC}
          alt=""
          width={TEO_PAGE_TOP_WIDTH}
          height={TEO_PAGE_TOP_HEIGHT}
          unoptimized
        />
      </div>
      <button
        type="button"
        className="home-page-top__button"
        onClick={scrollToTop}
        tabIndex={visible ? 0 : -1}
      >
        <span className="home-page-top__label">Page top</span>
        <span className="home-page-top__arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" width={14} height={14} focusable="false">
            <path
              d="M12 6 L12 17 M7 11 L12 6 L17 11"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
    </div>
  );
}
