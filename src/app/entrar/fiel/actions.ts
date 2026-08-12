"use server";

import { redirect } from "next/navigation";
import { autenticarFiel } from "@/lib/db/repo";
import { criarSessao } from "@/lib/auth/session";

export interface EstadoLoginFiel {
  erro?: string;
}

export async function entrarFielTelefoneAction(
  _estadoAnterior: EstadoLoginFiel,
  formData: FormData
): Promise<EstadoLoginFiel> {
  const telefone = String(formData.get("telefone") ?? "").trim();
  const senha = String(formData.get("senha") ?? "");
  if (!telefone || !senha) return { erro: "Informe seu celular e senha." };

  const fiel = await autenticarFiel(telefone, senha);
  if (!fiel) {
    return { erro: "Celular ou senha incorretos." };
  }

  await criarSessao({
    papel: "fiel",
    usuarioId: fiel.id,
    igrejaId: fiel.igrejaId,
    nome: fiel.nome,
  });

  redirect("/fiel/inicio");
}
