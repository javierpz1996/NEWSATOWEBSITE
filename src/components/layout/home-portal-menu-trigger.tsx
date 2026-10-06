"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import { HomeCartIconButton } from "@/components/layout/home-cart-icon-button";
import { HomeLocaleSwitcher } from "@/components/layout/home-locale-switcher";
import { HOME_CART_BUTTON_ID } from "@/lib/home-cart";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type TransitionEvent as ReactTransitionEvent,
} from "react";
import {
  clampPortalMenuWidth,
  measurePortalMenuMaxStretchWidth,
  PORTAL_MENU_AUTO_OPEN_DELAY_MS,
  PORTAL_MENU_RULE_MIN_WIDTH_PX,
  PORTAL_MENU_RULE_MAX_STRETCH_PX,
} from "@/components/layout/home-portal-menu-stretch";
import {
  ensurePortalMenuRuleCatsPreloaded,
  PORTAL_MENU_RULE_CAT_AT_MAX_SRC,
  PORTAL_MENU_RULE_CAT_HEIGHT,
  PORTAL_MENU_RULE_CAT_SRC,
  PORTAL_MENU_RULE_CAT_WIDTH,
} from "@/lib/portal-menu-assets";
import { useHomeMessages } from "@/hooks/use-home-messages";

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
  /** Fires once each time the bar reaches max stretch (teo2). */
  onReachMaxStretch?: () => void;
};

export const HomePortalMenuTrigger = forwardRef<
  HomePortalMenuTriggerHandle,
  HomePortalMenuTriggerProps
>(function HomePortalMenuTrigger(
  { onMenuClick, onCartClick, cartItemCount = 0, onReachMaxStretch },
  ref,
) {
  const { portal: portalMenuAria } = useHomeMessages();
  const blockRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);
  const [isSnappingWidthBack, setIsSnappingWidthBack] = useState(false);
  const [widthPx, setWidthPx] = useState<number | null>(null);
  const [layoutWidthPx, setLayoutWidthPx] = useState(PORTAL_MENU_RULE_MIN_WIDTH_PX);
  const [maxStretchPx, setMaxStretchPx] = useState(PORTAL_MENU_RULE_MAX_STRETCH_PX);
  const [ruleCatsReady, setRuleCatsReady] = useState(false);
  const wasAtMaxStretchRef = useRef(false);
  const reachMaxOpenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const ruleBlockWidthPx = widthPx ?? layoutWidthPx;

  const snapRuleWidthToMin = useCallback(() => {
    const fromWidth = ruleBlockWidthPx;
    if (fromWidth <= PORTAL_MENU_RULE_MIN_WIDTH_PX + 0.5) {
      resetRuleToMinWidth();
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      resetRuleToMinWidth();
      return;
    }

    setIsSnappingWidthBack(true);
    requestAnimationFrame(() => {
      setWidthPx(PORTAL_MENU_RULE_MIN_WIDTH_PX);
      setLayoutWidthPx(PORTAL_MENU_RULE_MIN_WIDTH_PX);
    });
  }, [resetRuleToMinWidth, ruleBlockWidthPx]);

  const onRuleBlockTransitionEnd = (event: ReactTransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== "width" || event.target !== blockRef.current) return;
    setIsSnappingWidthBack(false);
  };

  const totalWidthPx = ruleBlockWidthPx;
  const ruleViewBoxWidth = ruleViewWidth(totalWidthPx);
  const isAtMaxStretch = totalWidthPx >= maxStretchPx - 0.5;

  useEffect(() => {
    let cancelled = false;
    void ensurePortalMenuRuleCatsPreloaded().then(() => {
      if (!cancelled) setRuleCatsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const showTeo2Layer = isAtMaxStretch && ruleCatsReady;

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

    setIsSnappingWidthBack(false);

    updateMaxStretch();
    const current = Math.round(element.getBoundingClientRect().width);
    setWidthPx(current);
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

    const currentWidth = ruleBlockWidthPx;
    const atMax = currentWidth >= maxStretchPx - 0.5;
    if (!atMax) {
      snapRuleWidthToMin();
    }
  };

  return (
    <div className="home-portal-menu-trigger-wrap">
      <div className="home-portal-menu-kanji-row">
        <HomeLocaleSwitcher />
        <HomeCartIconButton
          id={HOME_CART_BUTTON_ID}
          className="home-portal-menu-cart-btn"
          variant="nav"
          itemCount={cartItemCount}
          onClick={() => onCartClick?.()}
        />
        <button
          type="button"
          className="home-portal-menu-label home-portal-menu-label--toolbar"
          aria-label={portalMenuAria.openMenuAria}
          onClick={onMenuClick}
        >
          <span className="home-portal-menu-label__text">{portalMenuAria.menuLabel}</span>
          <span className="home-portal-menu-label__icon" aria-hidden="true">
            <Menu strokeWidth={2.5} />
          </span>
        </button>
      </div>
      <div
        ref={blockRef}
        className={`home-portal-menu-label-block${
          isSnappingWidthBack ? " home-portal-menu-label-block--snap-width-back" : ""
        }`}
        style={
          {
            maxWidth: `${maxStretchPx}px`,
            width: `${ruleBlockWidthPx}px`,
          } as CSSProperties
        }
        onTransitionEnd={onRuleBlockTransitionEnd}
      >
        <div className="home-portal-menu-label-rule-row">
          <div
            className="home-portal-menu-label-rule"
            role="slider"
            aria-label={portalMenuAria.stretchBarAria}
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
              <path
                className="home-portal-menu-label-rule__shape"
                d={portalMenuRulePath(ruleViewBoxWidth)}
              />
            </svg>
          </div>
          <span
            className={`home-portal-menu-label-rule__cat-slot${
              showTeo2Layer ? " home-portal-menu-label-rule__cat-slot--at-max" : ""
            }`}
            aria-hidden="true"
          >
            <Image
              className="home-portal-menu-label-rule__cat home-portal-menu-label-rule__cat--default"
              src={PORTAL_MENU_RULE_CAT_SRC}
              alt=""
              width={PORTAL_MENU_RULE_CAT_WIDTH}
              height={PORTAL_MENU_RULE_CAT_HEIGHT}
              style={{
                aspectRatio: `${PORTAL_MENU_RULE_CAT_WIDTH} / ${PORTAL_MENU_RULE_CAT_HEIGHT}`,
              }}
              unoptimized
              priority
              draggable={false}
              aria-hidden="true"
            />
            <Image
              className="home-portal-menu-label-rule__cat home-portal-menu-label-rule__cat--max"
              src={PORTAL_MENU_RULE_CAT_AT_MAX_SRC}
              alt=""
              width={PORTAL_MENU_RULE_CAT_WIDTH}
              height={PORTAL_MENU_RULE_CAT_HEIGHT}
              style={{
                aspectRatio: `${PORTAL_MENU_RULE_CAT_WIDTH} / ${PORTAL_MENU_RULE_CAT_HEIGHT}`,
              }}
              unoptimized
              priority
              draggable={false}
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </div>
  );
});
