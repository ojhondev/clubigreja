"use server";

import { revalidatePath } from "next/cache";
import { getSessao } from "@/lib/auth/session";
import { atualizarCampanha, alternarEncerramentoCampanha, criarCampanha, removerCampanha } from "@/lib/db/repo";

export async function criarCampanhaAction(formData: FormData) {
  const sessao = await getSessao();
  if (!sessao?.igrejaId) return;

  const titulo = String(formData.get("titulo") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim();
  const meta = Number(formData.get("meta") ?? 0);
  const prazo = String(formData.get("prazo") ?? "");
  const imagemEmoji = String(formData.get("imagemEmoji") ?? "🙏");

  if (!titulo || !meta || !prazo) return;

  await criarCampanha({ igrejaId: sessao.igrejaId, titulo, descricao, meta, prazo, imagemEmoji });
  revalidatePath("/igreja/campanhas");
  revalidatePath("/igreja/dashboard");
}

export async function atualizarCampanhaAction(formData: FormData) {
  const sessao = await getSessao();
  if (!sessao?.igrejaId) return;

  const campanhaId = String(formData.get("campanhaId") ?? "");
  const titulo = String(formData.get("titulo") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim();
  const meta = Number(formData.get("meta") ?? 0);
  const prazo = String(formData.get("prazo") ?? "");
  const imagemEmoji = String(formData.get("imagemEmoji") ?? "🙏");

  if (!campanhaId || !titulo || !meta || !prazo) return;

  await atualizarCampanha(campanhaId, sessao.igrejaId, { titulo, descricao, meta, prazo, imagemEmoji });
  revalidatePath("/igreja/campanhas");
  revalidatePath("/igreja/dashboard");
}

export async function alternarEncerramentoCampanhaAction(formData: FormData) {
  const sessao = await getSessao();
  if (!sessao?.igrejaId) return;

  const campanhaId = String(formData.get("campanhaId") ?? "");
  const encerrada = formData.get("encerrada") === "true";
  if (!campanhaId) return;

  await alternarEncerramentoCampanha(campanhaId, sessao.igrejaId, encerrada);
  revalidatePath("/igreja/campanhas");
  revalidatePath("/igreja/dashboard");
}

export async function removerCampanhaAction(formData: FormData) {
  const sessao = await getSessao();
  if (!sessao?.igrejaId) return;

  const campanhaId = String(formData.get("campanhaId") ?? "");
  if (!campanhaId) return;

  await removerCampanha(campanhaId, sessao.igrejaId);
  revalidatePath("/igreja/campanhas");
  revalidatePath("/igreja/dashboard");
}
