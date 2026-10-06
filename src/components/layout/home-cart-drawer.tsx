"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { clearHomeCart, formatHomeCartUsd } from "@/lib/home-cart";
import { fireHomeCartProposalConfetti } from "@/lib/home-cart-proposal-confetti";
import {
  CartProposalSubmitError,
  submitCartProposalToSupabase,
} from "@/lib/home-cart-proposal-submit";
import {
  CART_PROPOSAL_SOCIAL_OPTIONS,
  getCartProposalSocialLabel,
} from "@/lib/home-cart-proposal";
import { useHomeCart } from "@/components/layout/home-cart-context";
import { HomePortalMenuKanjiArrow } from "@/components/layout/home-portal-menu-kanji-arrow";
import { useHomeMessages } from "@/hooks/use-home-messages";

const MOTION_EASE_OUT = [0.23, 1, 0.32, 1] as const;
const MOTION_EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

const DRAWER_OVERLAY_DURATION = 0.22;
const DRAWER_PANEL_DURATION = 0.3;
const DRAWER_VIEW_DURATION = 0.24;
const DRAWER_REDUCED_DURATION = 0.12;
const PROPOSAL_SUCCESS_AUTO_CLOSE_MS = 3500;

/** Written in event handlers before view state updates (exit animations read this). */
let homeCartDrawerNavDirection = 1;

function getDrawerOverlayMotion(reduceMotion: boolean) {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {
      duration: reduceMotion ? DRAWER_REDUCED_DURATION : DRAWER_OVERLAY_DURATION,
      ease: MOTION_EASE_OUT,
    },
  };
}

function getDrawerPanelMotion(reduceMotion: boolean) {
  if (reduceMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: DRAWER_REDUCED_DURATION, ease: MOTION_EASE_OUT },
    };
  }

  return {
    initial: { opacity: 0, transform: "translateX(100%)" },
    animate: { opacity: 1, transform: "translateX(0)" },
    exit: { opacity: 0, transform: "translateX(100%)" },
    transition: { duration: DRAWER_PANEL_DURATION, ease: MOTION_EASE_DRAWER },
  };
}

type DrawerViewKey = "list" | "proposal" | "success" | "empty";

const drawerViewVariantsReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const drawerViewVariantsFull = {
  initial: (viewKey: DrawerViewKey) => {
      const direction = homeCartDrawerNavDirection;
      if (viewKey === "list" || viewKey === "proposal") {
        const forward = direction >= 0;
        return {
          opacity: 1,
          zIndex: 2,
          transform: forward ? "translateX(1rem)" : "translateX(-1rem)",
        };
      }
      if (viewKey === "success") {
        return {
          opacity: 0,
          zIndex: 2,
          transform: "translateY(0.35rem) scale(0.99)",
        };
      }
      return { opacity: 0, zIndex: 2 };
  },
  animate: {
    opacity: 1,
    zIndex: 2,
    transform: "translateX(0) translateY(0) scale(1)",
  },
  exit: (viewKey: DrawerViewKey) => {
    const direction = homeCartDrawerNavDirection;
    if (viewKey === "list" || viewKey === "proposal") {
      const forward = direction >= 0;
      return {
        opacity: 1,
        zIndex: 1,
        transform: forward ? "translateX(-0.85rem)" : "translateX(0.85rem)",
      };
    }
    if (viewKey === "success") {
      return { opacity: 0, zIndex: 1, transform: "translateY(-0.2rem)" };
    }
    return { opacity: 0, zIndex: 1 };
  },
};

function getMaxStageHeight(panel: HTMLDivElement | null, hasFooter: boolean): number {
  if (!panel) return Number.POSITIVE_INFINITY;

  const maxHeightRaw = getComputedStyle(panel).maxHeight;
  const maxPanel =
    maxHeightRaw === "none" ? panel.getBoundingClientRect().height : Number.parseFloat(maxHeightRaw);

  const header = panel.querySelector<HTMLElement>(".home-cart-drawer__header");
  const footer = hasFooter ? panel.querySelector<HTMLElement>(".home-cart-drawer__footer") : null;
  const chrome = (header?.offsetHeight ?? 0) + (footer?.offsetHeight ?? 0);

  return Math.max(96, maxPanel - chrome);
}

function HomeCartDrawerViewMeasure({
  viewKey,
  onHeight,
  children,
}: {
  viewKey: DrawerViewKey;
  onHeight: (key: DrawerViewKey, height: number) => void;
  children: ReactNode;
}) {
  const innerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = innerRef.current;
    if (!element) return;

    const report = () => {
      onHeight(viewKey, element.offsetHeight);
    };

    report();
    const observer = new ResizeObserver(report);
    observer.observe(element);
    return () => observer.disconnect();
  }, [onHeight, viewKey]);

  return <div ref={innerRef} className="home-cart-drawer__view-inner">{children}</div>;
}

function getDrawerViewTransition(reduceMotion: boolean, viewKey: DrawerViewKey) {
  if (reduceMotion) {
    return { duration: DRAWER_REDUCED_DURATION, ease: MOTION_EASE_OUT };
  }
  if (viewKey === "list" || viewKey === "proposal") {
    return { duration: 0.24, ease: MOTION_EASE_DRAWER };
  }
  if (viewKey === "success") {
    return { duration: 0.26, ease: MOTION_EASE_OUT };
  }
  return { duration: DRAWER_VIEW_DURATION, ease: MOTION_EASE_OUT };
}

export function HomeCartDrawer() {
  const { cart } = useHomeMessages();
  const titleId = useId();
  const nameFieldId = useId();
  const socialFieldId = useId();
  const socialUsernameFieldId = useId();
  const notesFieldId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const viewHeightsRef = useRef<Partial<Record<DrawerViewKey, number>>>({});
  const proposalSuccessFxRef = useRef(false);
  const { items, isOpen, closeCart: closeCartContext, removeItem } = useHomeCart();
  const [proposalOpen, setProposalOpen] = useState(false);
  const [proposalSent, setProposalSent] = useState(false);
  const [proposalSubmitting, setProposalSubmitting] = useState(false);
  const [proposalError, setProposalError] = useState<string | null>(null);
  const [stageHeight, setStageHeight] = useState<number | undefined>(undefined);
  const reduceMotion = useReducedMotion() ?? false;
  const drawerViewVariants = reduceMotion ? drawerViewVariantsReduced : drawerViewVariantsFull;
  const hasCartFooter = !proposalOpen && items.length > 0;

  const drawerViewKey: DrawerViewKey =
    proposalOpen && proposalSent
      ? "success"
      : proposalOpen
        ? "proposal"
        : items.length === 0
          ? "empty"
          : "list";

  const applyCachedStageHeight = useCallback((key: DrawerViewKey, withFooter: boolean) => {
    const cached = viewHeightsRef.current[key];
    if (cached == null) return;
    setStageHeight(Math.min(cached, getMaxStageHeight(panelRef.current, withFooter)));
  }, []);

  const reportViewHeight = useCallback(
    (key: DrawerViewKey, contentHeight: number) => {
      const withFooter = key === "list" && items.length > 0;
      const clamped = Math.min(
        Math.ceil(contentHeight),
        getMaxStageHeight(panelRef.current, withFooter),
      );
      viewHeightsRef.current[key] = clamped;
      if (key === drawerViewKey) {
        setStageHeight(clamped);
      }
    },
    [drawerViewKey, items.length],
  );

  const closeCart = useCallback(() => {
    homeCartDrawerNavDirection = 1;
    setProposalOpen(false);
    setProposalSent(false);
    setProposalSubmitting(false);
    setProposalError(null);
    setStageHeight(undefined);
    viewHeightsRef.current = {};
    closeCartContext();
  }, [closeCartContext]);

  const openProposal = useCallback(() => {
    homeCartDrawerNavDirection = 1;
    applyCachedStageHeight("proposal", false);
    setProposalOpen(true);
  }, [applyCachedStageHeight]);

  const leaveProposalView = useCallback(() => {
    homeCartDrawerNavDirection = -1;
    applyCachedStageHeight("list", items.length > 0);
    setProposalOpen(false);
    setProposalSent(false);
    setProposalSubmitting(false);
    setProposalError(null);
  }, [applyCachedStageHeight, items.length]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (proposalSent) {
        closeCart();
        return;
      }
      if (proposalOpen) {
        leaveProposalView();
        return;
      }
      closeCart();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeCart, isOpen, leaveProposalView, proposalOpen, proposalSent]);

  useEffect(() => {
    if (!proposalSent) {
      proposalSuccessFxRef.current = false;
      return;
    }
    if (!isOpen || proposalSuccessFxRef.current) return;

    proposalSuccessFxRef.current = true;
    clearHomeCart();
    fireHomeCartProposalConfetti(panelRef.current);

    const closeTimer = window.setTimeout(() => {
      closeCart();
    }, PROPOSAL_SUCCESS_AUTO_CLOSE_MS);

    return () => window.clearTimeout(closeTimer);
  }, [closeCart, isOpen, proposalSent]);

  const onBackdropClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) closeCart();
    },
    [closeCart],
  );

  const handleProposalSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);

      const clientName = String(data.get("clientName") ?? "").trim();
      const socialId = String(data.get("socialNetwork") ?? "").trim();
      const socialUsername = String(data.get("socialUsername") ?? "").trim();
      const notes = String(data.get("notes") ?? "").trim();
      const socialNetworkLabel = getCartProposalSocialLabel(socialId);

      if (!socialNetworkLabel || !socialUsername || items.length === 0) return;

      setProposalError(null);
      setProposalSubmitting(true);

      try {
        await submitCartProposalToSupabase({
          clientName,
          socialNetworkLabel,
          socialUsername,
          notes,
          items,
        });

        form.reset();
        homeCartDrawerNavDirection = 1;
        applyCachedStageHeight("success", false);
        setProposalSent(true);
      } catch (error) {
        const message =
          error instanceof CartProposalSubmitError
            ? error.message
            : cart.submitErrorFallback;
        setProposalError(message);
      } finally {
        setProposalSubmitting(false);
      }
    },
    [applyCachedStageHeight, cart.submitErrorFallback, items],
  );

  const dialogTitle =
    proposalOpen && proposalSent
      ? cart.titleSuccess
      : proposalOpen
        ? cart.titleProposal
        : cart.title;

  useEffect(() => {
    delete viewHeightsRef.current.list;
  }, [items]);

  const overlayMotion = getDrawerOverlayMotion(reduceMotion);
  const panelMotion = getDrawerPanelMotion(reduceMotion);
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="home-cart-drawer"
          className="home-cart-drawer"
          onClick={onBackdropClick}
          {...overlayMotion}
        >
          <motion.div
            ref={panelRef}
            className="home-cart-drawer__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(event) => event.stopPropagation()}
            {...panelMotion}
          >
            <header
              className={`home-cart-drawer__header${
                proposalOpen && !proposalSent ? " home-cart-drawer__header--proposal" : ""
              }`}
            >
              {proposalOpen && !proposalSent ? (
                <div className="home-cart-drawer__header-proposal">
                  <button
                    type="button"
                    className="home-cart-drawer__back"
                    onClick={leaveProposalView}
                    aria-label={cart.backAria}
                  >
                    <HomePortalMenuKanjiArrow />
                  </button>
                  <h2 id={titleId} className="home-cart-drawer__title">{dialogTitle}</h2>
                </div>
              ) : (
                <h2 id={titleId} className="home-cart-drawer__title">{dialogTitle}</h2>
              )}
              <button
                type="button"
                className="home-cart-drawer__close"
                onClick={closeCart}
                aria-label={cart.closeAria}
              >
                ×
              </button>
            </header>

            <div className="home-cart-drawer__body">
              <div
                className={`home-cart-drawer__body-stage${
                  stageHeight != null ? " home-cart-drawer__body-stage--sized" : ""
                }`}
                style={stageHeight != null ? { height: stageHeight } : undefined}
              >
                <AnimatePresence mode="sync" initial={false}>
                  <motion.div
                    key={drawerViewKey}
                    className="home-cart-drawer__view home-cart-drawer__view--layer"
                    custom={drawerViewKey}
                    variants={drawerViewVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={getDrawerViewTransition(reduceMotion, drawerViewKey)}
                  >
                  <HomeCartDrawerViewMeasure
                    viewKey={drawerViewKey}
                    onHeight={reportViewHeight}
                  >
                  {drawerViewKey === "success" ? (
                    <div className="home-cart-drawer__proposal-success" role="status" aria-live="polite">
                      <p className="home-cart-drawer__proposal-success-title">{cart.successTitle}</p>
                      <p className="home-cart-drawer__proposal-success-text">
                        {cart.successText}
                      </p>
                    </div>
                  ) : drawerViewKey === "proposal" ? (
                    <form
                      className="home-cart-drawer__proposal-form home-contact-form"
                      onSubmit={handleProposalSubmit}
                      noValidate
                    >
                      <div className="home-contact-form__field">
                        <label className="home-contact-form__label" htmlFor={nameFieldId}>
                          {cart.nameLabel}
                        </label>
                        <input
                          id={nameFieldId}
                          className="home-contact-form__input"
                          type="text"
                          name="clientName"
                          autoComplete="name"
                          placeholder={cart.namePlaceholder}
                        />
                      </div>

                      <div className="home-contact-form__field">
                        <label className="home-contact-form__label" htmlFor={socialFieldId}>
                          {cart.socialLabel}
                        </label>
                        <select
                          id={socialFieldId}
                          className="home-contact-form__input home-contact-form__select"
                          name="socialNetwork"
                          defaultValue=""
                          required
                        >
                          <option value="" disabled>{cart.socialPlaceholder}</option>
                          {CART_PROPOSAL_SOCIAL_OPTIONS.map((option) => (
                            <option key={option.id} value={option.id}>{option.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="home-contact-form__field">
                        <label className="home-contact-form__label" htmlFor={socialUsernameFieldId}>
                          {cart.usernameLabel}
                        </label>
                        <input
                          id={socialUsernameFieldId}
                          className="home-contact-form__input"
                          type="text"
                          name="socialUsername"
                          autoComplete="username"
                          placeholder={cart.usernamePlaceholder}
                          required
                        />
                      </div>

                      <div className="home-contact-form__field home-contact-form__field--message">
                        <label className="home-contact-form__label" htmlFor={notesFieldId}>
                          {cart.notesLabel}
                        </label>
                        <textarea
                          id={notesFieldId}
                          className="home-contact-form__textarea"
                          name="notes"
                          rows={4}
                          placeholder={cart.notesPlaceholder}
                        />
                      </div>

                      <p className="home-cart-drawer__proposal-summary" aria-live="polite">
                        {cart.proposalSummary(items.length)}
                      </p>

                      {proposalError ? (
                        <p className="home-cart-drawer__proposal-error" role="alert">
                          {proposalError}
                        </p>
                      ) : null}

                      <button
                        type="submit"
                        className="home-contact-form__submit home-cart-drawer__proposal-submit"
                        disabled={proposalSubmitting}
                        aria-busy={proposalSubmitting}
                      >
                        {proposalSubmitting ? cart.sending : cart.sendProposal}
                        {!proposalSubmitting ? <span aria-hidden="true"> ↗</span> : null}
                      </button>

                      <p className="home-contact-form__hint">
                        {cart.proposalHint}
                      </p>
                    </form>
                  ) : drawerViewKey === "empty" ? (
                    <p className="home-cart-drawer__empty">{cart.empty}</p>
                  ) : (
                    <ul className="home-cart-drawer__list">
                      {items.map((item) => (
                        <li key={item.id} className="home-cart-drawer__item">
                          <div className="home-cart-drawer__item-head">
                            <h3 className="home-cart-drawer__item-title">{item.serviceTitle}</h3>
                            <button
                              type="button"
                              className="home-cart-drawer__remove"
                              onClick={() => removeItem(item.id)}
                            >
                              {cart.remove}
                            </button>
                          </div>
                          <ul className="home-cart-drawer__lines">
                            {item.lines.map((line) => (
                              <li key={`${item.id}-${line.label}`}>
                                <span>{line.label}</span>
                                <span>{formatHomeCartUsd(line.priceUsd)}</span>
                              </li>
                            ))}
                          </ul>
                          <p className="home-cart-drawer__item-total">
                            {cart.totalLabel} <strong>{formatHomeCartUsd(item.totalUsd)}</strong>
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                  </HomeCartDrawerViewMeasure>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {hasCartFooter ? (
              <footer className="home-cart-drawer__footer">
                <button
                  type="button"
                  className="home-cart-drawer__contact"
                  onClick={openProposal}
                >
                  {cart.sendProposal}
                </button>
              </footer>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
