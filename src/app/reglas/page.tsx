import type { Metadata } from "next";
import Link from "next/link";
import {
  COMMISSION_RULES_CONTACT_EMAIL,
  COMMISSION_RULES_LAST_UPDATED,
  COMMISSION_RULES_SECTIONS,
} from "@/lib/commission-rules-content";
import "@/styles/legal-page.css";

export const metadata: Metadata = {
  title: "Reglas de comisiones",
  description:
    "Condiciones generales para solicitar encargos, pagos, revisiones y uso del arte.",
};

export default function CommissionRulesPage() {
  return (
    <main className="legal-page">
      <div className="legal-page__inner">
        <Link className="legal-page__back" href="/#comisiones">
          ← Volver a comisiones
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
              {section.paragraphs.map((paragraph, paragraphIndex) => (
                <p
                  key={`${section.id}-p-${paragraphIndex}`}
                  className="legal-page__paragraph"
                >
                  {paragraph}
                </p>
              ))}
              {section.id === "contacto" ? (
                <p className="legal-page__paragraph">
                  Correo de contacto:{" "}
                  <a
                    className="legal-page__contact-link"
                    href={`mailto:${COMMISSION_RULES_CONTACT_EMAIL}`}
                  >
                    {COMMISSION_RULES_CONTACT_EMAIL}
                  </a>
                  .
                </p>
              ) : null}
              {section.listItems ? (
                <ul className="legal-page__list">
                  {section.listItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <p className="legal-page__notice" role="note">
          Texto provisional. Sustituir por las reglas definitivas de la artista
          antes del lanzamiento público del Sitio.
        </p>
      </div>
    </main>
  );
}
