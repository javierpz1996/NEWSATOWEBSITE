"use client";

import { Cookie } from "lucide-react";
import Link from "next/link";
import {
  type AnimationEvent,
  useCallback,
  useEffect,
  useId,
  useState,
  useSyncExternalStore,
} from "react";
import {
  HOME_COOKIE_CONSENT_SHOW_DELAY_MS,
  HOME_PRIVACY_POLICY_HREF,
  readHomeCookieConsent,
  subscribeHomeCookieConsent,
  type HomeCookieConsentValue,
  writeHomeCookieConsent,
} from "@/lib/home-cookie-consent";
import { useHomeMessages } from "@/hooks/use-home-messages";

const HOME_COOKIE_CONSENT_EXIT_ANIMATION_NAMES = new Set([
  "home-cookie-consent-out",
  "home-cookie-consent-out-reduced",
]);

export function HomeCookieConsent() {
  const { cookies } = useHomeMessages();
  const titleId = useId();
  const [delayedReady, setDelayedReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const consent = useSyncExternalStore(
    subscribeHomeCookieConsent,
    readHomeCookieConsent,
    () => null,
  );

  useEffect(() => {
    if (consent !== null) return;
    const timeoutId = window.setTimeout(
      () => setDelayedReady(true),
      HOME_COOKIE_CONSENT_SHOW_DELAY_MS,
    );
    return () => window.clearTimeout(timeoutId);
  }, [consent]);

  const beginDismiss = useCallback(
    (value: HomeCookieConsentValue) => {
      if (isExiting || consent !== null) return;
      setIsExiting(true);
      writeHomeCookieConsent(value);
    },
    [consent, isExiting],
  );

  const finishDismiss = useCallback(() => {
    setIsExiting(false);
  }, []);

  const handleAnimationEnd = useCallback(
    (event: AnimationEvent<HTMLDivElement>) => {
      if (event.currentTarget !== event.target) return;
      if (!HOME_COOKIE_CONSENT_EXIT_ANIMATION_NAMES.has(event.animationName)) {
        return;
      }
      if (!isExiting) return;
      finishDismiss();
    },
    [finishDismiss, isExiting],
  );

  const close = useCallback(() => {
    beginDismiss("rejected");
  }, [beginDismiss]);

  const accept = useCallback(() => {
    beginDismiss("accepted");
  }, [beginDismiss]);

  const reject = useCallback(() => {
    beginDismiss("rejected");
  }, [beginDismiss]);

  const open =
    isExiting || (delayedReady && consent === null);

  if (!open) return null;

  return (
    <div
      className={`home-cookie-consent${isExiting ? " home-cookie-consent--exiting" : ""}`}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      aria-hidden={isExiting}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="home-cookie-consent__panel">
        <button
          type="button"
          className="home-cookie-consent__close"
          onClick={close}
          aria-label={cookies.closeAria}
        >
          <span aria-hidden="true">×</span>
        </button>

        <h2 id={titleId} className="home-cookie-consent__title">
          <Cookie
            className="home-cookie-consent__title-icon"
            aria-hidden="true"
            strokeWidth={2}
          />
          {cookies.title}
        </h2>

        <div className="home-cookie-consent__body">
          <p className="home-cookie-consent__text">
            {cookies.body}
          </p>

          <div className="home-cookie-consent__actions">
            <button
              type="button"
              className="home-cookie-consent__btn home-cookie-consent__btn--primary"
              onClick={accept}
            >
              {cookies.accept}
            </button>
            <button
              type="button"
              className="home-cookie-consent__btn home-cookie-consent__btn--secondary"
              onClick={reject}
            >
              {cookies.reject}
            </button>
            <button
              type="button"
              className="home-cookie-consent__btn home-cookie-consent__btn--secondary"
              onClick={close}
            >
              {cookies.dismiss}
            </button>
          </div>
        </div>

        <Link
          href={HOME_PRIVACY_POLICY_HREF}
          className="home-cookie-consent__privacy"
        >
          <span>{cookies.privacyLink}</span>
          <span className="home-cookie-consent__privacy-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" width={14} height={14} focusable="false">
              <path
                d="M5 12 H19 M14 7 L19 12 L14 17"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
}
