"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SalesDeleteSubmissionButtonProps = {
  submissionId: string;
  clientLabel: string;
};

export function SalesDeleteSubmissionButton({
  submissionId,
  clientLabel,
}: SalesDeleteSubmissionButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDelete = async () => {
    const label = clientLabel.trim() || "este pedido";
    if (!window.confirm(`¿Borrar el pedido de ${label}? No se puede deshacer.`)) {
      return;
    }

    setError(null);
    setPending(true);

    try {
      const response = await fetch(`/api/sales/submissions/${submissionId}`, {
        method: "DELETE",
      });
      const payload = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok) {
        setError(payload.message ?? "No se pudo borrar el pedido.");
        return;
      }
      router.refresh();
    } catch {
      setError("Error de red. Intentá de nuevo.");
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
        aria-busy={pending}
      >
        {pending ? "Borrando…" : "Borrar pedido"}
      </button>
      {error ? (
        <p className="sales-page__delete-error" role="alert">{error}</p>
      ) : null}
    </div>
  );
}
