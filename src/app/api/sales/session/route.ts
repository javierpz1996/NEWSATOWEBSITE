import { SALES_ACCESS_COOKIE, getSalesAccessTokenEnv } from "@/lib/sales-access";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const expected = getSalesAccessTokenEnv();
  if (!expected) {
    return NextResponse.json(
      { ok: false, message: "SALES_ACCESS_TOKEN no está configurado en el servidor." },
      { status: 503 },
    );
  }

  let body: { token?: string };
  try {
    body = (await request.json()) as { token?: string };
  } catch {
    return NextResponse.json({ ok: false, message: "Cuerpo inválido." }, { status: 400 });
  }

  const token = body.token?.trim();
  if (!token || token !== expected) {
    return NextResponse.json({ ok: false, message: "Clave incorrecta." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SALES_ACCESS_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
