"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { iniciarAcessoComo } from "@/lib/auth/session";
import { podeAprovarIgrejas, podeGerenciarPagamentos, webmasterDaSessao } from "@/lib/auth/permissoes";
import { atualizarStatusIgreja, atualizarChavePixIgreja, getUsuariosDaIgreja } from "@/lib/db/repo";

export async function aprovarIgrejaAction(formData: FormData) {
  const webmaster = await webmasterDaSessao();
  if (!webmaster || !podeAprovarIgrejas(webmaster)) return;

  const igrejaId = String(formData.get("igrejaId"));
  await atualizarStatusIgreja(igrejaId, "aprovado");
  revalidatePath("/admin/igrejas");
}

export async function reprovarIgrejaAction(formData: FormData) {
  const webmaster = await webmasterDaSessao();
  if (!webmaster || !podeAprovarIgrejas(webmaster)) return;

  const igrejaId = String(formData.get("igrejaId"));
  await atualizarStatusIgreja(igrejaId, "reprovado");
  revalidatePath("/admin/igrejas");
}

export async function editarChavePixAction(formData: FormData) {
  const webmaster = await webmasterDaSessao();
  if (!webmaster || !podeGerenciarPagamentos(webmaster)) return;

  const igrejaId = String(formData.get("igrejaId"));
  const chavePix = String(formData.get("chavePix") ?? "").trim();
  if (!igrejaId || !chavePix) return;

  await atualizarChavePixIgreja(igrejaId, chavePix);
  revalidatePath("/admin/igrejas");
}

// "Acessar como": entra no painel da igreja usando o usuário administrador
// dela — dá pra ver exatamente as mesmas telas que a igreja vê.
export async function acessarComoIgrejaAction(formData: FormData) {
  const webmaster = await webmasterDaSessao();
  if (!webmaster) return;

  const igrejaId = String(formData.get("igrejaId"));
  if (!igrejaId) return;

  const usuarios = await getUsuariosDaIgreja(igrejaId);
  const usuario = usuarios[0];
  if (!usuario) return;

  await iniciarAcessoComo(
    { papel: "igreja", usuarioId: usuario.id, igrejaId, nome: usuario.nome },
    { webmasterId: webmaster.id, webmasterNome: webmaster.nome }
  );
  redirect("/igreja/dashboard");
}
