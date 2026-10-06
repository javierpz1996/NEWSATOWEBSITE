import { deleteCartSubmission } from "@/lib/cart-submissions";
import { isSalesAccessGranted } from "@/lib/sales-access";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isSalesAccessGranted())) {
    return NextResponse.json({ ok: false, message: "No autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const result = await deleteCartSubmission(id);

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, message: result.error ?? "No se pudo borrar." },
      { status: result.error === "Pedido no encontrado." ? 404 : 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
