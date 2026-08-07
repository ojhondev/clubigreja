"use server";

import { redirect } from "next/navigation";
import { getCampanha, criarFielConvidado } from "@/lib/mock-db";
import { gateway } from "@/lib/payments";
import type { MeioPagamento } from "@/lib/types";

export async function doarCampanhaPublicoAction(formData: FormData) {
  const campanhaId = String(formData.get("campanhaId"));
  const campanha = getCampanha(campanhaId);
  if (!campanha) return;

  const nome = String(formData.get("nome") ?? "").trim();
  const meio = String(formData.get("meio")) as MeioPagamento;
  const valorBruto = Number(formData.get("valor"));
  if (!valorBruto || valorBruto <= 0) return;

  const fielConvidado = criarFielConvidado(campanha.igrejaId, nome);

  const resultado = await gateway.criarCobranca({
    igrejaId: campanha.igrejaId,
    fielId: fielConvidado.id,
    tipo: "campanha",
    campanhaId: campanha.id,
    meio,
    valorBruto,
  });

  redirect(`/doar/comprovante/${resultado.id}`);
}
