import {
  deleteCommissionInProgress,
  updateCommissionInProgress,
} from "@/lib/commissions-in-progress-db";
import { isCommissionProcessStage } from "@/lib/commission-process-stages";
import { isSalesAccessGranted } from "@/lib/sales-access";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isSalesAccessGranted())) {
    return NextResponse.json({ ok: false, message: "No autorizado." }, { status: 401 });
  }

  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Cuerpo inválido." }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const statusLabel = String(payload.statusLabel ?? "").trim();
  if (!isCommissionProcessStage(statusLabel)) {
    return NextResponse.json({ ok: false, message: "Etapa del proceso inválida." }, { status: 400 });
  }

  const result = await updateCommissionInProgress(id, { statusLabel });

  if (!result.row) {
    return NextResponse.json(
      { ok: false, message: result.error ?? "No se pudo actualizar." },
      { status: result.error === "Comisión no encontrada." ? 404 : 400 },
    );
  }

  return NextResponse.json({ ok: true, commission: result.row });
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isSalesAccessGranted())) {
    return NextResponse.json({ ok: false, message: "No autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const result = await deleteCommissionInProgress(id);

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, message: result.error ?? "No se pudo borrar." },
      { status: result.error === "Comisión no encontrada." ? 404 : 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
