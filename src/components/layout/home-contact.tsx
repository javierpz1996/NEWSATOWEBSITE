"use client";

import Image from "next/image";
import { type FormEvent, useCallback, useRef, useState } from "react";
import {
  sectionScrollRevealClassName,
  useSectionScrollReveal,
} from "@/hooks/use-section-scroll-reveal";
import { buildContactMailtoHref, CONTACT_EMAIL } from "@/lib/contact";
import { useHomeMessages } from "@/hooks/use-home-messages";

const HOME_CONTACT_ILLUSTRATION_SRC =
  "/works/placeholder/milo_teo_luki.png" as const;
const HOME_CONTACT_ILLUSTRATION_WIDTH = 2532;
const HOME_CONTACT_ILLUSTRATION_HEIGHT = 1908;

export function HomeContact() {
  const { contact } = useHomeMessages();
  const sectionRef = useRef<HTMLElement>(null);
  const reveal = useSectionScrollReveal(sectionRef);
  const [submitHint, setSubmitHint] = useState<string | null>(null);

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const message = String(data.get("message") ?? "").trim();

    if (!message) return;

    const href = buildContactMailtoHref({ message });
    window.location.href = href;
    setSubmitHint(contact.hintAfterSubmit);
    form.reset();
  }, [contact.hintAfterSubmit]);

  return (
    <section
      ref={sectionRef}
      id="contacto"
      className={sectionScrollRevealClassName("home-contact", reveal)}
      aria-labelledby="home-contact-title"
    >
      <div className="home-contact-row">
        <div className="home-contact-copy">
          <h2
            id="home-contact-title"
            className="home-contact-reveal-item home-contact-reveal-item--title"
          >
            {contact.titleLine1}
            <br />
            <em>{contact.titleEmphasis}</em>
          </h2>
          <figure
            className="home-contact-illustration home-contact-reveal-item home-contact-reveal-item--illustration"
          >
            <Image
              className="home-contact-illustration__image"
              src={HOME_CONTACT_ILLUSTRATION_SRC}
              alt={contact.illustrationAlt}
              width={HOME_CONTACT_ILLUSTRATION_WIDTH}
              height={HOME_CONTACT_ILLUSTRATION_HEIGHT}
              unoptimized
            />
          </figure>
        </div>

        <div className="home-contact-form-slot">
          <form
            className="home-contact-form home-contact-reveal-item home-contact-reveal-item--cta"
            onSubmit={handleSubmit}
            noValidate
          >
          <div className="home-contact-form__field">
            <label className="home-contact-form__label" htmlFor="home-contact-email">
              {contact.emailLabel}
            </label>
            <input
              id="home-contact-email"
              className="home-contact-form__input home-contact-form__input--fixed"
              type="email"
              name="email"
              value={CONTACT_EMAIL}
              readOnly
              aria-readonly="true"
            />
          </div>

          <div className="home-contact-form__field home-contact-form__field--message">
            <label
              className="home-contact-form__label"
              htmlFor="home-contact-message"
            >
              {contact.messageLabel}
            </label>
            <textarea
              id="home-contact-message"
              className="home-contact-form__textarea"
              name="message"
              rows={5}
              placeholder={contact.messagePlaceholder}
              required
            />
          </div>

          <button type="submit" className="home-contact-form__submit">
            {contact.submit} <span aria-hidden="true">↗</span>
          </button>

          {submitHint ? (
            <p className="home-contact-form__hint" role="status">{submitHint}</p>
          ) : (
            <p className="home-contact-form__hint">
              {contact.hint}
            </p>
          )}
          </form>
        </div>
      </div>
    </section>
  );
}
