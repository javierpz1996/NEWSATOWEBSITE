import type { Metadata } from "next";
import Link from "next/link";
import { listCartSubmissions, type CartSubmissionRow } from "@/lib/cart-submissions";
import { formatHomeCartUsd } from "@/lib/home-cart";
import { isSalesAccessGranted, getSalesAccessTokenEnv } from "@/lib/sales-access";
import { SalesAccessGate } from "@/app/sales/sales-access-gate";
import { SalesDeleteSubmissionButton } from "@/app/sales/sales-delete-submission-button";
import "@/styles/sales-page.css";

export const metadata: Metadata = {
  title: "Pedidos",
  description: "Propuestas enviadas desde el carrito del sitio.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function formatSubmittedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(date);
}

function SubmissionCard({ row }: { row: CartSubmissionRow }) {
  return (
    <article className="sales-page__card">
      <header className="sales-page__card-head">
        <div>
          <p className="sales-page__card-date">{formatSubmittedAt(row.created_at)}</p>
          <h2 className="sales-page__card-title">
            {row.client_name?.trim() || "Sin nombre"}
          </h2>
          <p className="sales-page__card-contact">
            <span className="sales-page__card-contact-label">{row.social_network}</span>
            {" · "}
            <span>{row.social_username}</span>
          </p>
          {row.payment_method?.trim() ? (
            <p className="sales-page__card-payment">
              Método de pago: <span>{row.payment_method}</span>
            </p>
          ) : null}
        </div>
        <p className="sales-page__card-total">{formatHomeCartUsd(row.total_usd)}</p>
      </header>

      <div className="sales-page__card-items">
        <h3 className="sales-page__card-items-title">Pedido</h3>
        <ul className="sales-page__item-list">
          {row.items.map((item) => (
            <li key={item.id} className="sales-page__item">
              <p className="sales-page__item-title">{item.serviceTitle}</p>
              <ul className="sales-page__item-lines">
                {item.lines.map((line) => (
                  <li key={`${item.id}-${line.label}`}>
                    <span>{line.label}</span>
                    <span>{formatHomeCartUsd(line.priceUsd)}</span>
                  </li>
                ))}
              </ul>
              <p className="sales-page__item-total">
                Total ítem: {formatHomeCartUsd(item.totalUsd)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {row.notes?.trim() ? (
        <div className="sales-page__card-notes">
          <h3 className="sales-page__card-notes-title">Mensaje</h3>
          <p className="sales-page__card-notes-body">{row.notes}</p>
        </div>
      ) : null}

      <p className="sales-page__card-id">
        ID: <code>{row.id}</code>
      </p>

      <SalesDeleteSubmissionButton
        submissionId={row.id}
        clientLabel={row.client_name?.trim() || row.social_username}
      />
    </article>
  );
}

export default async function SalesPage() {
  const accessGranted = await isSalesAccessGranted();
  if (!accessGranted) {
    return <SalesAccessGate />;
  }

  const { rows, error } = await listCartSubmissions();
  const accessTokenConfigured = Boolean(getSalesAccessTokenEnv());

  return (
    <main className="sales-page">
      <div className="sales-page__inner">
        <header className="sales-page__header">
          <div>
            <Link className="sales-page__back" href="/">← Volver al inicio</Link>
            <h1 className="sales-page__title">Pedidos del carrito</h1>
            <p className="sales-page__lead">
              Propuestas guardadas en Supabase ({rows.length}{" "}
              {rows.length === 1 ? "envío" : "envíos"}).
            </p>
          </div>
        </header>

        {!accessTokenConfigured ? (
          <p className="sales-page__banner" role="status">
            Configurá <code>SALES_ACCESS_TOKEN</code> en el servidor para proteger esta ruta en
            producción.
          </p>
        ) : null}

        {error ? (
          <p className="sales-page__error" role="alert">{error}</p>
        ) : null}

        {rows.length === 0 && !error ? (
          <p className="sales-page__empty">Todavía no hay pedidos en la base de datos.</p>
        ) : (
          <div className="sales-page__list">
            {rows.map((row) => (
              <SubmissionCard key={row.id} row={row} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
