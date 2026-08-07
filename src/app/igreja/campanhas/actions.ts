"use server";

import { revalidatePath } from "next/cache";
import { getSessao } from "@/lib/auth/session";
import { criarCampanha } from "@/lib/mock-db";

export async function criarCampanhaAction(formData: FormData) {
  const sessao = await getSessao();
  if (!sessao?.igrejaId) return;

  const titulo = String(formData.get("titulo") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim();
  const meta = Number(formData.get("meta") ?? 0);
  const prazo = String(formData.get("prazo") ?? "");
  const imagemEmoji = String(formData.get("imagemEmoji") ?? "🙏");

  if (!titulo || !meta || !prazo) return;

  criarCampanha({ igrejaId: sessao.igrejaId, titulo, descricao, meta, prazo, imagemEmoji });
  revalidatePath("/igreja/campanhas");
  revalidatePath("/igreja/dashboard");
}
