import type { Metadata } from "next";
import Link from "next/link";
import {
  COMMISSION_RULES_LAST_UPDATED,
  COMMISSION_RULES_SECTIONS,
} from "@/lib/commission-rules-content";
import { renderLegalInlineText } from "@/lib/legal-inline-text";
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

export default function CommissionRulesPage() {
  return (
    <main className="legal-page">
      <div className="legal-page__inner">
        <Link className="legal-page__back" href="/">
          ← Volver
        </Link>

        <header className="legal-page__header">
          <h1 className="legal-page__title">Reglas de comisiones</h1>
          <p className="legal-page__updated">
            Última actualización: {COMMISSION_RULES_LAST_UPDATED}
          </p>
        </header>

        <div className="legal-page__sections">
          {COMMISSION_RULES_SECTIONS.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-title`}
            >
              <h2
                id={`${section.id}-title`}
                className="legal-page__section-title"
              >
                {section.title}
              </h2>
              {section.paragraphs?.map((paragraph, paragraphIndex) => (
                <p
                  key={`${section.id}-p-${paragraphIndex}`}
                  className="legal-page__paragraph"
                >
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
          ))}
        </div>
      </div>
    </main>
  );
}
