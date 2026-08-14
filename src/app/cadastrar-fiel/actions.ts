"use server";

import { redirect } from "next/navigation";
import { criarFiel, getFielPorTelefone, getIgreja } from "@/lib/db/repo";
import { criarSessao } from "@/lib/auth/session";

export interface EstadoCadastroFiel {
  erro?: string;
}

export async function cadastrarFielAction(
  _estadoAnterior: EstadoCadastroFiel,
  formData: FormData,
): Promise<EstadoCadastroFiel> {
  const nome = String(formData.get("nome") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const igrejaId = String(formData.get("igrejaId") ?? "").trim();
  const senha = String(formData.get("senha") ?? "");
  const confirmarSenha = String(formData.get("confirmarSenha") ?? "");

  if (!nome || !telefone || !igrejaId || !senha) {
    return { erro: "Preencha nome, telefone, senha e selecione sua igreja." };
  }

  if (senha.length < 6) {
    return { erro: "A senha precisa ter pelo menos 6 caracteres." };
  }
  if (senha !== confirmarSenha) {
    return { erro: "As senhas não coincidem." };
  }

  if (!(await getIgreja(igrejaId))) {
    return { erro: "Igreja inválida." };
  }

  if (await getFielPorTelefone(telefone)) {
    return { erro: "Já existe uma conta com esse telefone." };
  }

  const fiel = await criarFiel({ igrejaId, nome, telefone, senha });

  await criarSessao({
    papel: "fiel",
    usuarioId: fiel.id,
    igrejaId: fiel.igrejaId,
    nome: fiel.nome,
  });

  redirect("/fiel/inicio");
}
