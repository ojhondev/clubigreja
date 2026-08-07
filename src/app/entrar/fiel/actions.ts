"use server";

import { redirect } from "next/navigation";
import { getFielPorTelefone } from "@/lib/mock-db";
import { criarSessao } from "@/lib/auth/session";

export interface EstadoLoginFiel {
  erro?: string;
}

// O código de verificação ainda não é enviado/checado de verdade — não há
// provedor de SMS conectado. A etapa já existe na tela para o fluxo ficar
// completo assim que plugarmos um envio real.
export async function entrarFielTelefoneAction(
  _estadoAnterior: EstadoLoginFiel,
  formData: FormData
): Promise<EstadoLoginFiel> {
  const telefone = String(formData.get("telefone") ?? "").trim();
  if (!telefone) return { erro: "Informe seu celular." };

  const fiel = getFielPorTelefone(telefone);
  if (!fiel) {
    return { erro: "Não encontramos esse número. Cadastre-se para começar." };
  }

  await criarSessao({
    papel: "fiel",
    usuarioId: fiel.id,
    igrejaId: fiel.igrejaId,
    nome: fiel.nome,
  });

  redirect("/fiel/inicio");
}
