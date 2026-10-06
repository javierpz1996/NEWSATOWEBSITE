"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { COMMISSION_RULES_HREF } from "@/lib/commission-rules-content";
import { useHomeMessages } from "@/hooks/use-home-messages";

const HOME_READ_BALLOON_MILO_SRC = "/works/placeholder/milo.png" as const;
const HOME_READ_BALLOON_MILO_WIDTH = 716;
const HOME_READ_BALLOON_MILO_HEIGHT = 809;

const HOME_SNS_SECTION_ID = "home-sns";

export function HomeScrollRightSquare() {
  const { scrollReminder } = useHomeMessages();
  const balloonId = useId();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [tabVisible, setTabVisible] = useState(false);
  const [balloonOpen, setBalloonOpen] = useState(false);

  useEffect(() => {
    const sns = document.getElementById(HOME_SNS_SECTION_ID);
    if (!sns) return;

    const updateVisibility = () => {
      const { bottom } = sns.getBoundingClientRect();
      const nextVisible = bottom <= 0;
      setTabVisible(nextVisible);
      if (!nextVisible) {
        setBalloonOpen(false);
      }
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!balloonOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setBalloonOpen(false);
    };

    const onPointerDown = (event: PointerEvent) => {
      const anchor = anchorRef.current;
      if (!anchor || anchor.contains(event.target as Node)) return;
      setBalloonOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [balloonOpen]);

  const toggleBalloon = useCallback(() => {
    setBalloonOpen((open) => !open);
  }, []);

  return (
    <div
      ref={anchorRef}
      className={`home-scroll-right-square-anchor${
        tabVisible ? " home-scroll-right-square-anchor--visible" : ""
      }`}
    >
      <button
        type="button"
        className="home-scroll-right-square"
        aria-expanded={balloonOpen}
        aria-controls={balloonId}
        aria-label={scrollReminder.tabAria}
        onClick={toggleBalloon}
      >
        <span className="home-scroll-right-square__label" aria-hidden="true">READ</span>
      </button>

      {balloonOpen && tabVisible ? (
        <div
          id={balloonId}
          className="home-scroll-right-square__balloon"
          role="dialog"
          aria-labelledby={`${balloonId}-title`}
        >
          <button
            type="button"
            className="home-scroll-right-square__balloon-close"
            onClick={() => setBalloonOpen(false)}
            aria-label={scrollReminder.closeAria}
          >
            ×
          </button>
          <div className="home-scroll-right-square__balloon-content">
            <p id={`${balloonId}-title`} className="home-scroll-right-square__balloon-text">
              <span className="home-scroll-right-square__balloon-text-line">
                {scrollReminder.line1}
              </span>
              <span className="home-scroll-right-square__balloon-text-line">
                <Link
                  className="home-scroll-right-square__balloon-rules"
                  href={COMMISSION_RULES_HREF}
                  onClick={() => setBalloonOpen(false)}
                >
                  {scrollReminder.rulesLink}
                </Link>
                {scrollReminder.line2After}
              </span>
            </p>
            <figure className="home-scroll-right-square__balloon-milo-figure" aria-hidden="true">
              <Image
                className="home-scroll-right-square__balloon-milo"
                src={HOME_READ_BALLOON_MILO_SRC}
                alt=""
                width={HOME_READ_BALLOON_MILO_WIDTH}
                height={HOME_READ_BALLOON_MILO_HEIGHT}
                unoptimized
              />
            </figure>
          </div>
        </div>
      ) : null}
    </div>
  );
}
