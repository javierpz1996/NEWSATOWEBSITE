"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type NewWorkDeleteButtonProps = {
  commissionId: string;
  title: string;
};

export function NewWorkDeleteButton({ commissionId, title }: NewWorkDeleteButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDelete = async () => {
    if (!window.confirm(`¿Quitar «${title}» de comisiones en curso?`)) return;

    setError(null);
    setPending(true);

    try {
      const response = await fetch(`/api/commissions/in-progress/${commissionId}`, {
        method: "DELETE",
      });
      const payload = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok) {
        setError(payload.message ?? "No se pudo borrar.");
        return;
      }
      router.refresh();
    } catch {
      setError("Error de red.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="sales-page__card-actions">
      <button
        type="button"
        className="sales-page__delete-btn"
        onClick={onDelete}
        disabled={pending}
      >
        {pending ? "Borrando…" : "Quitar de la home"}
      </button>
      {error ? <p className="sales-page__delete-error" role="alert">{error}</p> : null}
    </div>
  );
}
