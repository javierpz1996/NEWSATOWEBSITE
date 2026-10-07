/** Etapas del proceso visibles en Comisiones abiertas (`status_label` en Supabase). */
export const COMMISSION_PROCESS_STAGES = [
  "No empezado",
  "Boceto",
  "Lineart",
  "Coloreado",
  "Finalizado",
] as const;

export type CommissionProcessStage = (typeof COMMISSION_PROCESS_STAGES)[number];

export const COMMISSION_PROCESS_STAGE_DEFAULT: CommissionProcessStage = "No empezado";

const STAGE_SET = new Set<string>(COMMISSION_PROCESS_STAGES);

export function isCommissionProcessStage(value: string): value is CommissionProcessStage {
  return STAGE_SET.has(value);
}

export function normalizeCommissionProcessStage(
  value: string | null | undefined,
): CommissionProcessStage {
  const trimmed = value?.trim();
  if (trimmed && isCommissionProcessStage(trimmed)) return trimmed;
  if (trimmed === "En curso") return COMMISSION_PROCESS_STAGE_DEFAULT;
  return COMMISSION_PROCESS_STAGE_DEFAULT;
}
