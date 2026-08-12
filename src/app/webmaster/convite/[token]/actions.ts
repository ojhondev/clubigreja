"use server";

import { redirect } from "next/navigation";
import { aceitarConviteWebmaster } from "@/lib/db/repo";
import { criarSessao } from "@/lib/auth/session";

export interface EstadoConviteWebmaster {
  erro?: string;
}

export async function aceitarConviteWebmasterAction(
  _estadoAnterior: EstadoConviteWebmaster,
  formData: FormData
): Promise<EstadoConviteWebmaster> {
  const token = String(formData.get("token") ?? "");
  const senha = String(formData.get("senha") ?? "");
  const confirmarSenha = String(formData.get("confirmarSenha") ?? "");

  if (!token) return { erro: "Convite inválido." };
  if (senha.length < 6) return { erro: "A senha precisa ter pelo menos 6 caracteres." };
  if (senha !== confirmarSenha) return { erro: "As senhas não coincidem." };

  const webmaster = await aceitarConviteWebmaster(token, senha);
  if (!webmaster) {
    return { erro: "Convite inválido ou expirado. Peça um novo convite ao Master Primário." };
  }

  await criarSessao({
    papel: "webmaster",
    usuarioId: webmaster.id,
    nome: webmaster.nome,
  });

  redirect("/admin/igrejas");
}
