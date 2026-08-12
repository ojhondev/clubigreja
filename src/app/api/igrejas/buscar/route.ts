import { NextResponse } from "next/server";
import { buscarIgrejasAprovadas } from "@/lib/db/repo";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";

  const resultados = (await buscarIgrejasAprovadas(q)).map((i) => ({
    id: i.id,
    nome: i.nome,
    cidade: i.cidade,
    uf: i.uf,
    logoEmoji: i.logoEmoji,
  }));

  return NextResponse.json({ resultados });
}
