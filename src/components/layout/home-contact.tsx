"use client";

import { type FormEvent, useCallback, useRef, useState } from "react";
import {
  sectionScrollRevealClassName,
  useSectionScrollReveal,
} from "@/hooks/use-section-scroll-reveal";
import { buildContactMailtoHref, CONTACT_EMAIL } from "@/lib/contact";

export function HomeContact() {
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
    setSubmitHint("Se abrirá tu correo para confirmar el envío.");
    form.reset();
  }, []);

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
            ¿Hablamos
            <br />
            <em>de una idea?</em>
          </h2>
          <p
            className="home-contact-subtitle home-contact-reveal-item home-contact-reveal-item--subtitle"
          >
            Ya sea un proyecto, una colaboración o alguna idea interesante,
            contactame.
          </p>
        </div>

        <form
          className="home-contact-form home-contact-reveal-item home-contact-reveal-item--cta"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="home-contact-form__field">
            <label className="home-contact-form__label" htmlFor="home-contact-email">
              Email
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
              Mensaje
            </label>
            <textarea
              id="home-contact-message"
              className="home-contact-form__textarea"
              name="message"
              rows={5}
              placeholder="Contame tu idea…"
              required
            />
          </div>

          <button type="submit" className="home-contact-form__submit">
            Enviar email <span aria-hidden="true">↗</span>
          </button>

          {submitHint ? (
            <p className="home-contact-form__hint" role="status">{submitHint}</p>
          ) : (
            <p className="home-contact-form__hint">
              Se abrirá tu correo para confirmar el envío.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
