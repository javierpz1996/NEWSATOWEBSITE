"use client";

import Image from "next/image";
import { type FormEvent, useCallback, useRef, useState } from "react";
import {
  sectionScrollRevealClassName,
  useSectionScrollReveal,
} from "@/hooks/use-section-scroll-reveal";
import { useHomeMessages } from "@/hooks/use-home-messages";
import {
  ContactMessageSubmitError,
  submitContactMessageToSupabase,
} from "@/lib/home-contact-submit";
import {
  fieldInvalidClassName,
  fieldWrapperClassName,
  focusFormField,
  getEmptyFormFieldNames,
} from "@/lib/home-form-validation";

const HOME_CONTACT_ILLUSTRATION_SRC =
  "/works/placeholder/milo_teo_luki.png" as const;
const HOME_CONTACT_ILLUSTRATION_WIDTH = 2532;
const HOME_CONTACT_ILLUSTRATION_HEIGHT = 1908;

const CONTACT_REQUIRED_FIELDS = ["title", "message"] as const;

export function HomeContact() {
  const { contact } = useHomeMessages();
  const sectionRef = useRef<HTMLElement>(null);
  const reveal = useSectionScrollReveal(sectionRef);
  const [invalidFields, setInvalidFields] = useState<ReadonlySet<string>>(() => new Set());
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const clearFieldError = useCallback((fieldName: string) => {
    setInvalidFields((current) => {
      if (!current.has(fieldName)) return current;
      const next = new Set(current);
      next.delete(fieldName);
      return next;
    });
  }, []);

  const resetForm = useCallback(() => {
    setSent(false);
    setSubmitError(null);
    setInvalidFields(new Set());
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (submitting) return;

      const form = event.currentTarget;
      const empty = getEmptyFormFieldNames(form, CONTACT_REQUIRED_FIELDS);
      setInvalidFields(empty);
      setSubmitError(null);

      if (empty.size > 0) {
        focusFormField(form, CONTACT_REQUIRED_FIELDS, empty);
        return;
      }

      const data = new FormData(form);
      const title = String(data.get("title") ?? "").trim();
      const message = String(data.get("message") ?? "").trim();

      setSubmitting(true);
      try {
        await submitContactMessageToSupabase({ title, message });
        setSent(true);
        setInvalidFields(new Set());
        form.reset();
      } catch (error) {
        const messageText =
          error instanceof ContactMessageSubmitError
            ? error.message
            : contact.submitError;
        setSubmitError(messageText);
      } finally {
        setSubmitting(false);
      }
    },
    [contact.submitError, submitting],
  );

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
          {sent ? (
            <div
              className="home-contact-form home-contact-form--success home-contact-reveal-item home-contact-reveal-item--cta"
              role="status"
              aria-live="polite"
            >
              <p className="home-contact-form__success-mark" aria-hidden="true">✓</p>
              <p className="home-contact-form__success-title">{contact.successTitle}</p>
              <p className="home-contact-form__success-text">{contact.successText}</p>
              <button
                type="button"
                className="home-contact-form__submit home-contact-form__success-action"
                onClick={resetForm}
              >
                {contact.sendAnother}
              </button>
            </div>
          ) : (
            <form
              className="home-contact-form home-contact-reveal-item home-contact-reveal-item--cta"
              onSubmit={handleSubmit}
              noValidate
            >
              <div
                className={`${fieldWrapperClassName(invalidFields, "title")} home-contact-form__field`}
              >
                <label className="home-contact-form__label" htmlFor="home-contact-title">
                  {contact.subjectLabel}
                </label>
                <input
                  id="home-contact-title"
                  className={fieldInvalidClassName(
                    "home-contact-form__input",
                    "title",
                    invalidFields,
                  )}
                  type="text"
                  name="title"
                  placeholder={contact.subjectPlaceholder}
                  required
                  disabled={submitting}
                  autoComplete="off"
                  aria-invalid={invalidFields.has("title")}
                  aria-describedby={
                    invalidFields.has("title") ? "home-contact-title-error" : undefined
                  }
                  onInput={() => clearFieldError("title")}
                />
                {invalidFields.has("title") ? (
                  <p
                    id="home-contact-title-error"
                    className="home-contact-form__field-error"
                    role="alert"
                  >
                    {contact.fieldRequired}
                  </p>
                ) : null}
              </div>

              <div
                className={`${fieldWrapperClassName(invalidFields, "message")} home-contact-form__field--message`}
              >
                <label
                  className="home-contact-form__label"
                  htmlFor="home-contact-message"
                >
                  {contact.messageLabel}
                </label>
                <textarea
                  id="home-contact-message"
                  className={fieldInvalidClassName(
                    "home-contact-form__textarea",
                    "message",
                    invalidFields,
                  )}
                  name="message"
                  rows={5}
                  placeholder={contact.messagePlaceholder}
                  required
                  disabled={submitting}
                  aria-invalid={invalidFields.has("message")}
                  aria-describedby={
                    invalidFields.has("message") ? "home-contact-message-error" : undefined
                  }
                  onInput={() => clearFieldError("message")}
                />
                {invalidFields.has("message") ? (
                  <p
                    id="home-contact-message-error"
                    className="home-contact-form__field-error"
                    role="alert"
                  >
                    {contact.fieldRequired}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                className="home-contact-form__submit"
                disabled={submitting}
              >
                {submitting ? contact.sending : contact.submit}{" "}
                {!submitting ? <span aria-hidden="true">↗</span> : null}
              </button>

              {submitError ? (
                <p className="home-contact-form__field-error" role="alert">
                  {submitError}
                </p>
              ) : null}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
