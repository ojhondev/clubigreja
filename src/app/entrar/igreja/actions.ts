"use server";

import { redirect } from "next/navigation";
import { autenticarIgreja } from "@/lib/db/repo";
import { criarSessao } from "@/lib/auth/session";

export interface EstadoLoginIgreja {
  erro?: string;
}

export async function entrarIgrejaEmailAction(
  _estadoAnterior: EstadoLoginIgreja,
  formData: FormData,
): Promise<EstadoLoginIgreja> {
  const email = String(formData.get("email") ?? "").trim();
  const senha = String(formData.get("senha") ?? "");
  if (!email || !senha) return { erro: "Informe seu e-mail e senha." };

  const usuario = await autenticarIgreja(email, senha);
  if (!usuario) {
    return { erro: "E-mail ou senha incorretos." };
  }

  await criarSessao({
    papel: "igreja",
    usuarioId: usuario.id,
    igrejaId: usuario.igrejaId,
    nome: usuario.nome,
  });

  redirect("/igreja/dashboard");
}
