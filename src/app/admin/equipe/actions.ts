"use server";

import { revalidatePath } from "next/cache";
import { getSessao } from "@/lib/auth/session";
import {
  getWebmasterPorId,
  gerarConviteWebmaster,
  atualizarPermissoesWebmaster,
  getTodosMembrosWebmaster,
} from "@/lib/db/repo";

export interface EstadoConvidarWebmaster {
  erro?: string;
  sucesso?: boolean;
}

// Toda action aqui reconfirma que quem chamou é o Master Primário — a
// sessão sozinha não basta, porque o nível pode ter mudado desde o login
// (ex.: nunca muda de fato hoje, mas a checagem é barata e evita depender
// só do cookie).
async function exigirMasterPrimario() {
  const sessao = await getSessao();
  if (sessao?.papel !== "webmaster") return null;
  const webmaster = await getWebmasterPorId(sessao.usuarioId);
  if (!webmaster || webmaster.nivel !== "primario") return null;
  return webmaster;
}

export async function convidarWebmasterAction(
  _estadoAnterior: EstadoConvidarWebmaster,
  formData: FormData
): Promise<EstadoConvidarWebmaster> {
  const primario = await exigirMasterPrimario();
  if (!primario) return { erro: "Apenas o Master Primário pode convidar novos membros." };

  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const podeGerenciarPagamentos = formData.get("podeGerenciarPagamentos") === "on";
  const podeAprovarIgrejas = formData.get("podeAprovarIgrejas") === "on";

  if (!nome || !email) {
    return { erro: "Preencha nome e e-mail do convidado." };
  }

  const membros = await getTodosMembrosWebmaster();
  if (membros.some((m) => m.email.toLowerCase() === email.toLowerCase())) {
    return { erro: "Já existe um membro (ou convite pendente) com esse e-mail." };
  }

  await gerarConviteWebmaster({ nome, email, podeGerenciarPagamentos, podeAprovarIgrejas, convidadoPorId: primario.id });
  revalidatePath("/admin/equipe");
  return { sucesso: true };
}

export async function atualizarPermissoesWebmasterAction(formData: FormData): Promise<void> {
  const primario = await exigirMasterPrimario();
  if (!primario) return;

  const id = String(formData.get("id") ?? "");
  if (!id || id === primario.id) return;

  const podeGerenciarPagamentos = formData.get("podeGerenciarPagamentos") === "on";
  const podeAprovarIgrejas = formData.get("podeAprovarIgrejas") === "on";

  await atualizarPermissoesWebmaster(id, { podeGerenciarPagamentos, podeAprovarIgrejas });
  revalidatePath("/admin/equipe");
}
