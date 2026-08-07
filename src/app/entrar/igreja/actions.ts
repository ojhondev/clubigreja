"use server";

import { redirect } from "next/navigation";
import { getUsuarioIgrejaPorEmail } from "@/lib/mock-db";
import { criarSessao } from "@/lib/auth/session";

export interface EstadoLoginIgreja {
  erro?: string;
}

// A senha ainda não é validada de verdade — isso entra junto da integração
// de autenticação real (produção). Por enquanto o login segue só pelo
// e-mail já cadastrado, para o fluxo de telas ficar completo desde já.
export async function entrarIgrejaEmailAction(
  _estadoAnterior: EstadoLoginIgreja,
  formData: FormData
): Promise<EstadoLoginIgreja> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { erro: "Informe seu e-mail." };

  const usuario = getUsuarioIgrejaPorEmail(email);
  if (!usuario) {
    return { erro: "Não encontramos essa conta. Verifique o e-mail ou cadastre sua igreja." };
  }

  await criarSessao({
    papel: "igreja",
    usuarioId: usuario.id,
    igrejaId: usuario.igrejaId,
    nome: usuario.nome,
  });

  redirect("/igreja/dashboard");
}
