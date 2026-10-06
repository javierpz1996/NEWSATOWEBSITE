import { deleteCommissionInProgress } from "@/lib/commissions-in-progress-db";
import { isSalesAccessGranted } from "@/lib/sales-access";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

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
