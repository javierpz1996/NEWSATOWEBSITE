const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Display stored commission dates (ISO or legacy free text). */
export function formatCommissionDateLabel(value: string): string {
  const trimmed = value.trim();
  if (!ISO_DATE_PATTERN.test(trimmed)) return trimmed;

  const [year, month, day] = trimmed.split("-").map((part) => Number(part));
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return trimmed;

  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function parseIsoDateToLocal(dateIso: string): Date | null {
  if (!ISO_DATE_PATTERN.test(dateIso)) return null;
  const [year, month, day] = dateIso.split("-").map((part) => Number(part));
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}
