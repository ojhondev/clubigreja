"use server";

import { revalidatePath } from "next/cache";
import { getSessao } from "@/lib/auth/session";
import { atualizarStatusIgreja, atualizarChavePixIgreja, getWebmasterPorId } from "@/lib/db/repo";
import type { Webmaster } from "@/lib/types";

async function webmasterDaSessao(): Promise<Webmaster | null> {
  const sessao = await getSessao();
  if (sessao?.papel !== "webmaster") return null;
  return (await getWebmasterPorId(sessao.usuarioId)) ?? null;
}

async function podeAprovarIgrejas(webmaster: Webmaster): Promise<boolean> {
  return webmaster.nivel === "primario" || webmaster.podeAprovarIgrejas;
}

async function podeGerenciarPagamentos(webmaster: Webmaster): Promise<boolean> {
  return webmaster.nivel === "primario" || webmaster.podeGerenciarPagamentos;
}

export async function aprovarIgrejaAction(formData: FormData) {
  const webmaster = await webmasterDaSessao();
  if (!webmaster || !(await podeAprovarIgrejas(webmaster))) return;

  const igrejaId = String(formData.get("igrejaId"));
  await atualizarStatusIgreja(igrejaId, "aprovado");
  revalidatePath("/admin/igrejas");
}

export async function reprovarIgrejaAction(formData: FormData) {
  const webmaster = await webmasterDaSessao();
  if (!webmaster || !(await podeAprovarIgrejas(webmaster))) return;

  const igrejaId = String(formData.get("igrejaId"));
  await atualizarStatusIgreja(igrejaId, "reprovado");
  revalidatePath("/admin/igrejas");
}

export async function editarChavePixAction(formData: FormData) {
  const webmaster = await webmasterDaSessao();
  if (!webmaster || !(await podeGerenciarPagamentos(webmaster))) return;

  const igrejaId = String(formData.get("igrejaId"));
  const chavePix = String(formData.get("chavePix") ?? "").trim();
  if (!igrejaId || !chavePix) return;

  await atualizarChavePixIgreja(igrejaId, chavePix);
  revalidatePath("/admin/igrejas");
}
