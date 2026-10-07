"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CommissionProcessStageSelect } from "@/components/commission-process-stage-select";
import {
  type CommissionProcessStage,
  isCommissionProcessStage,
} from "@/lib/commission-process-stages";

type NewWorkProcessStageEditorProps = {
  commissionId: string;
  initialStage: CommissionProcessStage;
};

export function NewWorkProcessStageEditor({
  commissionId,
  initialStage,
}: NewWorkProcessStageEditorProps) {
  const router = useRouter();
  const [stage, setStage] = useState<CommissionProcessStage>(() => initialStage);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const onSave = async () => {
    if (!isCommissionProcessStage(stage)) {
      setError("Etapa inválida.");
      return;
    }

    setError(null);
    setSaved(false);
    setPending(true);

    try {
      const response = await fetch(`/api/commissions/in-progress/${commissionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusLabel: stage }),
      });
      const payload = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok) {
        setError(payload.message ?? "No se pudo actualizar la etapa.");
        return;
      }

      setSaved(true);
      router.refresh();
    } catch {
      setError("Error de red.");
    } finally {
      setPending(false);
    }
  };

  const dirty = stage !== initialStage;

  return (
    <div className="new-work-page__stage-editor">
      <CommissionProcessStageSelect
        id={`new-work-stage-${commissionId}`}
        label="Etapa del proceso"
        value={stage}
        disabled={pending}
        onChange={setStage}
      />
      <div className="new-work-page__stage-editor-actions">
        <button
          type="button"
          className="sales-page__gate-submit new-work-page__stage-save"
          onClick={onSave}
          disabled={pending || !dirty}
        >
          {pending ? "Guardando…" : "Guardar etapa"}
        </button>
        {saved && !dirty ? (
          <p className="new-work-page__stage-saved" role="status">Etapa actualizada.</p>
        ) : null}
        {error ? <p className="sales-page__gate-error" role="alert">{error}</p> : null}
      </div>
    </div>
  );
}
