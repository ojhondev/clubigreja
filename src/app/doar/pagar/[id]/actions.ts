"use server";

import { redirect } from "next/navigation";
import { gateway } from "@/lib/payments";

// Fluxo de convidado, sem sessão pra validar contra — o próprio
// contribuicaoId (10 hex chars aleatórios) funciona como capability, mesmo
// padrão do link/campanha públicos. Ver confirmarPagamentoAction (variante
// autenticada, em /fiel/doar/pagar/[id]/actions.ts) para o caso com sessão,
// onde a posse É validada.
export async function confirmarPagamentoPublicoAction(formData: FormData) {
  const contribuicaoId = String(formData.get("contribuicaoId"));
  if (!contribuicaoId) return;

  const resultado = await gateway.confirmarPagamento(contribuicaoId);
  redirect(`/doar/comprovante/${resultado.id}`);
}
