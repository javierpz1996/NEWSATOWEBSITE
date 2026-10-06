"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

function NsfwAgeGateMark({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`home-nsfw-gate-mark${compact ? " home-nsfw-gate-mark-compact" : ""}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      <span className="home-nsfw-gate-mark-circle">18+</span>
    </div>
  );
}

type HomeServicesNsfwGateProps = {
  copy: {
    closeAria: string;
    title: string;
    description: string;
    consent: string;
    cancel: string;
    enter: string;
  };
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function HomeServicesNsfwGate({
  copy,
  open,
  onClose,
  onConfirm,
}: HomeServicesNsfwGateProps) {
  const [confirmed, setConfirmed] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  const close = useCallback(() => {
    setConfirmed(false);
    onClose();
  }, [onClose]);

  const confirm = () => {
    if (!confirmed) return;
    setConfirmed(false);
    onConfirm();
  };

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKeyDown);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [close, open]);

  if (!open) return null;

  return (
    <div
      className="home-nsfw-gate-overlay"
      onClick={close}
    >
      <div
        ref={dialogRef}
        className="home-nsfw-gate-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="home-nsfw-gate-frame" aria-hidden="true">
          <span className="home-commissions-step-corner home-commissions-step-corner-tl" />
          <span className="home-commissions-step-corner home-commissions-step-corner-tr" />
          <span className="home-commissions-step-corner home-commissions-step-corner-bl" />
          <span className="home-commissions-step-corner home-commissions-step-corner-br" />
        </div>

        <button
          type="button"
          className="home-nsfw-gate-close"
          aria-label={copy.closeAria}
          onClick={close}
        >
          ×
        </button>

        <div className="home-nsfw-gate-icon-wrap">
          <NsfwAgeGateMark />
        </div>

        <h3 id={titleId} className="home-nsfw-gate-title type-h3 text-foreground">
          {copy.title}
        </h3>
        <p id={descriptionId} className="home-nsfw-gate-description type-body-sm text-muted-foreground">
          {copy.description}
        </p>

        <label className="home-nsfw-gate-consent">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
          />
          <span className="type-body-sm text-foreground">
            {copy.consent}
          </span>
        </label>

        <div className="home-nsfw-gate-actions">
          <button type="button" className="ds-button ds-button-secondary" onClick={close}>
            {copy.cancel}
          </button>
          <button
            type="button"
            className={`ds-button ds-button-primary${confirmed ? "" : " ds-button-disabled"}`}
            disabled={!confirmed}
            onClick={confirm}
          >
            <NsfwAgeGateMark compact />
            {copy.enter}
          </button>
        </div>
      </div>
    </div>
  );
}
