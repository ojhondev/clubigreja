"use server";

import { redirect } from "next/navigation";
import { getSessao } from "@/lib/auth/session";
import { getCampanha } from "@/lib/db/repo";
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

  // Nunca confiar no campanhaId vindo do form: sem essa revalidação, um
  // campanhaId de outra igreja injetado direto na Server Action (sem passar
  // pela tela, que já filtra) criaria uma contribuição com igrejaId da
  // própria igreja do fiel mas campanhaId de outra — inflando o total
  // arrecadado (público) da campanha alheia.
  if (campanhaId) {
    const campanha = await getCampanha(campanhaId, sessao.igrejaId);
    if (!campanha) return;
  }

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
