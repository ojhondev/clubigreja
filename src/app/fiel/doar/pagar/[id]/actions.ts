"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSessao } from "@/lib/auth/session";
import { gateway } from "@/lib/payments";

// Etapa 2: só chamada depois que o fiel volta e confirma que já pagou o Pix.
// É esse clique que dispara a cobrança automática da taxa no cartão salvo.
//
// A contribuição só é confirmada se pertencer à sessão de fiel atual — sem
// isso, uma sessão autenticada conseguiria confirmar (e disparar cobrança
// de taxa em cima de) a contribuição de qualquer outra pessoa só sabendo o
// id (achado C2 da auditoria).
export async function confirmarPagamentoAction(formData: FormData) {
  const sessao = await getSessao();
  if (sessao?.papel !== "fiel") return;

  const contribuicaoId = String(formData.get("contribuicaoId"));
  if (!contribuicaoId) return;

  const resultado = await gateway.confirmarPagamento(
    contribuicaoId,
    sessao.usuarioId,
  );

  revalidatePath("/fiel/inicio");
  revalidatePath("/fiel/historico");
  revalidatePath("/fiel/campanhas");
  redirect(`/fiel/doar/comprovante/${resultado.id}`);
}
