"use client";

import { CommissionDatePicker } from "@/components/commission-date-picker";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import "@/styles/commission-date-picker.css";

export function NewWorkCreateForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    const form = event.currentTarget;
    const data = new FormData(form);
    const startedOn = String(data.get("startedOn") ?? "");
    const etaOn = String(data.get("etaOn") ?? "");

    if (startedOn && etaOn && etaOn < startedOn) {
      setError("La entrega estimada no puede ser anterior al inicio.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/commissions/in-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceTitle: data.get("serviceTitle"),
          clientDisplay: data.get("clientDisplay"),
          startedOn,
          etaOn,
        }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        message?: string;
        commission?: { serviceTitle?: string };
      };

      if (!response.ok) {
        setError(payload.message ?? "No se pudo guardar.");
        return;
      }

      form.reset();
      setSuccess(
        payload.commission?.serviceTitle
          ? `«${payload.commission.serviceTitle}» publicada en Comisiones abiertas.`
          : "Comisión agregada.",
      );
      router.refresh();
    } catch {
      setError("Error de red.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="sales-page__gate-form new-work-form" onSubmit={onSubmit}>
      <h2 className="new-work-form__title">Nueva comisión en curso</h2>

      <label className="sales-page__gate-label" htmlFor="new-work-service-title">
        Título del servicio
      </label>
      <input
        id="new-work-service-title"
        className="sales-page__gate-input"
        name="serviceTitle"
        type="text"
        placeholder="Ej. Simplista coloreado"
        required
      />

      <label className="sales-page__gate-label" htmlFor="new-work-client-display">
        Tipo / cliente (texto visible)
      </label>
      <input
        id="new-work-client-display"
        className="sales-page__gate-input"
        name="clientDisplay"
        type="text"
        placeholder="Ej. Tipo: SFW"
        required
      />

      <CommissionDatePicker
        id="new-work-started-on"
        name="startedOn"
        label="Inicio"
        required
      />

      <CommissionDatePicker
        id="new-work-eta-on"
        name="etaOn"
        label="Entrega estimada"
        required
      />

      {error ? <p className="sales-page__gate-error" role="alert">{error}</p> : null}
      {success ? <p className="new-work-form__success" role="status">{success}</p> : null}

      <button className="sales-page__gate-submit" type="submit" disabled={submitting}>
        {submitting ? "Guardando…" : "Publicar en Comisiones abiertas"}
      </button>
    </form>
  );
}
