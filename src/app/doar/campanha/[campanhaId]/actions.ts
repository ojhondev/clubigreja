"use server";

import { redirect } from "next/navigation";
import { getCampanha, criarFielConvidado } from "@/lib/mock-db";
import { gateway } from "@/lib/payments";

export async function doarCampanhaPublicoAction(formData: FormData) {
  const campanhaId = String(formData.get("campanhaId"));
  const campanha = getCampanha(campanhaId);
  if (!campanha) return;

  const nome = String(formData.get("nome") ?? "").trim();
  const valorBruto = Number(formData.get("valor"));
  const cartaoNumero = formData.get("cartaoNumero");
  const cartaoNome = formData.get("cartaoNome");
  if (!valorBruto || valorBruto <= 0) return;

  const fielConvidado = criarFielConvidado(campanha.igrejaId, nome);

  const resultado = await gateway.criarCobranca({
    igrejaId: campanha.igrejaId,
    fielId: fielConvidado.id,
    tipo: "campanha",
    campanhaId: campanha.id,
    valorBruto,
    novoCartao:
      cartaoNumero && cartaoNome ? { numero: String(cartaoNumero), nome: String(cartaoNome) } : undefined,
  });

  redirect(`/doar/comprovante/${resultado.id}`);
}
