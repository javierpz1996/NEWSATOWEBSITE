import {
  createCommissionInProgress,
  listCommissionsInProgressServer,
} from "@/lib/commissions-in-progress-db";
import { isSalesAccessGranted } from "@/lib/sales-access";
import { NextResponse } from "next/server";

export async function GET() {
  const { rows, error } = await listCommissionsInProgressServer();
  if (error) {
    return NextResponse.json({ commissions: [], error }, { status: 500 });
  }
  return NextResponse.json(
    { commissions: rows },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  if (!(await isSalesAccessGranted())) {
    return NextResponse.json({ ok: false, message: "No autorizado." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Cuerpo inválido." }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const result = await createCommissionInProgress({
    serviceTitle: String(payload.serviceTitle ?? ""),
    clientDisplay: String(payload.clientDisplay ?? ""),
    startedOn: String(payload.startedOn ?? ""),
    etaOn: String(payload.etaOn ?? ""),
    statusLabel: payload.statusLabel ? String(payload.statusLabel) : undefined,
    startedLabel: payload.startedLabel ? String(payload.startedLabel) : undefined,
    etaLabel: payload.etaLabel ? String(payload.etaLabel) : undefined,
  });

  if (!result.row) {
    return NextResponse.json(
      { ok: false, message: result.error ?? "No se pudo crear." },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true, commission: result.row });
}
