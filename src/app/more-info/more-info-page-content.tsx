"use client";

import Link from "next/link";
import { useHomeMessages } from "@/hooks/use-home-messages";
import { renderLegalInlineText } from "@/lib/legal-inline-text";
import "@/styles/legal-page.css";

export function MoreInfoPageContent() {
  const { moreInfoPage } = useHomeMessages();

  return (
    <main className="legal-page">
      <div className="legal-page__inner">
        <Link className="legal-page__back" href="/#inicio">
          {moreInfoPage.backLabel}
        </Link>

        <header className="legal-page__header">
          <h1 className="legal-page__title">{moreInfoPage.title}</h1>
        </header>

        <div className="legal-page__sections">
          <section>
            {moreInfoPage.storyParagraphs.map((paragraph, index) => (
              <p key={`story-${index}`} className="legal-page__paragraph">
                {paragraph}
              </p>
            ))}
          </section>

          <section aria-labelledby="more-info-pricing">
            <p className="legal-page__pricing-highlight" id="more-info-pricing">
              {moreInfoPage.pricingHighlight}
            </p>
            {moreInfoPage.pricingParagraphs.map((paragraph, index) => (
              <p key={`pricing-${index}`} className="legal-page__paragraph">
                {renderLegalInlineText(paragraph)}
              </p>
            ))}
          </section>

          <section aria-labelledby="more-info-vision">
            <h2 id="more-info-vision" className="legal-page__section-title">
              {moreInfoPage.visionTitle}
            </h2>
            {moreInfoPage.visionParagraphs.map((paragraph, index) => (
              <p key={`vision-${index}`} className="legal-page__paragraph">
                {paragraph}
              </p>
            ))}
          </section>

        </div>
      </div>
    </main>
  );
}
