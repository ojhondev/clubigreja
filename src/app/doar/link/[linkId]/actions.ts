"use server";

import { redirect } from "next/navigation";
import { linksPagamento, criarFielConvidado } from "@/lib/mock-db";
import { gateway } from "@/lib/payments";

export async function doarPublicoAction(formData: FormData) {
  const linkId = String(formData.get("linkId"));
  const link = linksPagamento.find((l) => l.id === linkId);
  if (!link) return;

  const nome = String(formData.get("nome") ?? "").trim();
  const valorBruto = Number(formData.get("valor"));
  const cartaoNumero = formData.get("cartaoNumero");
  const cartaoNome = formData.get("cartaoNome");
  if (!valorBruto || valorBruto <= 0) return;

  const fielConvidado = criarFielConvidado(link.igrejaId, nome);

  const resultado = await gateway.criarCobranca({
    igrejaId: link.igrejaId,
    fielId: fielConvidado.id,
    tipo: link.tipo,
    campanhaId: null,
    valorBruto,
    novoCartao:
      cartaoNumero && cartaoNome ? { numero: String(cartaoNumero), nome: String(cartaoNome) } : undefined,
  });

  redirect(`/doar/comprovante/${resultado.id}`);
}
