"use server";

import { revalidatePath } from "next/cache";
import { getSessao } from "@/lib/auth/session";
import { criarEvento } from "@/lib/db/repo";

export async function criarEventoAction(formData: FormData) {
  const sessao = await getSessao();
  if (!sessao?.igrejaId) return;

  const titulo = String(formData.get("titulo") ?? "").trim();
  const data = String(formData.get("data") ?? "");
  const local = String(formData.get("local") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim();
  const arrecadacaoVinculada = formData.get("arrecadacaoVinculada") === "on";

  if (!titulo || !data || !local) return;

  await criarEvento({
    igrejaId: sessao.igrejaId,
    titulo,
    data,
    local,
    descricao,
    arrecadacaoVinculada,
  });
  revalidatePath("/igreja/eventos");
}
