"use client";

import Link from "next/link";
import { ArtworkCarousel } from "@/components/artwork-carousel";
import { useHomeCart } from "@/components/layout/home-cart-context";
import { HomeServicesNsfwGate } from "@/components/layout/home-services-nsfw-gate";
import { motion, type Variants } from "motion/react";
import {
  sectionScrollRevealClassName,
  useSectionScrollReveal,
} from "@/hooks/use-section-scroll-reveal";
import {
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type ReactNode,
} from "react";

function subscribeReducedMotion(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Same value on server and during hydration; real preference after subscribe. */
function useHydrationSafeReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );
}

type ServicePriceRow = {
  label: string;
  price: string;
};

type ServiceBundle = {
  title: string;
  price: string;
  includes: string[];
};

type ContentRating = "sfw" | "nsfw";

type ServiceCard = {
  id: string;
  badge: string;
  badgeTone: "mint" | "rose" | "blue" | "lilac";
  title: string;
  fromPrice?: string;
  description: string;
  contentRating: ContentRating;
  prices?: ServicePriceRow[];
  variations?: ServicePriceRow[];
  bundle?: ServiceBundle;
  calculator?: boolean;
  ctaLabel: string;
  ctaHref: string;
};

const SIMPLISTA_BASE_OPTIONS = [
  { id: "flat", label: "1 persona + fondo plano", priceUsd: 8 },
  { id: "simple", label: "1 persona + fondo simple", priceUsd: 15 },
] as const;

const SIMPLISTA_POSE_SHEET_INCLUDES = [
  "1 cuerpo completo",
  "2 bust ups",
  "1 chibi, cabeza o accesorios",
  "Fondo plano",
];

const simplistaColoreadoCard: ServiceCard = {
  id: "simplista-colored",
  badge: "Rodillas hacia arriba",
  badgeTone: "mint",
  title: "SIMPLISTA COLOREADO",
  fromPrice: "8 USD",
  contentRating: "sfw",
  description:
    "Estilo sencillo, perspectivas simples y características tontas o graciosas. Coloreado simple / cel shading, con pocas correcciones. Ambientación y sombras a elección del cliente.",
  prices: [
    { label: "1 persona + fondo plano", price: "8 USD" },
    { label: "1 persona + fondo simple", price: "15 USD" },
  ],
  variations: [
    { label: "Cuerpo completo", price: "+5 USD" },
    { label: "Persona extra", price: "+7 USD" },
  ],
  bundle: {
    title: "Hoja de poses del personaje",
    price: "40 USD",
    includes: SIMPLISTA_POSE_SHEET_INCLUDES,
  },
  calculator: true,
  ctaLabel: "Solicitar comisión",
  ctaHref: "#contacto",
};

function buildSimplistaColoreadoCards(contentRating: ContentRating, idPrefix: string): ServiceCard[] {
  return Array.from({ length: 2 }, (_, index) => ({
    ...simplistaColoreadoCard,
    id: `${idPrefix}-${index + 1}`,
    contentRating,
  }));
}

const serviceCards: ServiceCard[] = [
  ...buildSimplistaColoreadoCards("sfw", "simplista-colored-sfw"),
  ...buildSimplistaColoreadoCards("nsfw", "simplista-colored-nsfw"),
];

function ServicePriceList({ rows }: { rows: ServicePriceRow[] }) {
  return (
    <ul className="home-service-card-price-list">
      {rows.map((row) => (
        <li key={row.label}>
          <span>{row.label}</span>
          <span>{row.price}</span>
        </li>
      ))}
    </ul>
  );
}

type SimplistaOrderState = {
  baseId: (typeof SIMPLISTA_BASE_OPTIONS)[number]["id"];
  fullBody: boolean;
  extraPeople: number;
  poseSheet: boolean;
};

const defaultSimplistaOrder = (): SimplistaOrderState => ({
  baseId: "flat",
  fullBody: false,
  extraPeople: 0,
  poseSheet: false,
});

function formatUsd(amount: number) {
  return `${amount} USD`;
}

function SimplistaOrderBuilder({
  serviceTitle,
  bundle,
  variants,
}: {
  serviceTitle: string;
  bundle: ServiceBundle;
  variants: Variants;
}) {
  const [order, setOrder] = useState<SimplistaOrderState>(defaultSimplistaOrder);
  const { addItem } = useHomeCart();

  const { lineItems, totalUsd } = useMemo(() => {
    const base = SIMPLISTA_BASE_OPTIONS.find((option) => option.id === order.baseId)!;
    const items: { label: string; priceUsd: number }[] = [{ label: base.label, priceUsd: base.priceUsd }];

    if (order.fullBody) {
      items.push({ label: "Cuerpo completo", priceUsd: 5 });
    }
    if (order.extraPeople > 0) {
      items.push({
        label: `Persona extra × ${order.extraPeople}`,
        priceUsd: 7 * order.extraPeople,
      });
    }
    if (order.poseSheet) {
      items.push({ label: bundle.title, priceUsd: 40 });
    }

    const total = items.reduce((sum, item) => sum + item.priceUsd, 0);
    return { lineItems: items, totalUsd: total };
  }, [bundle.title, order]);

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    addItem(
      {
        serviceTitle,
        lines: lineItems.map((item) => ({
          label: item.label,
          priceUsd: item.priceUsd,
        })),
        totalUsd,
      },
      { flyFrom: event.currentTarget },
    );
  };

  const baseFieldName = useId();

  return (
    <>
      <ServiceCardDetailsSection variants={variants}>
        <fieldset className="home-service-order-field">
          <legend className="home-service-card-section-label home-service-card-section-label-strong">
            Base
          </legend>
          <ul className="home-service-order-options">
            {SIMPLISTA_BASE_OPTIONS.map((option) => (
              <li key={option.id}>
                <label className="home-service-order-option">
                  <input
                    type="radio"
                    name={`${baseFieldName}-base`}
                    checked={order.baseId === option.id}
                    onChange={() => setOrder((prev) => ({ ...prev, baseId: option.id }))}
                  />
                  <span className="home-service-order-option-label">{option.label}</span>
                  <span className="home-service-order-option-price">{formatUsd(option.priceUsd)}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      </ServiceCardDetailsSection>

      <ServiceCardDetailsSection variants={variants}>
        <fieldset className="home-service-order-field">
          <legend className="home-service-card-section-label home-service-card-section-label-strong">
            Variaciones
          </legend>
          <ul className="home-service-order-options">
            <li>
              <label className="home-service-order-option">
                <input
                  type="checkbox"
                  checked={order.fullBody}
                  onChange={(event) =>
                    setOrder((prev) => ({ ...prev, fullBody: event.target.checked }))
                  }
                />
                <span className="home-service-order-option-label">Cuerpo completo</span>
                <span className="home-service-order-option-price">+5 USD</span>
              </label>
            </li>
            <li>
              <div className="home-service-order-option home-service-order-option-quantity">
                <span className="home-service-order-option-label">Persona extra</span>
                <div className="home-service-order-quantity">
                  <button
                    type="button"
                    className="home-service-order-quantity-btn"
                    aria-label="Quitar persona extra"
                    disabled={order.extraPeople === 0}
                    onClick={() =>
                      setOrder((prev) => ({
                        ...prev,
                        extraPeople: Math.max(0, prev.extraPeople - 1),
                      }))
                    }
                  >
                    −
                  </button>
                  <span className="home-service-order-quantity-value" aria-live="polite">
                    {order.extraPeople}
                  </span>
                  <button
                    type="button"
                    className="home-service-order-quantity-btn"
                    aria-label="Agregar persona extra"
                    onClick={() =>
                      setOrder((prev) => ({
                        ...prev,
                        extraPeople: Math.min(5, prev.extraPeople + 1),
                      }))
                    }
                  >
                    +
                  </button>
                </div>
                <span className="home-service-order-option-price">+7 USD c/u</span>
              </div>
            </li>
          </ul>
        </fieldset>
      </ServiceCardDetailsSection>

      <ServiceCardDetailsSection variants={variants}>
        <fieldset className="home-service-order-field">
          <legend className="home-service-card-section-label home-service-card-section-label-strong">
            Extra
          </legend>
          <ul className="home-service-order-options">
            <li>
              <label className="home-service-order-option">
                <input
                  type="checkbox"
                  checked={order.poseSheet}
                  onChange={(event) =>
                    setOrder((prev) => ({ ...prev, poseSheet: event.target.checked }))
                  }
                />
                <span className="home-service-order-option-label">{bundle.title}</span>
                <span className="home-service-order-option-price">40 USD</span>
              </label>
            </li>
          </ul>
          {order.poseSheet ? (
            <div className="home-service-order-includes">
              <p className="home-service-card-includes-label">Incluye:</p>
              <ul className="home-service-card-includes-list">
                {bundle.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </fieldset>
      </ServiceCardDetailsSection>

      <ServiceCardDetailsSection variants={variants}>
        <div className="home-service-order-summary" aria-live="polite">
          <p className="home-service-order-summary-label">Total estimado</p>
          <p className="home-service-order-summary-total">{formatUsd(totalUsd)}</p>
          <ul className="home-service-order-summary-lines">
            {lineItems.map((item) => (
              <li key={item.label}>
                <span>{item.label}</span>
                <span>{formatUsd(item.priceUsd)}</span>
              </li>
            ))}
          </ul>
        </div>
      </ServiceCardDetailsSection>

      <ServiceCardDetailsSection variants={variants}>
        <div className="home-service-order-actions">
          <button
            type="button"
            className="home-service-card-cta home-service-card-cta-primary"
            onClick={handleAddToCart}
          >
            Comprar
            <span className="home-service-card-cta-arrow" aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </ServiceCardDetailsSection>
    </>
  );
}

/** Bezier arrays mirror `--ease-*` in globals.css (animate skill). */
const MOTION_EASE_OUT = [0.23, 1, 0.32, 1] as const;
const MOTION_EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
const MOTION_EASE_DRAWER = [0.32, 0.72, 0, 1] as const;
/** Accordion expand/collapse — keep under ~400ms for the grid; stagger stays subtle. */
const DETAILS_OPEN_GRID_DURATION = 0.38;
const DETAILS_CLOSE_GRID_DURATION = 0.28;
const DETAILS_ITEM_DURATION = 0.26;
const DETAILS_STAGGER = 0.055;
const DETAILS_DELAY_CHILDREN = 0.06;
const DETAILS_TOGGLE_ARROW_DURATION = 0.22;
const DETAILS_ITEM_OFFSET = "translateY(0.4rem)";
const DETAILS_ITEM_REST = "translateY(0)";

function getDetailsRevealTransition(reduceMotion: boolean, isOpen: boolean) {
  if (reduceMotion) {
    return { duration: 0.12, ease: MOTION_EASE_OUT };
  }
  const duration = isOpen ? DETAILS_OPEN_GRID_DURATION : DETAILS_CLOSE_GRID_DURATION;
  const ease = isOpen ? MOTION_EASE_OUT : MOTION_EASE_DRAWER;
  return {
    gridTemplateRows: { duration, ease },
  };
}

function getDetailsContentMotion(reduceMotion: boolean) {
  if (reduceMotion) {
    return {
      container: {
        idle: {},
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.12 } },
      },
      item: {
        idle: { opacity: 1 },
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.12 } },
      },
    };
  }
  return {
    container: {
      idle: {
        transition: { staggerChildren: 0, delayChildren: 0 },
      },
      hidden: {},
      visible: {
        transition: {
          staggerChildren: DETAILS_STAGGER,
          delayChildren: DETAILS_DELAY_CHILDREN,
        },
      },
    },
    item: {
      idle: {
        opacity: 1,
        transform: DETAILS_ITEM_OFFSET,
        transition: { duration: 0.15, ease: MOTION_EASE_DRAWER },
      },
      hidden: { opacity: 1, transform: DETAILS_ITEM_OFFSET },
      visible: {
        opacity: 1,
        transform: DETAILS_ITEM_REST,
        transition: { duration: DETAILS_ITEM_DURATION, ease: MOTION_EASE_IN_OUT },
      },
    },
  };
}

function ServiceCardDetailsReveal({
  panelId,
  isOpen,
  reduceMotion,
  detailsClassName = "home-service-card-details",
  ariaLabel,
  children,
}: {
  panelId: string;
  isOpen: boolean;
  reduceMotion: boolean;
  detailsClassName?: string;
  ariaLabel?: string;
  children: ReactNode;
}) {
  const contentMotion = getDetailsContentMotion(reduceMotion);

  return (
    <motion.div
      id={panelId}
      className="home-service-card-details-clip"
      initial={false}
      animate={{
        gridTemplateRows: isOpen ? "1fr" : "0fr",
      }}
      transition={getDetailsRevealTransition(reduceMotion, isOpen)}
      aria-hidden={!isOpen}
      {...(!isOpen ? { inert: true } : {})}
    >
      <div className="home-service-card-details-inner">
        <motion.div
          className={detailsClassName}
          role={ariaLabel ? "region" : undefined}
          aria-label={ariaLabel}
          initial={false}
          animate={isOpen ? "visible" : "idle"}
          variants={contentMotion.container}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
}

function ServiceCardDetailsSection({
  variants,
  className,
  children,
}: {
  variants: Variants;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}

function ServiceCardItem({
  service,
  revealIndex,
}: {
  service: ServiceCard;
  revealIndex: number;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [orderResetKey, setOrderResetKey] = useState(0);
  const orderPanelId = useId();
  const detailsPanelId = useId();
  const reduceMotion = useHydrationSafeReducedMotion();
  const detailsContentMotion = getDetailsContentMotion(reduceMotion);

  const closeDetails = () => {
    setDetailsOpen(false);
    setIsOrderOpen(false);
    setOrderResetKey((key) => key + 1);
  };

  const closeOrder = () => {
    setIsOrderOpen(false);
    setOrderResetKey((key) => key + 1);
  };

  return (
    <li
      className={`home-services-reveal-item home-services-reveal-item--card home-services-reveal-item--card-${revealIndex}`}
    >
      <article className="home-service-card">
        <div className="home-commissions-step-frame" aria-hidden="true">
          <span className="home-commissions-step-corner home-commissions-step-corner-tl" />
          <span className="home-commissions-step-corner home-commissions-step-corner-tr" />
          <span className="home-commissions-step-corner home-commissions-step-corner-bl" />
          <span className="home-commissions-step-corner home-commissions-step-corner-br" />
        </div>
        <div className="home-service-card-visual">
          <ArtworkCarousel />
        </div>
        <div className="home-service-card-body">
          <span className="home-service-card-badge" data-tone={service.badgeTone}>
            {service.badge}
          </span>
          <div className="home-service-card-title-row">
            <h3 className="home-service-card-title">{service.title}</h3>
            {service.fromPrice ? (
              <p className="home-service-card-from-price">
                <span className="home-service-card-from-price-divider" aria-hidden="true" />
                <span className="home-service-card-from-price-label">Desde</span>
                <span className="home-service-card-from-price-amount">{service.fromPrice}</span>
              </p>
            ) : null}
          </div>
          <p className="home-service-card-description">{service.description}</p>

          {service.prices ? (
            <>
              <button
                type="button"
                className="home-service-card-details-toggle"
                aria-expanded={detailsOpen}
                aria-controls={detailsPanelId}
                onClick={() => {
                  if (detailsOpen) {
                    closeDetails();
                  } else {
                    setDetailsOpen(true);
                  }
                }}
              >
                {detailsOpen ? "Ocultar detalles" : "Mostrar detalles"}
                <motion.span
                  className="home-service-card-details-toggle-arrow"
                  aria-hidden="true"
                  animate={{
                    transform: detailsOpen ? "rotate(-90deg)" : "rotate(0deg)",
                  }}
                  transition={{
                    duration: reduceMotion ? 0 : DETAILS_TOGGLE_ARROW_DURATION,
                    ease: MOTION_EASE_OUT,
                  }}
                >
                  →
                </motion.span>
              </button>
              <div className="home-service-card-details-expand">
                <ServiceCardDetailsReveal
                  panelId={detailsPanelId}
                  isOpen={detailsOpen}
                  reduceMotion={reduceMotion}
                >
                <ServiceCardDetailsSection
                  className="home-service-card-detail-block"
                  variants={detailsContentMotion.item}
                >
                  <h4 className="home-service-card-section-label home-service-card-section-label-strong">
                    Precios
                  </h4>
                  <ServicePriceList rows={service.prices} />
                </ServiceCardDetailsSection>
                {service.variations ? (
                  <ServiceCardDetailsSection
                    className="home-service-card-detail-block"
                    variants={detailsContentMotion.item}
                  >
                    <h4 className="home-service-card-section-label home-service-card-section-label-strong">
                      Variaciones
                    </h4>
                    <ServicePriceList rows={service.variations} />
                  </ServiceCardDetailsSection>
                ) : null}
                {service.calculator && service.bundle ? (
                  <ServiceCardDetailsSection
                    className="home-service-card-calc-block"
                    variants={detailsContentMotion.item}
                  >
                    <button
                      type="button"
                      className="home-service-card-calc"
                      aria-expanded={isOrderOpen}
                      aria-controls={orderPanelId}
                      onClick={() => {
                        if (isOrderOpen) {
                          closeOrder();
                        } else {
                          setIsOrderOpen(true);
                        }
                      }}
                    >
                      {isOrderOpen ? "Volver" : "Calcular comisión"}
                      <motion.span
                        className="home-service-card-calc-arrow"
                        aria-hidden="true"
                        animate={{
                          transform: isOrderOpen ? "rotate(-90deg)" : "rotate(0deg)",
                        }}
                        transition={{
                          duration: reduceMotion ? 0 : DETAILS_TOGGLE_ARROW_DURATION,
                          ease: MOTION_EASE_OUT,
                        }}
                      >
                        →
                      </motion.span>
                    </button>
                    <div className="home-service-card-details-expand">
                      <ServiceCardDetailsReveal
                        panelId={orderPanelId}
                        isOpen={isOrderOpen}
                        reduceMotion={reduceMotion}
                        detailsClassName="home-service-card-details home-service-order-panel"
                        ariaLabel="Armar pedido"
                      >
                        <SimplistaOrderBuilder
                          key={orderResetKey}
                          variants={detailsContentMotion.item}
                          serviceTitle={service.title}
                          bundle={service.bundle}
                        />
                      </ServiceCardDetailsReveal>
                    </div>
                  </ServiceCardDetailsSection>
                ) : null}
                </ServiceCardDetailsReveal>
              </div>
            </>
          ) : null}

          {!service.calculator ? (
            <Link className="home-service-card-cta" href={service.ctaHref}>
              {service.ctaLabel}
              <span className="home-service-card-cta-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          ) : null}
        </div>
      </article>
    </li>
  );
}

export function HomeServices() {
  const sectionRef = useRef<HTMLElement>(null);
  const reveal = useSectionScrollReveal(sectionRef);
  const [contentRating, setContentRating] = useState<ContentRating>("sfw");
  const [nsfwGateOpen, setNsfwGateOpen] = useState(false);
  const [nsfwAccessGranted, setNsfwAccessGranted] = useState(false);
  const visibleServices = serviceCards.filter((service) => service.contentRating === contentRating);

  const openNsfwContent = () => {
    setNsfwAccessGranted(true);
    setContentRating("nsfw");
    setNsfwGateOpen(false);
  };

  const handleNsfwToggle = () => {
    if (contentRating === "nsfw") return;
    if (nsfwAccessGranted) {
      setContentRating("nsfw");
      return;
    }
    setNsfwGateOpen(true);
  };

  return (
    <section
      ref={sectionRef}
      id="servicios"
      className={sectionScrollRevealClassName("home-services", reveal)}
      aria-labelledby="home-services-title"
      aria-describedby="home-services-subtitle"
    >
      <header className="home-services-header">
        <div className="home-services-header-copy">
          <h2
            id="home-services-title"
            className="home-services-reveal-item home-services-reveal-item--title"
          >
            Servicios
          </h2>
          <p
            id="home-services-subtitle"
            className="home-services-subtitle home-services-reveal-item home-services-reveal-item--subtitle"
          >
            Tipos de encargo disponibles
          </p>
        </div>
        <div className="home-services-rating-control home-services-reveal-item home-services-reveal-item--controls">
          <div className="home-services-rating-age-row" aria-hidden="true">
            <span className="home-services-rating-age-spacer" />
            <span className="home-services-rating-age-badge">+18</span>
          </div>
          <div className="home-services-rating-toggle" role="group" aria-label="Filtrar por contenido">
            <button
              type="button"
              className="home-services-rating-btn"
              aria-pressed={contentRating === "sfw"}
              data-selected={contentRating === "sfw" ? true : undefined}
              onClick={() => setContentRating("sfw")}
            >
              SFW
            </button>
            <button
              type="button"
              className="home-services-rating-btn home-services-rating-btn-nsfw"
              aria-pressed={contentRating === "nsfw"}
              aria-label="NSFW, contenido para mayores de 18 años"
              data-selected={contentRating === "nsfw" ? true : undefined}
              onClick={handleNsfwToggle}
            >
              NSFW
            </button>
          </div>
        </div>
      </header>
      <HomeServicesNsfwGate
        open={nsfwGateOpen}
        onClose={() => setNsfwGateOpen(false)}
        onConfirm={openNsfwContent}
      />
      {visibleServices.length > 0 ? (
        <ul className="home-services-grid">
          {visibleServices.map((service, index) => (
            <ServiceCardItem
              key={service.id}
              service={service}
              revealIndex={Math.min(index + 1, 4)}
            />
          ))}
        </ul>
      ) : (
        <p className="home-services-empty home-services-reveal-item home-services-reveal-item--empty">
          No hay servicios NSFW publicados todavía. Volvé a SFW o consultá por encargos personalizados.
        </p>
      )}
    </section>
  );
}
