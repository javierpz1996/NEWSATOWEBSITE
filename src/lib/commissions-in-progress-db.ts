import type { HomeCommissionInProgress } from "@/lib/home-commission-in-progress";
import { createSupabaseAdminClient } from "@/lib/supabase/server-admin";

export type CommissionInProgressRow = {
  id: string;
  created_at: string;
  status_label: string;
  service_title: string;
  client_display: string;
  started_label: string;
  started_on: string;
  eta_label: string;
  eta_on: string;
};

export type CreateCommissionInProgressInput = {
  statusLabel?: string;
  serviceTitle: string;
  clientDisplay: string;
  startedLabel?: string;
  startedOn: string;
  etaLabel?: string;
  etaOn: string;
};

function mapRow(row: CommissionInProgressRow): HomeCommissionInProgress {
  return {
    id: row.id,
    statusLabel: row.status_label,
    serviceTitle: row.service_title,
    clientDisplay: row.client_display,
    startedLabel: row.started_label,
    startedOn: row.started_on,
    etaLabel: row.eta_label,
    etaOn: row.eta_on,
  };
}

function normalizeRow(raw: Record<string, unknown>): CommissionInProgressRow | null {
  if (typeof raw.id !== "string") return null;
  return {
    id: raw.id,
    created_at: String(raw.created_at ?? ""),
    status_label: String(raw.status_label ?? "En curso"),
    service_title: String(raw.service_title ?? ""),
    client_display: String(raw.client_display ?? ""),
    started_label: String(raw.started_label ?? "Inicio"),
    started_on: String(raw.started_on ?? ""),
    eta_label: String(raw.eta_label ?? "Entrega estimada"),
    eta_on: String(raw.eta_on ?? ""),
  };
}

export async function listCommissionsInProgressServer(): Promise<{
  rows: HomeCommissionInProgress[];
  error: string | null;
}> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return { rows: [], error: "Falta SUPABASE_SERVICE_ROLE_KEY en el servidor." };
  }

  const { data, error } = await supabase
    .from("commissions_in_progress")
    .select(
      "id, created_at, status_label, service_title, client_display, started_label, started_on, eta_label, eta_on",
    )
    .order("created_at", { ascending: false });

  if (error) return { rows: [], error: error.message };

  const rows = (data ?? [])
    .map((entry) => normalizeRow(entry as Record<string, unknown>))
    .filter((row): row is CommissionInProgressRow => row !== null)
    .map(mapRow);

  return { rows, error: null };
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isCommissionInProgressId(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export async function createCommissionInProgress(
  input: CreateCommissionInProgressInput,
): Promise<{ row: HomeCommissionInProgress | null; error: string | null }> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return { row: null, error: "Falta SUPABASE_SERVICE_ROLE_KEY en el servidor." };
  }

  const serviceTitle = input.serviceTitle.trim();
  const clientDisplay = input.clientDisplay.trim();
  const startedOn = input.startedOn.trim();
  const etaOn = input.etaOn.trim();

  if (!serviceTitle || !clientDisplay || !startedOn || !etaOn) {
    return { row: null, error: "Completá título, cliente, inicio y entrega estimada." };
  }

  const { data, error } = await supabase
    .from("commissions_in_progress")
    .insert({
      status_label: input.statusLabel?.trim() || "En curso",
      service_title: serviceTitle,
      client_display: clientDisplay,
      started_label: input.startedLabel?.trim() || "Inicio",
      started_on: startedOn,
      eta_label: input.etaLabel?.trim() || "Entrega estimada",
      eta_on: etaOn,
    })
    .select(
      "id, created_at, status_label, service_title, client_display, started_label, started_on, eta_label, eta_on",
    )
    .single();

  if (error) return { row: null, error: error.message };

  const normalized = normalizeRow(data as Record<string, unknown>);
  if (!normalized) return { row: null, error: "Respuesta inválida del servidor." };

  return { row: mapRow(normalized), error: null };
}

export async function deleteCommissionInProgress(
  id: string,
): Promise<{ ok: boolean; error: string | null }> {
  if (!isCommissionInProgressId(id)) {
    return { ok: false, error: "ID inválido." };
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return { ok: false, error: "Falta SUPABASE_SERVICE_ROLE_KEY en el servidor." };
  }

  const { error, count } = await supabase
    .from("commissions_in_progress")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  if (!count) return { ok: false, error: "Comisión no encontrada." };

  return { ok: true, error: null };
}
