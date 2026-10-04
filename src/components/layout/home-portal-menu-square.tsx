"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

const CAP_VIEW_WIDTH = 46;
const CAP_PIVOT_X = 46;
/** Hinge on the top edge where the cap meets the body (keeps the top stroke continuous). */
const CAP_HINGE_Y = 1.5;
const R = 10.5;
const ARC_JOIN_X = 20.5;
/** Softens the neck corners where straight segments meet the left arc (visible when the cap bends down). */
const CAP_NECK_FILLET = 2.5;

function capOutlinePath(closed: boolean) {
  const x0 = CAP_PIVOT_X;
  const xj = ARC_JOIN_X;
  const yt = 1.5;
  const yb = 18.75;
  const f = CAP_NECK_FILLET;

  const open = [
    `M${x0} ${yt}`,
    `H${xj + f}`,
    `A${f} ${f} 0 0 1 ${xj} ${yt + f}`,
    `A${R} ${R} 0 0 0 ${xj} ${yb - f}`,
    `A${f} ${f} 0 0 1 ${xj + f} ${yb}`,
    `H${x0}`,
  ].join("");

  return closed ? `${open}Z` : open;
}
const BASE_VIEW_WIDTH = 132;
const BODY_END_X = 130.5;
const BODY_SEGMENT_UNITS = BODY_END_X - CAP_PIVOT_X;
const MIN_WIDTH_PX = 88;
const MAX_WIDTH_PX = 2400;
const LOGO_GAP_PX = 16;
const LOGO_SELECTOR = ".home-page .home-header .home-logo";

const CAP_WIDTH_RATIO = CAP_VIEW_WIDTH / BASE_VIEW_WIDTH;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function measureMaxStretchWidth(barElement: HTMLElement): number {
  const logo = document.querySelector<HTMLElement>(LOGO_SELECTOR);
  const barRect = barElement.getBoundingClientRect();

  if (!logo) {
    return MAX_WIDTH_PX;
  }

  const logoRect = logo.getBoundingClientRect();
  return Math.max(
    MIN_WIDTH_PX,
    Math.min(MAX_WIDTH_PX, Math.round(barRect.right - logoRect.right - LOGO_GAP_PX)),
  );
}

/** Horizontal portal bar — drag left to widen (stops before the header logo). */
export function HomePortalMenuSquare() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);
  const [widthPx, setWidthPx] = useState<number | null>(null);
  const [layoutWidthPx, setLayoutWidthPx] = useState(120);
  const [designWidthPx, setDesignWidthPx] = useState(120);
  const [maxStretchPx, setMaxStretchPx] = useState(MAX_WIDTH_PX);
  const [isDragging, setIsDragging] = useState(false);

  const syncLayoutWidth = useCallback(() => {
    const element = rootRef.current;
    if (!element || widthPx !== null) return;
    const measured = element.getBoundingClientRect().width;
    setLayoutWidthPx(measured);
    setDesignWidthPx(measured);
  }, [widthPx]);

  const updateMaxStretch = useCallback(() => {
    const element = rootRef.current;
    if (!element) return;
    const nextMax = measureMaxStretchWidth(element);
    setMaxStretchPx(nextMax);
    setWidthPx((current) =>
      current === null ? current : clamp(current, MIN_WIDTH_PX, nextMax),
    );
    syncLayoutWidth();
  }, [syncLayoutWidth]);

  useLayoutEffect(() => {
    updateMaxStretch();
    window.addEventListener("resize", updateMaxStretch);
    return () => window.removeEventListener("resize", updateMaxStretch);
  }, [updateMaxStretch]);

  const totalWidthPx = widthPx ?? layoutWidthPx;
  const capWidthPx = Math.max(
    Math.round(CAP_WIDTH_RATIO * designWidthPx),
    Math.round(CAP_VIEW_WIDTH * 0.85),
  );
  const designBodyPx = Math.max(designWidthPx - capWidthPx, 1);
  const bodyWidthPx = Math.max(totalWidthPx - capWidthPx, 1);
  const bodyViewWidth = BODY_SEGMENT_UNITS * (bodyWidthPx / designBodyPx);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const element = rootRef.current;
    if (!element) return;

    updateMaxStretch();
    const current = element.getBoundingClientRect().width;
    if (widthPx === null) {
      setDesignWidthPx(current);
    }
    dragRef.current = { startX: event.clientX, startWidth: current };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const { startX, startWidth } = dragRef.current;
    const nextWidth = clamp(
      startWidth + (startX - event.clientX),
      MIN_WIDTH_PX,
      maxStretchPx,
    );
    setWidthPx(nextWidth);
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`home-portal-menu-square${isDragging ? " home-portal-menu-square--dragging" : ""}`}
      style={
        {
          maxWidth: `${maxStretchPx}px`,
          "--home-portal-menu-square-cap-width": `${capWidthPx}px`,
          ...(widthPx !== null ? { width: `${widthPx}px` } : {}),
        } as CSSProperties
      }
      role="slider"
      aria-label="Estirar barra del menú portal"
      aria-valuemin={MIN_WIDTH_PX}
      aria-valuemax={maxStretchPx}
      aria-valuenow={Math.round(totalWidthPx)}
      aria-orientation="horizontal"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        className="home-portal-menu-square__cap-wrap"
        style={{ width: `${capWidthPx}px` }}
      >
        <svg
          className="home-portal-menu-square__cap-svg"
          viewBox={`0 0 ${CAP_VIEW_WIDTH} 20`}
          preserveAspectRatio="xMaxYMid meet"
          focusable="false"
        >
          <g
            className="home-portal-menu-square__cap"
            style={{
              transformOrigin: `${CAP_PIVOT_X}px ${CAP_HINGE_Y}px`,
            }}
          >
            <path
              className="home-portal-menu-square__cap-fill"
              d={capOutlinePath(true)}
            />
            <path
              className="home-portal-menu-square__cap-stroke"
              d={capOutlinePath(false)}
            />
          </g>
        </svg>
      </div>

      <div className="home-portal-menu-square__body-wrap">
        <svg
          className="home-portal-menu-square__body-svg"
          viewBox={`0 0 ${bodyViewWidth} 20`}
          preserveAspectRatio="none"
          focusable="false"
        >
          <path
            className="home-portal-menu-square__body-stroke"
            d={`M0 1.5H${bodyViewWidth}M${bodyViewWidth} 1.5V18.5`}
          />
        </svg>
      </div>
    </div>
  );
}
