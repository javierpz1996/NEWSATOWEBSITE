"use client";

import { useState, type FormEvent } from "react";

type SalesAccessGateProps = {
  title?: string;
};

export function SalesAccessGate({ title = "Pedidos" }: SalesAccessGateProps) {
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/sales/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const payload = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok) {
        setError(payload.message ?? "No se pudo verificar la clave.");
        return;
      }
      window.location.reload();
    } catch {
      setError("Error de red. Intentá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="sales-page">
      <div className="sales-page__inner sales-page__inner--narrow">
        <h1 className="sales-page__title">{title}</h1>
        <p className="sales-page__lead">Esta vista es privada. Ingresá la clave de acceso.</p>
        <form className="sales-page__gate-form" onSubmit={onSubmit}>
          <label className="sales-page__gate-label" htmlFor="sales-access-token">
            Clave de acceso
          </label>
          <input
            id="sales-access-token"
            className="sales-page__gate-input"
            type="password"
            name="token"
            autoComplete="current-password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            required
          />
          {error ? (
            <p className="sales-page__gate-error" role="alert">{error}</p>
          ) : null}
          <button className="sales-page__gate-submit" type="submit" disabled={submitting}>
            {submitting ? "Verificando…" : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
