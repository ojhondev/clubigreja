"use server";

import { redirect } from "next/navigation";
import { criarFiel, getIgreja } from "@/lib/db/repo";
import { criarSessao } from "@/lib/auth/session";

export interface EstadoCadastroFiel {
  erro?: string;
}

export async function cadastrarFielAction(
  _estadoAnterior: EstadoCadastroFiel,
  formData: FormData
): Promise<EstadoCadastroFiel> {
  const nome = String(formData.get("nome") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const igrejaId = String(formData.get("igrejaId") ?? "").trim();

  if (!nome || !telefone || !igrejaId) {
    return { erro: "Preencha nome, telefone e selecione sua igreja." };
  }

  if (!(await getIgreja(igrejaId))) {
    return { erro: "Igreja inválida." };
  }

  const fiel = await criarFiel({ igrejaId, nome, telefone });

  await criarSessao({
    papel: "fiel",
    usuarioId: fiel.id,
    igrejaId: fiel.igrejaId,
    nome: fiel.nome,
  });

  redirect("/fiel/inicio");
}
