import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import {
  COMMISSION_RULES_DICTIONARY,
  COMMISSION_RULES_DRAWING_BLOCKS,
  COMMISSION_RULES_LAST_UPDATED,
  COMMISSION_RULES_MOBILE_LINE_BREAK,
  COMMISSION_RULES_SECTIONS,
  type CommissionRulesDictionaryEntry,
  type CommissionRulesSection,
} from "@/lib/commission-rules-content";
import {
  HOME_FOOTER_LOGO_HEIGHT,
  HOME_FOOTER_LOGO_SRC,
  HOME_FOOTER_LOGO_WIDTH,
} from "@/lib/brand-assets";
import { HomePageTop } from "@/components/layout/home-page-top";
import { renderLegalInlineText } from "@/lib/legal-inline-text";
import "@/styles/commission-rules-page.css";
import "@/styles/legal-page.css";

export const metadata: Metadata = {
  title: "Reglas de comisiones",
  description:
    "Condiciones para solicitar encargos: qué dibujo, términos, pagos, plazos, correcciones y uso del arte.",
};

function RulesSubsection({
  subsection,
  listUseTextDash = false,
}: {
  subsection: { title: string; paragraphs?: string[]; listItems?: string[] };
  listUseTextDash?: boolean;
}) {
  return (
    <div className="legal-page__subsection">
      <h3 className="legal-page__subsection-title">{subsection.title}</h3>
      {subsection.paragraphs?.map((paragraph, index) => (
        <p key={`${subsection.title}-p-${index}`} className="legal-page__paragraph">
          {renderLegalInlineText(paragraph)}
        </p>
      ))}
      {subsection.listItems ? (
        <ul
          className={`legal-page__list${listUseTextDash ? " legal-page__list--text-dash" : ""}`}
        >
          {subsection.listItems.map((item) => (
            <li key={item}>{renderLegalInlineText(item)}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function RulesSectionBlock({ section }: { section: CommissionRulesSection }) {
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`}>
      <h2 id={`${section.id}-title`} className="legal-page__section-title">
        {section.title}
      </h2>
      {section.paragraphs?.map((paragraph, paragraphIndex) => (
        <p key={`${section.id}-p-${paragraphIndex}`} className="legal-page__paragraph">
          {renderLegalInlineText(paragraph)}
        </p>
      ))}
      {section.listItems ? (
        <ul
          className={`legal-page__list${
            section.id === "dibujo" ? " legal-page__list--text-dash" : ""
          }`}
        >
          {section.listItems.map((item) => (
            <li key={item}>{renderLegalInlineText(item)}</li>
          ))}
        </ul>
      ) : null}
      {section.subsections?.map((subsection) => (
        <RulesSubsection
          key={subsection.title}
          subsection={subsection}
          listUseTextDash={section.id === "dibujo" || section.id === "forma-de-pago"}
        />
      ))}
    </section>
  );
}

function renderDrawingListItem(text: string): ReactNode {
  if (!text.includes(COMMISSION_RULES_MOBILE_LINE_BREAK)) {
    return renderLegalInlineText(text);
  }

  const [before, after] = text.split(COMMISSION_RULES_MOBILE_LINE_BREAK);
  return (
    <>
      {renderLegalInlineText(before)}
      <br className="commission-rules-page__list-mobile-break" />
      {renderLegalInlineText(after)}
    </>
  );
}

function DictionaryEntry({ entry }: { entry: CommissionRulesDictionaryEntry }) {
  return (
    <p className="commission-rules-page__dictionary-entry">
      <strong className="commission-rules-page__dictionary-term">{entry.term}:</strong>{" "}
      {renderLegalInlineText(entry.definition)}
    </p>
  );
}

function getContinuedSections(): CommissionRulesSection[] {
  return COMMISSION_RULES_SECTIONS.filter(
    (section) => section.id !== "dibujo" && section.id !== "terminos-de-servicio",
  );
}

export default function CommissionRulesPage() {
  const termsSection = COMMISSION_RULES_SECTIONS.find(
    (section) => section.id === "terminos-de-servicio",
  );
  const termsParagraphs = termsSection?.paragraphs ?? [];
  const termsLead = termsParagraphs[0];
  const termsRest = termsParagraphs.slice(1);
  const continuedSections = getContinuedSections();

  return (
    <main className="commission-rules-page">
      <div className="commission-rules-page__inner">
        <Link className="commission-rules-page__back" href="/">
          ← Volver
        </Link>

        <div className="commission-rules-page__intro">
          <header className="commission-rules-page__header">
            <h1 className="commission-rules-page__title">Reglas de comisiones</h1>
            <p className="commission-rules-page__updated">
              Última actualización: {COMMISSION_RULES_LAST_UPDATED.toUpperCase()}
            </p>
          </header>

          <div className="commission-rules-page__drawing">
            <div className="commission-rules-page__panel">
              {COMMISSION_RULES_DRAWING_BLOCKS.map((block) => (
                <section
                  key={block.id}
                  className={`commission-rules-page__block commission-rules-page__block--${block.tone}`}
                  aria-labelledby={`${block.id}-badge`}
                >
                  <h2 id={`${block.id}-badge`} className="commission-rules-page__block-badge">
                    {block.title}
                  </h2>
                  <ul className="commission-rules-page__list">
                    {block.listItems.map((item) => (
                      <li key={item}>{renderDrawingListItem(item)}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>

          <figure className="commission-rules-page__lucy" aria-hidden="true">
            <Image
              className="commission-rules-page__lucy-image"
              src={HOME_FOOTER_LOGO_SRC}
              alt=""
              width={HOME_FOOTER_LOGO_WIDTH}
              height={HOME_FOOTER_LOGO_HEIGHT}
              unoptimized
              priority
            />
          </figure>
        </div>

        <section
          className="commission-rules-page__panel commission-rules-page__panel--legal commission-rules-page__dictionary"
          aria-labelledby="commission-rules-dictionary-title"
        >
          <h2 id="commission-rules-dictionary-title" className="legal-page__section-title">
            {COMMISSION_RULES_DICTIONARY.title}
          </h2>
          {COMMISSION_RULES_DICTIONARY.beforeExample.map((entry) => (
            <DictionaryEntry key={entry.term} entry={entry} />
          ))}
          <p className="commission-rules-page__dictionary-example">
            {COMMISSION_RULES_DICTIONARY.exampleLabel}
          </p>
          <div className="commission-rules-page__dictionary-examples">
            {COMMISSION_RULES_DICTIONARY.exampleImages.map((image) => (
              <Image
                key={image.src}
                className="commission-rules-page__dictionary-example-image"
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="(max-width: 560px) 100vw, 50vw"
              />
            ))}
          </div>
          {COMMISSION_RULES_DICTIONARY.afterExample.map((entry) => (
            <DictionaryEntry key={entry.term} entry={entry} />
          ))}
        </section>

        {termsLead ? (
          <section
            className="commission-rules-page__panel commission-rules-page__panel--legal commission-rules-page__terms-intro"
            aria-labelledby="commission-rules-terms-title"
          >
            <h2 id="commission-rules-terms-title" className="legal-page__section-title">
              Términos de servicio
            </h2>
            <p className="legal-page__paragraph">{renderLegalInlineText(termsLead)}</p>
            {termsRest.map((paragraph, index) => (
              <p key={`terms-rest-${index}`} className="legal-page__paragraph">
                {renderLegalInlineText(paragraph)}
              </p>
            ))}
          </section>
        ) : null}

        {continuedSections.length > 0 ? (
          <div className="commission-rules-page__panel commission-rules-page__panel--legal">
            <div className="commission-rules-page__legal-sections legal-page__sections">
              {continuedSections.map((section) => (
                <RulesSectionBlock key={section.id} section={section} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <HomePageTop />
    </main>
  );
}
