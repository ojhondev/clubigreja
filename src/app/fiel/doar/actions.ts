"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSessao } from "@/lib/auth/session";
import { gateway } from "@/lib/payments";
import type { TipoArrecadacao } from "@/lib/types";

export async function doarAction(formData: FormData) {
  const sessao = await getSessao();
  if (!sessao?.igrejaId) return;

  const tipo = String(formData.get("tipo")) as TipoArrecadacao;
  const valorBruto = Number(formData.get("valor"));
  const campanhaId = (formData.get("campanhaId") as string) || null;
  const cartaoNumero = formData.get("cartaoNumero");
  const cartaoNome = formData.get("cartaoNome");

  if (!valorBruto || valorBruto <= 0) return;

  const resultado = await gateway.criarCobranca({
    igrejaId: sessao.igrejaId,
    fielId: sessao.usuarioId,
    tipo,
    campanhaId,
    valorBruto,
    novoCartao:
      cartaoNumero && cartaoNome ? { numero: String(cartaoNumero), nome: String(cartaoNome) } : undefined,
  });

  revalidatePath("/fiel/inicio");
  revalidatePath("/fiel/historico");
  revalidatePath("/fiel/campanhas");
  redirect(`/fiel/doar/comprovante/${resultado.id}`);
}
