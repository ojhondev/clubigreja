"use server";

import { redirect } from "next/navigation";
import { getSessao } from "@/lib/auth/session";
import { gateway } from "@/lib/payments";
import type { TipoArrecadacao } from "@/lib/types";

// Etapa 1 do fluxo real: só registra a intenção e prepara o Pix — nenhuma
// cobrança acontece aqui. A confirmação (e a cobrança da taxa) só rola na
// etapa 2, em /fiel/doar/pagar/[id].
export async function iniciarDoacaoAction(formData: FormData) {
  const sessao = await getSessao();
  if (!sessao?.igrejaId) return;

  const tipo = String(formData.get("tipo")) as TipoArrecadacao;
  const valorBruto = Number(formData.get("valor"));
  const campanhaId = (formData.get("campanhaId") as string) || null;
  const cartaoNumero = formData.get("cartaoNumero");
  const cartaoNome = formData.get("cartaoNome");

  if (!valorBruto || valorBruto <= 0) return;

  const dados = await gateway.iniciarContribuicao({
    igrejaId: sessao.igrejaId,
    fielId: sessao.usuarioId,
    tipo,
    campanhaId,
    valorBruto,
    novoCartao:
      cartaoNumero && cartaoNome
        ? { numero: String(cartaoNumero), nome: String(cartaoNome) }
        : undefined,
  });

  redirect(`/fiel/doar/pagar/${dados.contribuicaoId}`);
}
