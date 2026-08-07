"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSessao } from "@/lib/auth/session";
import { gateway } from "@/lib/payments";
import type { MeioPagamento, TipoArrecadacao } from "@/lib/types";

export async function doarAction(formData: FormData) {
  const sessao = await getSessao();
  if (!sessao?.igrejaId) return;

  const tipo = String(formData.get("tipo")) as TipoArrecadacao;
  const meio = String(formData.get("meio")) as MeioPagamento;
  const valorBruto = Number(formData.get("valor"));
  const campanhaId = (formData.get("campanhaId") as string) || null;

  if (!valorBruto || valorBruto <= 0) return;

  const resultado = await gateway.criarCobranca({
    igrejaId: sessao.igrejaId,
    fielId: sessao.usuarioId,
    tipo,
    campanhaId,
    meio,
    valorBruto,
  });

  revalidatePath("/fiel/inicio");
  revalidatePath("/fiel/historico");
  revalidatePath("/fiel/campanhas");
  redirect(`/fiel/doar/comprovante/${resultado.id}`);
}
