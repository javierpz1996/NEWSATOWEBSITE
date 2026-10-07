import type { Metadata } from "next";
import Link from "next/link";
import { formatCommissionDateLabel } from "@/lib/commission-date-format";
import { listCommissionsInProgressServer } from "@/lib/commissions-in-progress-db";
import {
  isSalesAccessGranted,
  isSalesAccessTokenConfiguredInEnv,
} from "@/lib/sales-access";
import { SalesAccessGate } from "@/app/sales/sales-access-gate";
import { NewWorkCreateForm } from "@/app/new-work/new-work-create-form";
import { NewWorkDeleteButton } from "@/app/new-work/new-work-delete-button";
import { NewWorkProcessStageEditor } from "@/app/new-work/new-work-process-stage-editor";
import { normalizeCommissionProcessStage } from "@/lib/commission-process-stages";
import "@/styles/sales-page.css";
import "@/styles/new-work-page.css";

export const metadata: Metadata = {
  title: "Comisiones en curso",
  description: "Alta de comisiones visibles en Comisiones abiertas.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NewWorkPage() {
  const accessGranted = await isSalesAccessGranted();
  if (!accessGranted) {
    return <SalesAccessGate title="Comisiones en curso" />;
  }

  const { rows, error } = await listCommissionsInProgressServer();
  const accessTokenConfigured = isSalesAccessTokenConfiguredInEnv();

  return (
    <main className="sales-page new-work-page">
      <div className="sales-page__inner">
        <header className="sales-page__header">
          <Link className="sales-page__back" href="/">
            ← Volver al inicio
          </Link>
          <h1 className="sales-page__title">Comisiones en curso</h1>
          <p className="sales-page__lead">
            Lo que publiques acá aparece en <strong>Comisiones abiertas</strong> ({rows.length}{" "}
            {rows.length === 1 ? "activa" : "activas"}).
          </p>
        </header>

        {!accessTokenConfigured ? (
          <p className="sales-page__banner" role="status">
            Acceso con clave por defecto del proyecto. Podés definir{" "}
            <code>SALES_ACCESS_TOKEN</code> en el servidor.
          </p>
        ) : null}

        <NewWorkCreateForm />

        {error ? <p className="sales-page__error" role="alert">{error}</p> : null}

        <section className="new-work-page__list-section" aria-labelledby="new-work-list-title">
          <h2 id="new-work-list-title" className="new-work-page__list-title">
            Publicadas
          </h2>

          {rows.length === 0 && !error ? (
            <p className="sales-page__empty">Todavía no hay comisiones en curso en la base.</p>
          ) : (
            <div className="sales-page__list">
              {rows.map((commission) => (
                <article key={commission.id} className="sales-page__card">
                  <header className="sales-page__card-head">
                    <div>
                      <h3 className="sales-page__card-title">{commission.serviceTitle}</h3>
                      <p className="sales-page__card-contact">{commission.clientDisplay}</p>
                    </div>
                    <span className="new-work-page__status">
                      {normalizeCommissionProcessStage(commission.statusLabel)}
                    </span>
                  </header>
                  <NewWorkProcessStageEditor
                    key={`${commission.id}-${commission.statusLabel}`}
                    commissionId={commission.id}
                    initialStage={normalizeCommissionProcessStage(commission.statusLabel)}
                  />
                  <dl className="new-work-page__meta">
                    <div>
                      <dt>{commission.startedLabel}</dt>
                      <dd>{formatCommissionDateLabel(commission.startedOn)}</dd>
                    </div>
                    <div>
                      <dt>{commission.etaLabel}</dt>
                      <dd>{formatCommissionDateLabel(commission.etaOn)}</dd>
                    </div>
                  </dl>
                  <NewWorkDeleteButton
                    commissionId={commission.id}
                    title={commission.serviceTitle}
                  />
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
