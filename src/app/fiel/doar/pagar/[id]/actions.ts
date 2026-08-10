"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { gateway } from "@/lib/payments";

// Etapa 2: só chamada depois que o fiel volta e confirma que já pagou o Pix.
// É esse clique que dispara a cobrança automática da taxa no cartão salvo.
export async function confirmarPagamentoAction(formData: FormData) {
  const contribuicaoId = String(formData.get("contribuicaoId"));
  if (!contribuicaoId) return;

  const resultado = await gateway.confirmarPagamento(contribuicaoId);

  revalidatePath("/fiel/inicio");
  revalidatePath("/fiel/historico");
  revalidatePath("/fiel/campanhas");
  redirect(`/fiel/doar/comprovante/${resultado.id}`);
}
