"use server";

import { redirect } from "next/navigation";
import { gateway } from "@/lib/payments";

export async function confirmarPagamentoPublicoAction(formData: FormData) {
  const contribuicaoId = String(formData.get("contribuicaoId"));
  if (!contribuicaoId) return;

  const resultado = await gateway.confirmarPagamento(contribuicaoId);
  redirect(`/doar/comprovante/${resultado.id}`);
}
