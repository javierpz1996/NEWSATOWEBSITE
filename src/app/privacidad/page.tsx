import type { Metadata } from "next";
import Link from "next/link";
import {
  PRIVACY_POLICY_CONTACT_EMAIL,
  PRIVACY_POLICY_LAST_UPDATED,
  PRIVACY_POLICY_SECTIONS,
} from "@/lib/privacy-policy-content";
import "@/styles/legal-page.css";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Información sobre el tratamiento de datos, cookies y almacenamiento local en este sitio.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="legal-page">
      <div className="legal-page__inner">
        <Link className="legal-page__back" href="/">
          ← Volver al inicio
        </Link>

        <header className="legal-page__header">
          <h1 className="legal-page__title">Política de privacidad</h1>
          <p className="legal-page__updated">
            Última actualización: {PRIVACY_POLICY_LAST_UPDATED}
          </p>
        </header>

        <div className="legal-page__sections">
          {PRIVACY_POLICY_SECTIONS.map((section) => (
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
                  Para cualquier consulta sobre privacidad, escribinos a{" "}
                  <a
                    className="legal-page__contact-link"
                    href={`mailto:${PRIVACY_POLICY_CONTACT_EMAIL}`}
                  >
                    {PRIVACY_POLICY_CONTACT_EMAIL}
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
          Texto legal provisional. Sustituir por la versión definitiva antes del
          lanzamiento público del Sitio.
        </p>
      </div>
    </main>
  );
}
