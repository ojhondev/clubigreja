"use server";

import { revalidatePath } from "next/cache";
import { getSessao } from "@/lib/auth/session";
import { criarLinkPagamento } from "@/lib/db/repo";
import type { TipoArrecadacao } from "@/lib/types";

export async function criarLink(formData: FormData) {
  const sessao = await getSessao();
  if (!sessao?.igrejaId) return;

  const titulo = String(formData.get("titulo") ?? "").trim();
  const tipo = String(formData.get("tipo") ?? "livre") as TipoArrecadacao;
  const valorSugeridoRaw = String(formData.get("valorSugerido") ?? "").trim();
  const valorSugerido = valorSugeridoRaw ? Number(valorSugeridoRaw) : null;

  if (!titulo) return;

  await criarLinkPagamento({ igrejaId: sessao.igrejaId, titulo, tipo, valorSugerido });
  revalidatePath("/igreja/links");
}
