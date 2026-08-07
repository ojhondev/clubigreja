import { NextResponse } from "next/server";
import { getSessao } from "@/lib/auth/session";
import { salvarInscricaoPush } from "@/lib/push/store";

export async function POST(request: Request) {
  const sessao = await getSessao();
  if (!sessao || sessao.papel !== "fiel") {
    return NextResponse.json({ error: "não autenticado" }, { status: 401 });
  }

  const subscription = await request.json();
  salvarInscricaoPush(sessao.usuarioId, subscription);

  return NextResponse.json({ ok: true });
}
