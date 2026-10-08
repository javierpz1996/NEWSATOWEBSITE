 "use client";

import { useEffect, useRef, useState } from "react";
import {
  sectionScrollRevealClassName,
  useSectionScrollReveal,
} from "@/hooks/use-section-scroll-reveal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { COMMISSION_RULES_HREF } from "@/lib/commission-rules-content";
import { formatCommissionDateLabel } from "@/lib/commission-date-format";
import type { HomeCommissionInProgress } from "@/lib/home-commission-in-progress";
import Link from "next/link";
import { useHomeMessages } from "@/hooks/use-home-messages";

function CommissionStepFrame() {
  return (
    <div className="home-commissions-step-frame" aria-hidden="true">
      <span className="home-commissions-step-corner home-commissions-step-corner-tl" />
      <span className="home-commissions-step-corner home-commissions-step-corner-tr" />
      <span className="home-commissions-step-corner home-commissions-step-corner-bl" />
      <span className="home-commissions-step-corner home-commissions-step-corner-br" />
    </div>
  );
}

const COMMISSION_IN_PROGRESS_TONES = ["rose", "lilac", "blue", "mint", "butter"] as const;

type CommissionInProgressTone = (typeof COMMISSION_IN_PROGRESS_TONES)[number];

function commissionInProgressTone(revealIndex: number): CommissionInProgressTone {
  const index = Math.max(0, revealIndex - 1) % COMMISSION_IN_PROGRESS_TONES.length;
  return COMMISSION_IN_PROGRESS_TONES[index];
}

type CommissionInProgressCardProps = {
  commission: HomeCommissionInProgress;
  revealIndex: number;
};

function CommissionInProgressCard({ commission, revealIndex }: CommissionInProgressCardProps) {
  const { commissions: copy } = useHomeMessages();
  const titleId = `home-commission-in-progress-title-${commission.id}`;

  return (
    <article
      className={`home-commissions-in-progress home-commissions-reveal-item home-commissions-reveal-item--step home-commissions-reveal-item--in-progress home-commissions-reveal-item--in-progress-${revealIndex}`}
      data-tone={commissionInProgressTone(revealIndex)}
      aria-labelledby={titleId}
    >
      <CommissionStepFrame />
      <div className="home-commissions-in-progress-header">
        <p className="home-commissions-in-progress-eyebrow">{copy.inProgressEyebrow}</p>
        <div className="home-commissions-in-progress-heading-row">
          <h3 id={titleId} className="home-commissions-in-progress-title">
            {commission.serviceTitle}
          </h3>
          <span className="home-commissions-in-progress-status">{commission.statusLabel}</span>
        </div>
        <p className="home-commissions-in-progress-client">{commission.clientDisplay}</p>
      </div>
      <dl className="home-commissions-in-progress-meta">
        <div className="home-commissions-in-progress-meta-row">
          <dt>{copy.metaStarted}</dt>
          <dd>{formatCommissionDateLabel(commission.startedOn)}</dd>
        </div>
        <div className="home-commissions-in-progress-meta-row">
          <dt>{copy.metaEta}</dt>
          <dd>{formatCommissionDateLabel(commission.etaOn)}</dd>
        </div>
      </dl>
    </article>
  );
}

type CommissionsInProgressCarouselProps = {
  commissions: HomeCommissionInProgress[];
};

function CommissionsInProgressCarousel({ commissions }: CommissionsInProgressCarouselProps) {
  const { commissions: copy } = useHomeMessages();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!carouselApi) return;
    carouselApi.scrollTo(0, true);
  }, [carouselApi, commissions]);

  return (
    <div
      className="home-commissions-in-progress-carousel home-commissions-reveal-item home-commissions-reveal-item--in-progress"
    >
      <Carousel
        setApi={setCarouselApi}
        opts={{
          align: "start",
          loop: false,
          slidesToScroll: 1,
          containScroll: "trimSnaps",
        }}
        className="home-commissions-in-progress-carousel__viewport"
        aria-label={copy.inProgressCarouselAria}
      >
        <CarouselContent className="home-commissions-in-progress-carousel__content !ml-0">
          {commissions.map((commission, index) => (
            <CarouselItem
              key={commission.id}
              className="home-commissions-in-progress-carousel__item !basis-auto !pl-0"
            >
              <CommissionInProgressCard commission={commission} revealIndex={index + 1} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className="home-commissions-in-progress-carousel__control home-commissions-in-progress-carousel__control--prev"
          aria-label={copy.inProgressCarouselPrevAria}
        />
        <CarouselNext
          className="home-commissions-in-progress-carousel__control home-commissions-in-progress-carousel__control--next"
          aria-label={copy.inProgressCarouselNextAria}
        />
      </Carousel>
    </div>
  );
}

export function HomeCommissionsOpen() {
  const { commissions: copy } = useHomeMessages();
  const sectionRef = useRef<HTMLElement>(null);
  const [commissions, setCommissions] = useState<HomeCommissionInProgress[]>([]);
  const [loaded, setLoaded] = useState(false);
  const reveal = useSectionScrollReveal(sectionRef, {
    exitLagVh: 0.48,
    exitSectionRatio: 0.72,
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch("/api/commissions/in-progress", { cache: "no-store" });
        const payload = (await response.json()) as {
          commissions?: HomeCommissionInProgress[];
        };
        if (!cancelled && Array.isArray(payload.commissions)) {
          setCommissions(payload.commissions);
        }
      } catch {
        if (!cancelled) setCommissions([]);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="comisiones"
      className={sectionScrollRevealClassName("home-commissions-open", reveal)}
      aria-labelledby="home-commissions-open-title"
      aria-describedby="home-commissions-open-subtitle"
    >
      <header className="home-commissions-open-header home-commissions-reveal-item home-commissions-reveal-item--header">
        <div className="home-commissions-open-title-row">
          <h2
            id="home-commissions-open-title"
            className="home-commissions-reveal-item home-commissions-reveal-item--title"
          >
            {copy.title}
          </h2>
          {commissions.length > 0 ? (
            <p className="home-commissions-in-progress-carousel__count">
              {copy.inProgressCarouselCount(commissions.length)}
            </p>
          ) : null}
        </div>
        <p
          id="home-commissions-open-subtitle"
          className="home-commissions-open-subtitle home-commissions-reveal-item home-commissions-reveal-item--subtitle"
        >
          {copy.subtitle}
        </p>
      </header>
      {loaded && commissions.length === 0 ? (
        <p className="home-commissions-in-progress-empty home-commissions-reveal-item home-commissions-reveal-item--in-progress">
          {copy.emptyInProgress}
        </p>
      ) : null}
      {commissions.length > 0 ? (
        <CommissionsInProgressCarousel commissions={commissions} />
      ) : null}
      <div
        className="home-commissions-rules-notice home-commissions-reveal-item home-commissions-reveal-item--notice"
        role="note"
      >
        <CommissionStepFrame />
        <div className="home-commissions-rules-notice-leading">
          <div className="home-commissions-rules-notice-warning" aria-hidden="true">
            <svg viewBox="0 0 96 82" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M48 7 87.5 73.5c1.8 3.1-.5 7-3.9 7H12.4c-3.4 0-5.7-3.9-3.9-7L48 7Z"
                fill="var(--home-warning-sign-fill)"
                stroke="var(--home-warning-sign-ink)"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              <rect
                x="44"
                y="27"
                width="8"
                height="28"
                rx="4"
                fill="var(--home-warning-sign-ink)"
              />
              <circle cx="48" cy="63.5" r="4.5" fill="var(--home-warning-sign-ink)" />
            </svg>
          </div>
          <span className="home-commissions-rules-notice-divider" aria-hidden="true" />
        </div>
        <p className="home-commissions-rules-notice-text">
          {copy.rulesNoticeBefore}
          <Link className="home-commissions-rules-notice-text-link" href={COMMISSION_RULES_HREF}>
            <strong>{copy.rulesLink}</strong>
          </Link>
          {copy.rulesNoticeAfter}
        </p>
        <Link className="home-commissions-rules-notice-cta" href={COMMISSION_RULES_HREF}>
          {copy.rulesCta}
          <span className="home-commissions-rules-notice-cta-arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
