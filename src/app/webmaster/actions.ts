"use server";

import { redirect } from "next/navigation";
import { autenticarWebmaster, criarWebmasterPrimario, existeWebmaster } from "@/lib/db/repo";
import { criarSessao } from "@/lib/auth/session";

export interface EstadoWebmaster {
  erro?: string;
}

export async function entrarWebmasterAction(
  _estadoAnterior: EstadoWebmaster,
  formData: FormData
): Promise<EstadoWebmaster> {
  const email = String(formData.get("email") ?? "").trim();
  const senha = String(formData.get("senha") ?? "");
  if (!email || !senha) return { erro: "Informe seu e-mail e senha." };

  const webmaster = await autenticarWebmaster(email, senha);
  if (!webmaster) {
    return { erro: "E-mail ou senha incorretos." };
  }

  await criarSessao({
    papel: "webmaster",
    usuarioId: webmaster.id,
    nome: webmaster.nome,
  });

  redirect("/admin/igrejas");
}

export async function criarWebmasterPrimarioAction(
  _estadoAnterior: EstadoWebmaster,
  formData: FormData
): Promise<EstadoWebmaster> {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const senha = String(formData.get("senha") ?? "");
  const confirmarSenha = String(formData.get("confirmarSenha") ?? "");

  if (!nome || !email || !senha) {
    return { erro: "Preencha todos os campos." };
  }
  if (senha.length < 6) {
    return { erro: "A senha precisa ter pelo menos 6 caracteres." };
  }
  if (senha !== confirmarSenha) {
    return { erro: "As senhas não coincidem." };
  }

  // Checagem de novo, dentro da action: se alguém já criou o Master Primário
  // entre o carregamento da página e esse submit, não deixa criar outro.
  if (await existeWebmaster()) {
    return { erro: "O Master Primário já foi configurado. Peça um convite a ele." };
  }

  const webmaster = await criarWebmasterPrimario({ nome, email, senha });
  if (!webmaster) {
    return { erro: "O Master Primário já foi configurado. Peça um convite a ele." };
  }

  await criarSessao({
    papel: "webmaster",
    usuarioId: webmaster.id,
    nome: webmaster.nome,
  });

  redirect("/admin/igrejas");
}
