"use client";

import Image from "next/image";
import { HomeCartIconButton } from "@/components/layout/home-cart-icon-button";
import { HOME_CART_BUTTON_ID } from "@/lib/home-cart";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  clampPortalMenuWidth,
  measurePortalMenuMaxStretchWidth,
  PORTAL_MENU_AUTO_OPEN_DELAY_MS,
  PORTAL_MENU_RULE_MIN_WIDTH_PX,
  PORTAL_MENU_RULE_MAX_STRETCH_PX,
} from "@/components/layout/home-portal-menu-stretch";
import { PortalMenuRuleBlotchPattern } from "@/components/layout/portal-menu-rule-blotch-pattern";
import {
  PORTAL_MENU_RULE_CAT_AT_MAX_HEIGHT,
  PORTAL_MENU_RULE_CAT_AT_MAX_SRC,
  PORTAL_MENU_RULE_CAT_AT_MAX_WIDTH,
  PORTAL_MENU_RULE_CAT_HEIGHT,
  PORTAL_MENU_RULE_CAT_SRC,
  PORTAL_MENU_RULE_CAT_WIDTH,
} from "@/lib/portal-menu-assets";

const RULE_VIEW_HEIGHT = 16;
const RULE_CAP_VIEW_WIDTH = 44;
const RULE_CAP_WIDTH_RATIO = 0.17;
const RULE_CAP_R = 6.5;
const RULE_CAP_ARC_JOIN_X = 11;
const RULE_CAP_TOP_Y = 1.5;
const RULE_CAP_BOTTOM_Y = 14.85;

function portalMenuRulePath(bodyEndX: number) {
  const xj = RULE_CAP_ARC_JOIN_X;
  return [
    `M${bodyEndX} ${RULE_CAP_TOP_Y}`,
    `H${xj}`,
    `A${RULE_CAP_R} ${RULE_CAP_R} 0 0 0 ${xj} ${RULE_CAP_BOTTOM_Y}`,
    `H${bodyEndX}`,
    "Z",
  ].join("");
}

function ruleViewWidth(totalWidthPx: number) {
  const capWidthPx = Math.max(totalWidthPx * RULE_CAP_WIDTH_RATIO, 1);
  const bodyWidthPx = Math.max(totalWidthPx - capWidthPx, 1);
  const bodyViewUnits = RULE_CAP_VIEW_WIDTH * (bodyWidthPx / capWidthPx);
  return RULE_CAP_VIEW_WIDTH + bodyViewUnits;
}

export type HomePortalMenuTriggerHandle = {
  resetRuleToMinWidth: () => void;
};

type HomePortalMenuTriggerProps = {
  onMenuClick?: () => void;
  onCartClick?: () => void;
  cartItemCount?: number;
  /** Fires once each time the bar reaches max stretch (cat2). */
  onReachMaxStretch?: () => void;
};

export const HomePortalMenuTrigger = forwardRef<
  HomePortalMenuTriggerHandle,
  HomePortalMenuTriggerProps
>(function HomePortalMenuTrigger(
  { onMenuClick, onCartClick, cartItemCount = 0, onReachMaxStretch },
  ref,
) {
  const blotchPatternId = useId().replace(/:/g, "");
  const blotchEdgeFilterId = useId().replace(/:/g, "");
  const blockRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);
  const [widthPx, setWidthPx] = useState<number | null>(null);
  const [layoutWidthPx, setLayoutWidthPx] = useState(PORTAL_MENU_RULE_MIN_WIDTH_PX);
  const [maxStretchPx, setMaxStretchPx] = useState(PORTAL_MENU_RULE_MAX_STRETCH_PX);

  const resetRuleToMinWidth = useCallback(() => {
    setWidthPx(PORTAL_MENU_RULE_MIN_WIDTH_PX);
    setLayoutWidthPx(PORTAL_MENU_RULE_MIN_WIDTH_PX);
  }, []);

  useImperativeHandle(ref, () => ({ resetRuleToMinWidth }), [resetRuleToMinWidth]);

  const syncLayoutWidth = useCallback(() => {
    const element = blockRef.current;
    if (!element || widthPx !== null) return;
    setLayoutWidthPx(element.getBoundingClientRect().width);
  }, [widthPx]);

  const updateMaxStretch = useCallback(() => {
    const element = blockRef.current;
    if (!element) return;
    const nextMax = measurePortalMenuMaxStretchWidth(element);
    setMaxStretchPx(nextMax);
    setWidthPx((current) =>
      current === null
        ? current
        : clampPortalMenuWidth(current, PORTAL_MENU_RULE_MIN_WIDTH_PX, nextMax),
    );
    syncLayoutWidth();
  }, [syncLayoutWidth]);

  useLayoutEffect(() => {
    updateMaxStretch();
    window.addEventListener("resize", updateMaxStretch);
    return () => window.removeEventListener("resize", updateMaxStretch);
  }, [updateMaxStretch]);

  const totalWidthPx = widthPx ?? layoutWidthPx;
  const ruleViewBoxWidth = ruleViewWidth(totalWidthPx);
  const isAtMaxStretch = totalWidthPx >= maxStretchPx - 0.5;
  const catSrc = isAtMaxStretch ? PORTAL_MENU_RULE_CAT_AT_MAX_SRC : PORTAL_MENU_RULE_CAT_SRC;
  const catWidth = isAtMaxStretch ? PORTAL_MENU_RULE_CAT_AT_MAX_WIDTH : PORTAL_MENU_RULE_CAT_WIDTH;
  const catHeight = isAtMaxStretch
    ? PORTAL_MENU_RULE_CAT_AT_MAX_HEIGHT
    : PORTAL_MENU_RULE_CAT_HEIGHT;

  const wasAtMaxStretchRef = useRef(false);
  const reachMaxOpenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clearReachMaxOpenTimer = () => {
      if (reachMaxOpenTimerRef.current !== null) {
        clearTimeout(reachMaxOpenTimerRef.current);
        reachMaxOpenTimerRef.current = null;
      }
    };

    if (!isAtMaxStretch) {
      clearReachMaxOpenTimer();
      wasAtMaxStretchRef.current = false;
      return clearReachMaxOpenTimer;
    }

    if (wasAtMaxStretchRef.current || reachMaxOpenTimerRef.current !== null) {
      return clearReachMaxOpenTimer;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delayMs = reducedMotion ? 80 : PORTAL_MENU_AUTO_OPEN_DELAY_MS;

    reachMaxOpenTimerRef.current = setTimeout(() => {
      reachMaxOpenTimerRef.current = null;
      wasAtMaxStretchRef.current = true;
      onReachMaxStretch?.();
    }, delayMs);

    return clearReachMaxOpenTimer;
  }, [isAtMaxStretch, onReachMaxStretch]);

  const onRulePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const element = blockRef.current;
    if (!element) return;

    updateMaxStretch();
    const current = element.getBoundingClientRect().width;
    dragRef.current = { startX: event.clientX, startWidth: current };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onRulePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const { startX, startWidth } = dragRef.current;
    const nextWidth = clampPortalMenuWidth(
      startWidth + (startX - event.clientX),
      PORTAL_MENU_RULE_MIN_WIDTH_PX,
      maxStretchPx,
    );
    setWidthPx(nextWidth);
  };

  const endRuleDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div className="home-portal-menu-trigger-wrap">
      <div
        ref={blockRef}
        className="home-portal-menu-label-block"
        style={
          {
            maxWidth: `${maxStretchPx}px`,
            ...(widthPx !== null ? { width: `${widthPx}px` } : {}),
          } as CSSProperties
        }
      >
        <div className="home-portal-menu-kanji-row">
          <button
            type="button"
            className="home-portal-menu-trigger"
            aria-label="Portal menu"
            onClick={onMenuClick}
          >
            <span className="home-portal-menu-kanji-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15 7 L9 12 L15 17"
                  stroke="currentColor"
                  strokeWidth="4.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
          <HomeCartIconButton
            id={HOME_CART_BUTTON_ID}
            className="home-portal-menu-cart-btn"
            itemCount={cartItemCount}
            onClick={() => onCartClick?.()}
          />
        </div>
        <div className="home-portal-menu-label-rule-row">
          <div
            className="home-portal-menu-label-rule"
            role="slider"
            aria-label="Estirar barra del menú portal"
            aria-valuemin={PORTAL_MENU_RULE_MIN_WIDTH_PX}
            aria-valuemax={maxStretchPx}
            aria-valuenow={Math.round(totalWidthPx)}
            aria-orientation="horizontal"
            onPointerDown={onRulePointerDown}
            onPointerMove={onRulePointerMove}
            onPointerUp={endRuleDrag}
            onPointerCancel={endRuleDrag}
          >
            <svg
              className="home-portal-menu-label-rule__svg"
              viewBox={`0 0 ${ruleViewBoxWidth} ${RULE_VIEW_HEIGHT}`}
              preserveAspectRatio="none"
              focusable="false"
              aria-hidden="true"
            >
              <defs>
                <PortalMenuRuleBlotchPattern
                  patternId={blotchPatternId}
                  edgeFilterId={blotchEdgeFilterId}
                />
              </defs>
              <path d={portalMenuRulePath(ruleViewBoxWidth)} fill={`url(#${blotchPatternId})`} />
            </svg>
          </div>
          <Image
            className={`home-portal-menu-label-rule__cat${
              isAtMaxStretch ? "" : " home-portal-menu-label-rule__cat--tremble"
            }`}
            src={catSrc}
            alt=""
            width={catWidth}
            height={catHeight}
            style={{ aspectRatio: `${catWidth} / ${catHeight}` }}
            unoptimized
            draggable={false}
            aria-hidden="true"
          />
        </div>
        <button type="button" className="home-portal-menu-label" onClick={onMenuClick}>
          PORTAL MENU
        </button>
      </div>
    </div>
  );
});
